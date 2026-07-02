export interface INotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

export interface ICreateNotification {
  user_id: number;
  title: string;
  message: string;
}

