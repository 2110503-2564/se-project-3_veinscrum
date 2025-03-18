import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum FrontendRouteTargets {
  HOME = "/",
  TEST_CLIENT = "/test/client",
}

export const FrontendRoutes = getDynamicRoute(FrontendRouteTargets);
