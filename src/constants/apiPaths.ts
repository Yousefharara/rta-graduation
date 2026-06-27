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


export const CAMPAIGN_PATHS = {
    CREATE_CAMPAIGN: '/api/campaigns',
    GET_CAMPAIGNS: '/api/campaigns',
    GET_CAMPAIGN: '/api/campaigns/:id',
    EDIT_CAMPAIGN: '/api/campaigns/:id',
    DELETE_CAMPAIGN: '/api/campaigns/:id',
}

export const AID_CATEGORY_PATHS = {
    CREATE_CATEGORY: "/api/aid-categories",
    GET_CATEGORIES: "/api/aid-categories",
    EDIT_CATEGORY: "/api/aid-categories/:id",
    DELETE_CATEGORY: "/api/aid-categories/:id",
}

export const AID_TYPES_PATHS = {
    GET_AID_TYPES: "/api/aid-types",
}

export const BENEFICIARY_PATHS = {
    CREATE_BENEFICIARY: "/api/beneficiaries",
    GET_BENEFICIARIES: "/api/beneficiaries",
    // api/beneficiaries
    GET_BENEFICIARY: "/api/beneficiaries/:id",
    EDIT_BENEFICIARY: "/api/beneficiaries/:id",
    DELETE_BENEFICIARY: "/api/beneficiaries/:id",
    GET_BENEFICIARY_HISTORY: "/api/beneficiaries/:id/history",
}

export const VERIFY_BENEFICIARY_PATHS = {
    VERIFY_BENEFICIARY: "/api/beneficiary-verifications",
}

export const BENEFICIARY_ORDER_PATHS = {
    CREATE_BENEFICIARY_ORDER: "/api/beneficiary-orders",
    GET_BENEFICIARY_ORDERS: "/api/beneficiary-orders",
    GET_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
    EDIT_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
    DELETE_BENEFICIARY_ORDER: "/api/beneficiary-orders/:id",
}


export const ORG_PATHS = {
    CREATE_ORG: "/api/organizations",
    GET_ORGS: "/api/organizations",
    GET_ORG: "/api/organizations/:id",
    EDIT_ORG: "/api/organizations/:id",
    DELETE_ORG: "/api/organizations/:id",
    VERFIY_ORG: "/api/organizations/:id/verify",
}

export const DONATION_PATHS = {
    CREATE_DONATION: "/api/donations",
    GET_DONATIONS: "/api/donations"
}

