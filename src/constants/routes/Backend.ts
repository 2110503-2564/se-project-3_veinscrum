import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum BackendRouteTargets {
  HOME = "/",
  AUTH_REGISTER = "/auth/register",
  AUTH_LOGIN = "/auth/login",
  AUTH_ME = "/auth/me",
  AUTH_LOGOUT = "/auth/logout",
  COMPANIES = "/companies",
  COMPANIES_CREATE = "/companies/create",
  COMPANIES_ID = "/companies/{companyId}",
  COMPANIES_ID_SESSIONS = "/companies/{companyId}/sessions",
  SESSIONS = "/sessions",
  SESSIONS_ID = "/sessions/{id}",
  USERS = "/users",
  USERS_ID_SESSIONS = "/users/{id}/sessions",
  ADMIN_SESSION = "/admin/sessions",
  ADMIN_COMPANY = "/admin/companies",
  JOB_LISTINGS = "/job-listings",
  JOB_LISTINGS_ID = "/job-listings/{id}",
  JOB_LISTINGS_ID_FLAGS = "/job-listings/{id}/flags",
  FLAGS = "/flags",
  FLAGS_ID = "/flags/{id}",
}

export const BackendRoutes = getDynamicRoute(BackendRouteTargets);
