import type { RoleType } from "@/constants/roles";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  phone: string;
  is_active: boolean;
  created_at: string;
}
