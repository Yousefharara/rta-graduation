import type { IUser } from "./user";

export interface ILocalOrgState {
  isLoading: boolean;
  errorMessage: string;
  users: ILocalOrg[];
  user: ILocalOrg | null;
}

export interface ICreateLocalOrg {
  name: string;
  email: string;
  password: string;
  phone: string;
  org_name: string;
  area_id: number;
  focus_area: string;
  staff_count: number | null;
}

export interface ILocalOrg {
  id: number;
  user_id: number;
  org_name: string;
  area_id: number;
  is_verified: boolean;
  focus_area: string;
  staff_count: number;
  users: IUser;
}
