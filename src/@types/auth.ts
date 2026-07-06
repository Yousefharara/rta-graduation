import type { IBeneficiary } from "./beneficiary";
import type { ILocalOrg } from "./localOrg";
import type { IUser } from "./user";

export interface ILoginAuth {
  password: string;
  email: string;
}

export interface ILoginBeneficiary {
  national_id: string;
  release_date: string;
  password: string;
}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
  beneficiary: IBeneficiary;
  organization: ILocalOrg;
  user: IUser;
}
