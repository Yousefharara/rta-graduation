import { Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import { lazy } from "react";
import GuestGuard from "../guards/guestGuard";
import UserGuard from "../guards/userGuard";

const AboutPage = lazy(() => import("../components/pages/aboutPage"));
const HomePage = lazy(() => import("../components/pages/homePage"));
const LoginPage = lazy(() => import("../components/pages/loginPage"));

export const routes = [
  {
    index: true,
    element: <HomePage />,
  },
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
  {
    path: PATHS.AUTH.LOGIN,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: PATHS.ERROR.PAGE_NOT_FOUNT,
    element: <h2>Page not found 404</h2>,
  },
  {
    path: "*",
    element: <Navigate to={"/404"} replace={true} />,
  },
];
