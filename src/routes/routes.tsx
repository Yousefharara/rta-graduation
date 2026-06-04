import { Navigate, type RouteObject } from "react-router-dom";
import { lazy } from "react";
import GuestGuard from "../guards/guestGuard";
import UserGuard from "../guards/userGuard";
import { PATHS } from "./paths";
import AdminGuard from "@/guards/adminGuard";

const AboutPage = lazy(() => import("../components/pages/aboutPage"));
const HomePage = lazy(() => import("@/components/pages/homePage"));
const LoginPage = lazy(() => import("@/components/pages/loginPage"));
const ContactusPage = lazy(() => import("../components/pages/contactusPage"));
const TrackAidPage = lazy(() => import("../components/pages/trackAidPage"));
const DonationPage = lazy(() => import("../components/pages/donationPage"));
const TrackAidUser = lazy(() => import("@/components/pages/trackAidPage/trackAidUser"));
const DashboardPage = lazy(() => import("@/components/pages/dashboard/admin/dashboardHome"));

const userRoutes: RouteObject[] = [
  {
    path: PATHS.TRACK_AID.USER,
    element: <UserGuard />,
    children: [
      {
        index: true,
        element: <TrackAidUser />,
      },
    ],
  },
];

const adminRoutes: RouteObject[] = [
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <AdminGuard />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
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
  {
    path: PATHS.ABOUT,
    element: <AboutPage />,
  },
  {
    path: PATHS.TRACK_AID.ROOT,
    element: <TrackAidPage />,
  },
  {
    path: PATHS.DONATION,
    element: <DonationPage />,
  },
  ...adminRoutes,
  ...guestRoutes,
  ...userRoutes,
  ...errorRoutes,
];
