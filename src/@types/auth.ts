import type { IBeneficiary } from "./beneficiary";
import type { IUser } from "./user";

export interface ILoginAuth {
  password: string;
  email: string;
}

export interface ILoginBeneficiary {
  national_id: string;
  release_date: string;
}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
  beneficiary: IBeneficiary;
  user: IUser;
}
