import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

const navigateMock = vi.fn();
const setAuthMock = vi.fn();
const loginApiMock = vi.fn();

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  useNavigate: () => navigateMock,
}));

vi.mock("../store/auth.store", () => ({
  useAuthStore: (selector: (state: { setAuth: typeof setAuthMock }) => unknown) =>
    selector({ setAuth: setAuthMock }),
}));

vi.mock("../api/auth.api", () => ({
  loginApi: (...args: unknown[]) => loginApiMock(...args),
}));

vi.mock("../../../components/layout/role-tabs", () => ({
  RoleTabs: () => <div data-testid="role-tabs" />,
}));

vi.mock("../../../components/layout/login-input", () => ({
  LoginInput: ({
    label,
    type,
    value,
    onChange,
    placeholder,
    rightElement,
    ...props
  }: any) => (
    <label>
      {label}
      <input
        aria-label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {rightElement}
    </label>
  ),
}));

import { LoginPage } from "./login.page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

  it("submits valid credentials and navigates to dashboard", async () => {
    loginApiMock.mockResolvedValueOnce({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { id: "1", email: "doctor@mediai.local", fullName: "Dr. A", role: "doctor" },
    });

    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "doctor@mediai.local");
    await userEvent.type(screen.getByLabelText("Mật khẩu"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(loginApiMock).toHaveBeenCalledTimes(1);
      expect(loginApiMock.mock.calls[0]?.[0]).toEqual({
        email: "doctor@mediai.local",
        password: "123456",
      });
    });

    expect(setAuthMock).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: expect.objectContaining({ email: "doctor@mediai.local" }),
    });
    expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("shows error message when login fails", async () => {
    loginApiMock.mockRejectedValueOnce({
      response: { data: { message: "Sai email hoặc mật khẩu" } },
    });

    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "wrong@mediai.local");
    await userEvent.type(screen.getByLabelText("Mật khẩu"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(await screen.findByText("Sai email hoặc mật khẩu")).toBeInTheDocument();
    expect(setAuthMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText("Mật khẩu");
    expect(passwordInput).toHaveAttribute("type", "password");

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
