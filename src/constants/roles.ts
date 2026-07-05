export const ROLES: Record<string, RoleType> = {
  GUEST: "guest",
  USER: "beneficiary", // user --> beneficiary
  ADMIN: "admin",
  ORG: "local_org", // org --> Organization
  DONOR: "donor",
};

export type RoleType =
  "guest" | "beneficiary" | "admin" | "local_org" | "donor";
