import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum FrontendRouteTargets {
  HOME = "/",
  TEST_CLIENT = "/test/client",
  AUTH_SIGN_UP = "/auth/signup",
  AUTH_SIGN_UP_COMPANY = "/auth/signup/company",
  AUTH_SIGN_IN = "/auth/signin",

  PROFILE = "/profile",

  COMPANY_LIST = "/company",
  COMPANY_PROFILE = "/company/{id}",
  COMPANY_CREATE = "/company/create",

  SESSION_LIST = "/session",
  SESSION_CREATE = "/session/create",
  SESSION_CREATE_ID = "/session/create/{id}",

  ADMIN_SESSION = "/admin/sessions",
  ADMIN_COMPANY = "/admin/companies",

  JOB_LISTINGS_CREATE_ID = "/job-listing/create/{id}",
}

export const FrontendRoutes = getDynamicRoute(FrontendRouteTargets);
