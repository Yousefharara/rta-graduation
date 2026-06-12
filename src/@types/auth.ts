import type { IUser } from "./user";

export interface ILoginAuth {
  password: string;
  email: string;
}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
