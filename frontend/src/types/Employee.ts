export type UserRole = "ADMIN" | "EMPLOYEE" | "CUSTOMER" | "GUEST" | string;

export interface Employee {
  employeeID: string;
  userName: string;
  password: string;
  email?: string | null;
  phone?: string | null;
  fullName: string;
  address?: string | null;
  userRole: UserRole;
  department: string;
  position: string;
  salary: number;
  hireDate?: string | null;
}
