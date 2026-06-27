


type verfiyStatus = "approved" | "rejected";

export interface IBeneficiaryVerification {
    beneficiary_id: number,
    org_id: number,
    result: verfiyStatus,
    notes: string
}