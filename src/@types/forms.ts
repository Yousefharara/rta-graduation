import type { AidCategoryType } from "./aid";

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
  IDNumber: string;
  versionNumber: Date;
}

export interface IDonationForm {
  donationCampaign: "learning" | "relife";
  customBudget?: number | null;
  budget: number;
  nameOfCard: string;
  cardNumber: string;
  endDate: Date;
  CVV: number;
}


export interface ISendOrderForm {
  typeAid: AidCategoryType;
  reason: string;
}

type beneficiaryStatusType = 'pending' | 'agreenment' | "rejected";

export interface IRegisterBeneficiaryForm {
  name: string;
  nationalId: string;
  mobileNumber: string;
  email?:string | null;
  familySize: number;
  patientCount: number;
  disableCount: number;
  status: beneficiaryStatusType;
  income: number;
}