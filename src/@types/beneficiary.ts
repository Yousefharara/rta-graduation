import type { IUser } from "./user";

type beneficiaryStatusType = "pending" | "eligible" | "not_eligible";

export interface IBeneficiary {
  id: number;
  user_id: number;
  national_id: string;
  area_id: number;
  family_size: number;

  income: string;
  priority_score: string;

  patients_count: number;
  disabled_count: number;
  is_displaced: boolean;

  status: beneficiaryStatusType;
  created_at: string;
  release_date: Date;

  users: IUser;
}

export interface ICreateBeneficiary {
  name: string;
  email: string;
  release_date: string;
  password: string;
  phone: string;
  national_id: string;
  area_id: number;
  family_size: number;
  income: number;
  patients_count: number;
  disabled_count: number;
  is_displaced?: boolean;
}
