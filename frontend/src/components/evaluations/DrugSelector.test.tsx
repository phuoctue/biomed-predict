import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithQueryClient } from "@/test/render-with-query";

const apiGetMock = vi.fn();
const onAddMock = vi.fn();
const onRemoveMock = vi.fn();

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: (...args: unknown[]) => apiGetMock(...args),
  },
}));

import { DrugSelector } from "./DrugSelector";

describe("DrugSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the first page and filters after user types", async () => {
    apiGetMock
      .mockResolvedValueOnce({
        data: {
          content: [],
          totalPages: 1,
          totalElements: 0,
        },
      })
      .mockResolvedValueOnce({
        data: {
          content: [{ id: "d1", name: "Paracetamol", strength: "500mg" }],
          totalPages: 1,
          totalElements: 1,
        },
      });

    renderWithQueryClient(<DrugSelector drugs={[]} onAdd={onAddMock} onRemove={onRemoveMock} />);

    expect(apiGetMock).not.toHaveBeenCalled();

    await userEvent.type(screen.getByPlaceholderText(/tìm và thêm thuốc/i), "pa");

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledWith("/drugs", {
        params: { keyword: undefined, page: 0, size: 8 },
      });
      expect(apiGetMock).toHaveBeenCalledWith("/drugs", {
        params: { keyword: "pa", page: 0, size: 8 },
      });
    });

    expect(await screen.findByText("Paracetamol")).toBeInTheDocument();
  });

  it("does not search until the dropdown is opened", () => {
    renderWithQueryClient(<DrugSelector drugs={[]} />);

    expect(apiGetMock).not.toHaveBeenCalled();
  });

  it("adds a selected drug and clears search state", async () => {
    apiGetMock
      .mockResolvedValueOnce({
        data: {
          content: [],
          totalPages: 1,
          totalElements: 0,
        },
      })
      .mockResolvedValueOnce({
        data: {
          content: [{ id: "d1", name: "Ibuprofen", strength: "200mg" }],
          totalPages: 1,
          totalElements: 1,
        },
      });

    renderWithQueryClient(<DrugSelector drugs={[]} onAdd={onAddMock} />);

    await userEvent.type(screen.getByPlaceholderText(/tìm và thêm thuốc/i), "ib");
    await screen.findByText("Ibuprofen");
    await userEvent.click(screen.getByText("Ibuprofen"));

    expect(onAddMock).toHaveBeenCalledWith({
      id: "d1",
      name: "Ibuprofen",
      dosage: "200mg",
    });
    expect(screen.getByPlaceholderText(/tìm và thêm thuốc/i)).toHaveValue("");
  });

  it("renders selected drugs and allows removing them", async () => {
    renderWithQueryClient(
      <DrugSelector
        drugs={[{ id: "d1", name: "Paracetamol", dosage: "500mg" }]}
        onRemove={onRemoveMock}
      />
    );

    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    expect(screen.getByText("500mg")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Xóa Paracetamol" }));
    expect(onRemoveMock).toHaveBeenCalledWith("d1");
  });
});
