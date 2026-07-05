import { useAppSelector } from "@/redux/store";

export const useBeneficiaryValidation = () => {
  const beneficiaries = useAppSelector(
    (state) => state.beneficiaries.beneficiaries,
  );

  const isNationalIdExists = (nationalId: string) => {
    return beneficiaries.some((b) => b.national_id === nationalId);
  };

  return { isNationalIdExists };
};
