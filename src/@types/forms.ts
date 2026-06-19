import type { AidCategoryType } from "./aid";
import type { ICreateBeneficiary } from "./beneficiary";
import type { ICreateLocalOrg } from "./localOrg";

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

export interface IRegisterBeneficiaryForm
  extends Omit<ICreateBeneficiary, 'email' | 'password' | "disabled_count"> {
  email?: string | null;
  password?: string;
  disabled_count?: number;
  status: 'single' | 'married';
}


export interface IRegisterLocalOrgForm extends Omit<ICreateLocalOrg, "password"> {
  orgType: string;
  password?: string;
}