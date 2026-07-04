export interface ICampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null; 
  collected_amount: number;
  start_date: Date;
  end_date: Date;
  status: TCampaignStatus;
  created_at: Date;
}

export interface ICreateCampaign {
  title: string;
  description: string;
  target_amount?: number | null;
  start_date: Date;
  end_date: Date;
}


export interface IEditCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number | null;
  start_date: Date;
  end_date: Date;
}

type TCampaignStatus = "active" | "closed";