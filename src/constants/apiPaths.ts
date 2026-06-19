export const AUTH_PATHS = {
  LOGIN: "/api/auth/login",
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


export const COMPAIGN_PATHS = {
    CREATE_COMPAIGN: '/api/campaigns',
    GET_COMPAIGNS: '/api/campaigns',
    GET_COMPAIGN: '/api/campaigns/:id',
    EDIT_COMPAIGN: '/api/campaigns/:id',
    DELETE_COMPAIGN: '/api/campaigns/:id',
}

export const AID_CATEGORY_PATHS = {
    CREATE_CATEGORY: "/api/aid-categories",
    GET_CATEGORIES: "/api/aid-categories",
    EDIT_CATEGORY: "/api/aid-categories/:id",
    DELETE_CATEGORY: "/api/aid-categories/:id",
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


// {
//   "name": "ياسر الكحلوت",
//   "email": "yasser.b@example.com",
//   "password": "password123",
//   "phone": "+970599222333",
//   "national_id": "401234567",
//   "area_id": 1,
//   "family_size": 5,
//   "income": 350.50,
//   "patients_count": 1,
//   "disabled_count": 0,
//   "is_displaced": true
// }