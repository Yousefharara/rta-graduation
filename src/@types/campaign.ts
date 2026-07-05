export interface ICampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  collected_amount: number;
  start_date?: string | null;
  end_date?: string | null;
  status: TCampaignStatus;
  created_at: Date;
}

export interface ICreateCampaign {
  title: string;
  description: string;
  target_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface IEditCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

type TCampaignStatus = "active" | "closed";
