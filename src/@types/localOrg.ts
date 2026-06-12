export interface IUsersState {
  isLoading: boolean;
  errorMessage: string;
  users: IUsers[];
  user: IUsers | null;
}

export interface IUsers {
  id: number;
  user_id: number;
  org_name: string;
  area_id: number;
  is_verified: boolean;
}


