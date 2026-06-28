export const BeneficiaryAidStatus = {
  rejected: "rejected",
  approved: "approved",
  preparing: "preparing",
  shipping: "shipping",
  delivered: "delivered",
} as const;


export type BeneficiaryAidStatus =
  (typeof BeneficiaryAidStatus)[keyof typeof BeneficiaryAidStatus];


export interface IBeneficiaryAid {
  id: number;
  beneficiary_id: number;
  aid_type_id: number;
  pickup_location_id: number | null;
  org_id: number;
  order_id: number | null;
  status: BeneficiaryAidStatus;
}

