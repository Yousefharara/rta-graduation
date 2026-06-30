export interface IAid {
  id: number;
  aid_type_id: number;
  org_id: number;
  quantity: number;
  remaining_quantity: number;
  expiry_date: Date;
  status: string;
  batch_code: string;
}
export interface ICreateAid {
  aid_type_id: number;
  org_id: number | null;
  quantity: number;
}
