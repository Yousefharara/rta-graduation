import { PATHS } from "@/routes/paths";


export const routeImports: Record<string, () => Promise<unknown>> = {
  [PATHS.HOME]: () => import("@/components/pages/homePage"),
  [PATHS.SERVICES.ROOT]: () => import("@/components/pages/servicesPage"),
  [PATHS.SERVICES.DETAILS]: () =>
    import("@/components/pages/servicesPage/servicesDetailsPage"),
  [PATHS.ABOUT]: () => import("@/components/pages/aboutPage"),
};
