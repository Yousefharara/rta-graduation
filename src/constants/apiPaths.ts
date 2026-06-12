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


export const COMPAIGNS_PATHS = {
    CREATE_COMPAIGNS: '/api/campaigns',
    GET_COMPAIGNS: '/api/campaigns',
    GET_COMPAIGN: '/api/campaigns/:id',
    EDIT_COMPAIGN: '/api/campaigns/:id',
    DELETE_COMPAIGN: '/api/campaigns/:id',
}

export const AID_CATEGORIES_PATHS = {
    CREATE_CATEGORY: "/api/aid-categories",
    GET_CATEGORIES: "/api/aid-categories",
    EDIT_CATEGORY: "/api/aid-categories/:id",
    DELETE_CATEGORY: "/api/aid-categories/:id",
}