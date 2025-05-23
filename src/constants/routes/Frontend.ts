import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum FrontendRouteTargets {
  HOME = "/",
  TEST_CLIENT = "/test/client",
  AUTH_SIGN_UP = "/auth/signup",
  AUTH_SIGN_UP_COMPANY = "/auth/signup/company",
  AUTH_SIGN_IN = "/auth/signin",

  PROFILE = "/profile",

  CHAT_SESSION = "/chat/{sessionId}",

  COMPANY_LIST = "/company",
  COMPANY_PROFILE = "/company/{companyId}",
  COMPANY_CREATE = "/company/create",

  SESSION_LIST = "/session",
  SESSION_CREATE = "/session/create",
  SESSION_CREATE_ID = "/session/create/{id}",

  ADMIN_SESSION = "/admin/sessions",
  ADMIN_COMPANY = "/admin/companies",
  ADMIN_JOB_LISTINGS = "/admin/job-listings",

  JOB_LISTINGS_CREATE = "/job-listing/create",
  JOB_LISTINGS_ID = "/job-listing/{jobId}",
  JOB_LISTINGS_ID_EDIT = "/job-listing/{jobId}/edit",
}

export const FrontendRoutes = getDynamicRoute(FrontendRouteTargets);
