export type AidStatusType = "approved" | "pending" | "rejected";

export interface IUserAidsState {
  isLoading: boolean;
  errorMessage: string;
  userAids: IUserAids[];
  userAid: IUserAids | null;
}

export interface IUserAids {
  id: number;
  user_id: number;
  aid_id: number;
  status: AidStatusType;
}
