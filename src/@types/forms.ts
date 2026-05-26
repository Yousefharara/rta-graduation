export interface ILoginForm {
  email: string;
  password: string;
  remeberMe: boolean;
}

export interface IContactForm {
  fullName: string;
  email: string;
  title: string;
  description: string;
}

export interface ITrackAidForm {
  IDNumber: number;
  versionNumber: Date;
}

export interface IDonationForm {
  donationType: "A" | "B";
  customBudget?: number | null;
  budget: number;
  nameOfCard: string;
  cardNumber: string;
  endDate: Date;
  CVV: number;
}
