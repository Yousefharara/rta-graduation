export type AidCategoryType = "Food Assistance" | "Medical Support" | "Cash";

export const aidCategoryArr: AidCategoryType[] = ['Cash', 'Food Assistance', 'Medical Support']

export interface IAidState {
  isLoading: boolean;
  errorMessage: string;
  aids: IAid[];
  aid: IAid | null; 
}

export interface IAid {
  id: number;
  code_number: string;
  category: AidCategoryType;
}
