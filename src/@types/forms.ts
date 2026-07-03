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
  donationCampaign: string;
  customBudget?: number | null;
  budget: number;
  nameOfCard: string;
  cardNumber: string;
  endDate: Date;
  CVV: number;
}


export interface ISendOrderForm {
  typeAid: string;
  reason: string;
}

export interface IRegisterBeneficiaryForm
  extends Omit<ICreateBeneficiary, 'email' | 'password' | "disabled_count"> {
  email?: string | null;
  password?: string;
  disabled_count?: number;
}


export interface IRegisterLocalOrgForm extends Omit<ICreateLocalOrg, "password"> {
  password?: string;
}