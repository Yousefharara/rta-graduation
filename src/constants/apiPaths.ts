export const AUTH_PATHS = {
  LOGIN: "/api/auth/login",
  LOGIN_BENEFICIARY: "/api/auth/login-beneficiary",
  LOGOUT: "/api/auth/logout",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  CHANGE_PASS: "/api/auth/change-password",
};

export const USER_PAHTS = {
  CREATE_USER: "/api/users",
  GET_USERS: "/api/users",
  GET_USER: "/api/users/:id",
  EDIT_USER: "/api/users/:id",
  DELETE_USER: "/api/users/:id",
};

export const AID_PATHS = {
  CREATE_AID: "/api/aids",
  GET_AIDS: "/api/aids",
  DECREMENT_PATCH_AIDS: "/api/aids/:id/deduct",
}

export const CAMPAIGN_PATHS = {
  CREATE_CAMPAIGN: "/api/campaigns",
  GET_CAMPAIGNS: "/api/campaigns",
  GET_CAMPAIGN: "/api/campaigns/:id",
  EDIT_CAMPAIGN: "/api/campaigns/:id",
  DELETE_CAMPAIGN: "/api/campaigns/:id",
};

export const COMPLAINT_PATHS = {
  CREATE_COMPLAINT: "/api/complaints",
  GET_COMPLAINTS: "/api/complaints",
  GET_COMPLAINT: "/api/complaints/:id",
  RESOLVE_COMPLAINT: "/api/complaints/:id/resolve",
  EDIT_COMPLAINT: "/api/complaints/:id",
  DELETE_COMPLAINT: "/api/complaints/:id",
};

export const AID_CATEGORY_PATHS = {
  CREATE_CATEGORY: "/api/aid-categories",
  GET_CATEGORIES: "/api/aid-categories",
  EDIT_CATEGORY: "/api/aid-categories/:id",
  DELETE_CATEGORY: "/api/aid-categories/:id",
};

export const AID_TYPES_PATHS = {
  CREATE_AID_TYPE: "/api/aid-types",
  GET_AID_TYPES: "/api/aid-types",
  GET_AID_TYPE: "/api/aid-types/:id",
  EDIT_AID_TYPE: "/api/aid-types/:id",
  DELETE_AID_TYPE: "/api/aid-types/:id",
};

export const BENEFICIARY_PATHS = {
  CREATE_BENEFICIARY: "/api/beneficiaries",
  GET_BENEFICIARIES: "/api/beneficiaries",
  // api/beneficiaries
  GET_BENEFICIARY: "/api/beneficiaries/:id",
  EDIT_BENEFICIARY: "/api/beneficiaries/:id",
  DELETE_BENEFICIARY: "/api/beneficiaries/:id",
  GET_BENEFICIARY_HISTORY: "/api/beneficiaries/:id/history",
};

export const VERIFY_BENEFICIARY_PATHS = {
  VERIFY_BENEFICIARY: "/api/beneficiary-verifications",
};

export const BENEFICIARY_ORDER_PATHS = {
  CREATE_BENEFICIARY_ORDER: "/api/beneficiary-orders",
  GET_BENEFICIARY_ORDERS: "/api/beneficiary-orders",
  GET_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
  EDIT_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
  DELETE_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
};

export const BENEFICIARY_AID_PATHS = {
  CREATE_BENEFICIARY_AID: "/api/beneficiary-aids",
  GET_BENEFICIARY_AIDS: "/api/beneficiary-aids",
  GET_BENEFICIARY_AID: "/api/beneficiary-aids/:id",
  EDIT_BENEFICIARY_AID: "/api/beneficiary-aids/:id",
  DELETE_BENEFICIARY_AID: "/api/beneficiary-aids/:id",
};

export const GOVERNORATE_PATHS = {
  GET_GOVERNORATE: "/api/governorates/:id",
  GET_GOVERNORATES: "/api/governorates",
};

export const AREA_PATHS = {
  GET_AREA: "/api/areas/:id",
  GET_AREAS: "/api/areas",
};

export const DONATION_PATHS = {
  CREATE_DONATINO: "/api/donations",
  GET_DONATINOS: "/api/donations",
  GET_DONATION: "/api/donations/:id",
};

export const ORG_PATHS = {
  CREATE_ORG: "/api/organizations",
  GET_ORGS: "/api/organizations",
  GET_ORG: "/api/organizations/:id",
  EDIT_ORG: "/api/organizations/:id",
  DELETE_ORG: "/api/organizations/:id",
  VERFIY_ORG: "/api/organizations/:id/verify",
};

export const PICKUP_LOCATION_PATHS = {
  GET_PICKUP_LOCATIONS: "/api/pickup-locations",
  GET_PICKUP_LOCATION: "/api/pickup-locations/:id",
  EDIT_PICKUP_LOCATION: "/api/pickup-locations/:id",
  DELETE_PICKUP_LOCATION: "/api/pickup-locations/:id",
};
