export interface ICampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  collected_amount: number;
  start_date?: Date | null;
  end_date?: Date | null;
  status: TCampaignStatus;
  created_at: Date;
}

export interface ICreateCampaign {
  title: string;
  description: string;
  target_amount?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
}

export interface IEditCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
}

type TCampaignStatus = "active" | "closed";
