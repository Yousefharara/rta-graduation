import type { RoleType } from "@/constants/roles";

export interface IUsersState {
  isLoading: boolean;
  errorMessage: string;
  users: IUsers[];
  user: IUsers | null;
}

export interface IUsers {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  phone: string;
  is_active: boolean;
  created_at: string;
}
