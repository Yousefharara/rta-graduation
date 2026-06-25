import type { RootState } from "@/redux/store";

export const selectBeneficiaryByNationalId =
  (nationalId: string) => (state: RootState) =>
    state.beneficiaries.beneficiaries.find((b) => b.national_id === nationalId);
