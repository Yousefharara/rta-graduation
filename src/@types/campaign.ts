export interface ICampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null; 
  collected_amount: number;
  start_date: string;
  end_date: string;
  status: TCampaignStatus;
  created_at: Date;
}

export interface ICreateCampaign {
  title: string;
  description: string;
  target_amount?: number | null;
  start_date: string;
  end_date: string;
}


export interface IEditCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  start_date: string;
  end_date: string;
}

type TCampaignStatus = "active" | "closed";