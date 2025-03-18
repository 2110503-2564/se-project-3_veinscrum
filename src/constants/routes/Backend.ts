import { getDynamicRoute } from "@/utils/routes/getDynamicRoute";

export enum BackendRouteTargets {
  AUTH_REGISTER = "/auth/register",
  AUTH_LOGIN = "/auth/login",
  AUTH_ME = "/auth/me",
  AUTH_LOGOUT = "/auth/logout",
  COMPANIES = "/companies",
  COMPANIES_ID = "/companies/{id}",
  COMPANIES_ID_SESSIONS = "/companies/{id}/sessions",
  SESSIONS = "/sessions",
  SESSIONS_ID = "/sessions/{id}",
}

export const BackendRoutes = getDynamicRoute(BackendRouteTargets);
