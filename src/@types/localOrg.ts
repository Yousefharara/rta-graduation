export interface ILocalOrgState {
  isLoading: boolean;
  errorMessage: string;
  users: ILocalOrg[];
  user: ILocalOrg | null;
}

export interface ILocalOrg {
  id: number;
  user_id: number;
  org_name: string;
  area_id: number;
  is_verified: boolean;
}


