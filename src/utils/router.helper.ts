import { PATHS } from "../routes/paths";

export const isAuthPath = (pathname: string): boolean => {
  return Object.values(PATHS.AUTH).includes(pathname);
};

export const isAdminPath = (pathname: string): boolean => {
  return Object.values(PATHS.DASHBOARD).includes(pathname);
};
