export interface ICreateComplaint {
  beneficiary_id: number;
  subject: string;
  message: string;
}

export interface IComplaint {
  id: number;
  beneficiary_id: number;
  subject: string;
  message: string;
  status: TComplaintStatus;
  admin_response: string | null;
  resolved_by: string | null;
  created_at: Date;
}

type TComplaintStatus = "open" | "resolved";
