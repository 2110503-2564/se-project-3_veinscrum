import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum FrontendRouteTargets {
  HOME = "/",
  TEST_CLIENT = "/test/client",
  AUTH_SIGN_UP = "/auth/signup",
  AUTH_SIGN_IN = "/auth/signin",

  PROFILE = "/profile",

  COMPANY_LIST = "/company",
  COMPANY_PROFILE = "/company/:id",

  SESSION_LIST = "/session",
  SESSION_CREATE = "/session/create",
}

export const FrontendRoutes = getDynamicRoute(FrontendRouteTargets);
