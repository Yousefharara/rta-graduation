


type verfiyStatus = "approved" | "rejected";

export interface IBeneficiaryVerification {
    beneficiary_id: number,
    verified_by: number,
    result: verfiyStatus,
    notes: string
}