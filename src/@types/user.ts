export interface IUserState {
  isLoading: boolean;
  errorMessage: string;
  users: IUser[];
  user: IUser | null;
}

export interface IUser {
  id: number;
  username: string;
  id_card: string;
  name: string;
  token: string;
}
