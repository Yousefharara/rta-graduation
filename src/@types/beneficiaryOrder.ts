
type TBeneficiaryOrderStatus = "pending" | "approved" | "rejected" ;

export interface ICreateBeneficiaryOrder {
    beneficiary_id: number, 
    aid_type_id: number,
    description: string,
}


export interface IBeneficiaryOrder {
    id: number,
    beneficiary_id: number,
    aid_type_id: number,
    description: string,
    status: TBeneficiaryOrderStatus,

}
  
