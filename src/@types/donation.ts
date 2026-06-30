export interface ICreateDonation {
  donor_id?: number | null;
  guest_name?: string | null;
  guest_email?: string | null;
  amount: number;
  currency?: string | "USD";
  tracking_code?: string | null;
}

export interface IDonation {
  id: number;
  donor_id?: number | null;
  guest_name?: string | null;
  guest_email?: string | null;
  amount: number;
  currency?: string | "USD";
  tracking_code?: string | null;
  status?: TDonationStatus;
  donated_at: string;
}

export type TDonationStatus = "pending" | "completed" | "failed";
