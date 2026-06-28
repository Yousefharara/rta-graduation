export enum EBeneficiaryAidStatus {
  rejected = "rejected",
  approved = "approved",
  preparing = "preparing",
  shipping = "shipping",
  delivered = "delivered",
}

export interface IBeneficiaryAid {
  id: number;
  beneficiary_id: number;
  aid_type_id: number;
  pickup_location_id: number | null;
  org_id: number;
  order_id: number | null;
  status: EBeneficiaryAidStatus;
}

