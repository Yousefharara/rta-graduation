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
  password: string;
}

export interface IDonationForm {
  donationCampaign: string;
  customBudget?: number | null;
  budget: number;
  nameOfCard: string;
  cardNumber: string;
  endDate: Date;
  CVV: number;
  email?: string | null;
}

export interface ISendOrderForm {
  typeAid: string;
  reason: string;
}

export interface IBeneficiaryForm extends Omit<
  ICreateBeneficiary,
  "email" | "password" | "disabled_count"
> {
  password?: string;
  disabled_count?: number;
}

export interface IRegisterLocalOrgForm extends Omit<
  ICreateLocalOrg,
  "password"
> {
  password?: string;
}
