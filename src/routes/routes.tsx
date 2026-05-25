import { Navigate, RouteObject } from "react-router-dom";
import { PATHS } from "./paths";
import { lazy } from "react";
import GuestGuard from "../guards/guestGuard";
import UserGuard from "../guards/userGuard";

const AboutPage = lazy(() => import("../components/pages/aboutPage"));
const HomePage = lazy(() => import("../components/pages/homePage"));
const LoginPage = lazy(() => import("../components/pages/loginPage"));
const ContactusPage = lazy(() => import("../components/pages/contactusPage"));

const userRoutes: RouteObject[] = [
  {
    path: PATHS.ABOUT,
    element: <UserGuard />,
    children: [
      {
        index: true,
        element: <AboutPage />,
      },
    ],
  },
];

const guestRoutes: RouteObject[] = [
  {
    path: PATHS.AUTH.LOGIN,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
];

const errorRoutes: RouteObject[] = [
  {
    path: PATHS.ERROR.PAGE_NOT_FOUNT,
    element: <h2>Page not found 404</h2>,
  },
  {
    path: "*",
    element: <Navigate to={"/404"} replace={true} />,
  },
];

export const routes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: PATHS.CONTACT_US,
    element: <ContactusPage />,
  },
  ...guestRoutes,
  ...userRoutes,
  ...errorRoutes,
];
