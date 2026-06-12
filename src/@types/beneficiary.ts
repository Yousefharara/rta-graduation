export interface IBeneficiaryState {
  isLoading: boolean;
  errorMessage: string;
  users: IBeneficairy[];
  user: IBeneficairy | null;
}

export interface IBeneficairy {
  name: string;
  email: string;
  password: string;
  phone: string;
  national_id: string;
  area_id: number;
  family_size: number;
  income: number;
  patients_count: number;
  disabled_count: number;
  is_displaced: boolean;
}
