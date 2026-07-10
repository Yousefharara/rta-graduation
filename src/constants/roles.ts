export const ROLES: Record<string, RoleType> = {
  GUEST: "guest", // aka: donor
  BENEFICIARY: "beneficiary",
  ADMIN: "admin",
  ORG: "local_org", // org --> Organization
};

export type RoleType = "guest" | "beneficiary" | "admin" | "local_org";
