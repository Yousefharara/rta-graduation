export interface ICampaign {
  id: 3;
  title: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  start_date: Date;
  end_date: Date;
  status: string;
  created_at: Date;
}

export interface ICreateCampaign {
  title: string;
  description: string;
  target_amount: string;
  start_date: Date;
  end_date: Date;
}
