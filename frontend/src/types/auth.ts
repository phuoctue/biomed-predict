export type UserRole = "ADMIN" | "DOCTOR" | "PHARMACIST";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
};

