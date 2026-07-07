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
const TrackAidUser = lazy(
  () => import("@/components/pages/trackAidPage/trackAidUser"),
);
const DashboardHomePage = lazy(
  () => import("@/components/pages/dashboard/dashboardHome"),
);
const DashboardAidOrders = lazy(
  () => import("@/components/pages/dashboard/dashbaordAidOrders"),
);
const DashboardBeneficiariesManagement = lazy(
  () => import("@/components/pages/dashboard/dashboardBeneficiariesManagement"),
);
const DashboardOrgRegister = lazy(
  () => import("@/components/pages/dashboard/dashboardOrgRegister"),
);
const DashboardBeneficiaryRegister = lazy(
  () => import("@/components/pages/dashboard/dashboardBeneficiaryRegister"),
);
const DashboardComplaints = lazy(
  () => import("@/components/pages/dashboard/dashboardComplaints"),
);
const DashboardAids = lazy(
  () => import("@/components/pages/dashboard/dashboardAids"),
);
const NotificationsPage = lazy(
  () => import("@/components/pages/dashboard/notificationsPage"),
);
const DashboardCampaigns = lazy(
  () => import("@/components/pages/dashboard/dashboardCampaigns"),
);

const NotFoundPage = lazy(
  () => import("@/components/pages/notFoundPage"),
);

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

// ! -----------------------------------------------------------------
// ? ------------------- Admin Routes --------------------------------
// ! -----------------------------------------------------------------

const adminRoutes: RouteObject[] = [
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Navigate to={PATHS.DASHBOARD.ROOT} />,
  },
  {
    path: PATHS.DASHBOARD.AID_ORDERS,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardAidOrders />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.BENEFICIARIES_MANAGEMENT,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardBeneficiariesManagement />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.BENEFICIARY_REGISTER,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardBeneficiaryRegister />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.ORG_REGISTER,
    element: <AdminGuard allowedRoles={["admin"]} />,
    children: [
      {
        index: true,
        element: <DashboardOrgRegister />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.COMPLAINTS,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardComplaints />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.AIDS,
    element: <AdminGuard allowedRoles={["admin"]} />,
    children: [
      {
        index: true,
        element: <DashboardAids />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.NOTIFICATIONS,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: PATHS.DASHBOARD.CAMPAIGNS,
    element: <AdminGuard allowedRoles={["admin", "local_org"]} />,
    children: [
      {
        index: true,
        element: <DashboardCampaigns />,
      },
    ],
  },
];

// ! -----------------------------------------------------------------
// ? -------------------- Guest Routes -------------------------------
// ! -----------------------------------------------------------------

const guestRoutes: RouteObject[] = [
  {
    path: PATHS.AUTH.LOGIN,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: PATHS.DONATION,
    element: (
      <GuestGuard>
        <DonationPage />
      </GuestGuard>
    ),
  },
];

// ! -----------------------------------------------------------------
// ? -------------------- Error Routes ---------------------------------
// ! -----------------------------------------------------------------

const errorRoutes: RouteObject[] = [
  {
    path: PATHS.ERROR.PAGE_NOT_FOUNT,
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <Navigate to={"/404"} replace={true} />,
  },
];

// ! -----------------------------------------------------------------
// ? -------------------- Routes Routes ---------------------------------
// ! -----------------------------------------------------------------

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
    path: PATHS.ABOUT,
    element: <AboutPage />,
  },
  ...adminRoutes,
  ...guestRoutes,
  ...userRoutes,
  ...errorRoutes,
];
