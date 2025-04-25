import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { BackendRoutes } from "./constants/routes/Backend";
import {
  FrontendRoutes,
  FrontendRouteTargets,
} from "./constants/routes/Frontend";
import { withBaseRoute } from "./utils/routes/withBaseRoute";

const unAuthRoutes = [
  FrontendRouteTargets.AUTH_SIGN_IN,
  FrontendRouteTargets.AUTH_SIGN_UP,
  FrontendRouteTargets.AUTH_SIGN_UP_COMPANY,
];

const publicRoutes = [
  FrontendRouteTargets.HOME,
  FrontendRouteTargets.COMPANY_LIST,
  FrontendRouteTargets.COMPANY_PROFILE,
  FrontendRouteTargets.JOB_LISTINGS_ID,
  ...unAuthRoutes,
];

const adminRoutes = [
  FrontendRouteTargets.ADMIN_SESSION,
  FrontendRouteTargets.ADMIN_COMPANY,
];

const userRoutes = [
  FrontendRouteTargets.SESSION_LIST,
  FrontendRouteTargets.CHAT_SESSION,
  FrontendRouteTargets.SESSION_CREATE,
  FrontendRouteTargets.SESSION_CREATE_ID,
];

const companyRoutes = [
  FrontendRouteTargets.CHAT_SESSION,
  FrontendRouteTargets.COMPANY_CREATE,
  FrontendRouteTargets.SESSION_LIST,

];

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const ROLE_CACHE_COOKIE = "role_cache";

/**
 * Checks if a current path matches any of the routes in the provided array
 * Handles both static routes and dynamic routes with parameters
 */
const isPathMatchingRoutes = (
  currentPath: string,
  routes: Array<FrontendRouteTargets>,
): boolean => {
  return routes.some((route) => {
    const routePath = route.toString();

    // Handle dynamic routes with parameters (e.g., /company/{companyId})
    if (routePath.includes("{")) {
      // Convert route pattern to regex pattern
      const regexPattern = routePath
        .replace(/{[^}]+}/g, "[^/]+") // Replace {param} with regex pattern
        .replace(/\//g, "\\/"); // Escape forward slashes

      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(currentPath);
    }

    // Handle static routes
    return currentPath === routePath || currentPath.startsWith(routePath + "/");
  });
};

const validateRoleAccess = (
  userRole: string,
  isUserRoute: boolean,
  isCompanyRoute: boolean,
  isAdminRoute: boolean,
): boolean => {
  if (isUserRoute && userRole === "user") return true;
  if (isCompanyRoute && userRole === "company") return true;
  if (isAdminRoute && userRole === "admin") return true;

  if (isUserRoute || isCompanyRoute || isAdminRoute) return false;

  return true;
};

const handleRoleBasedRedirect = (
  userRole: string,
  isUserRoute: boolean,
  isCompanyRoute: boolean,
  isAdminRoute: boolean,
  req: NextRequest,
): NextResponse | null => {
  if (
    !validateRoleAccess(userRole, isUserRoute, isCompanyRoute, isAdminRoute)
  ) {
    return NextResponse.redirect(new URL(FrontendRoutes.HOME, req.url));
  }
  return null;
};

const fetchUserRole = async (token: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const user = await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!user.ok) {
      throw new Error(`HTTP error! status: ${user.status}`);
    }

    const userData = (await user.json()) as GETMeResponse;
    return userData.data.role;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const getRoleFromCookie = (
  req: NextRequest,
): { role: string; timestamp: number } | null => {
  const cookie = req.cookies.get(ROLE_CACHE_COOKIE);
  if (!cookie) return null;

  try {
    const data = JSON.parse(cookie.value);
    return data;
  } catch {
    return null;
  }
};

const setRoleCookie = (res: NextResponse, role: string, timestamp: number) => {
  res.cookies.set(ROLE_CACHE_COOKIE, JSON.stringify({ role, timestamp }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CACHE_DURATION / 1000, // Convert to seconds
    path: "/",
  });
};

const clearRoleCookie = (res: NextResponse) => {
  res.cookies.delete(ROLE_CACHE_COOKIE);
};

export default auth(async (req) => {
  const currentPath = req.nextUrl.pathname;

  // Check if the current path is in public routes
  const isPublicRoute = isPathMatchingRoutes(currentPath, publicRoutes);

  if (!isPublicRoute && !req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.AUTH_SIGN_IN, req.url));
  }

  // Check if the current path is in unAuth routes
  const isUnAuthRoute = isPathMatchingRoutes(currentPath, unAuthRoutes);

  if (isUnAuthRoute && req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.HOME, req.url));
  }

  const isAdminRoute = isPathMatchingRoutes(currentPath, adminRoutes);
  const isUserRoute = isPathMatchingRoutes(currentPath, userRoutes);
  const isCompanyRoute = isPathMatchingRoutes(currentPath, companyRoutes);

  if ((isAdminRoute || isUserRoute || isCompanyRoute) && req.auth?.token) {
    try {
      const cachedRole = getRoleFromCookie(req);
      const now = Date.now();

      let userRole: string;
      const response = NextResponse.next();

      if (cachedRole && now - cachedRole.timestamp < CACHE_DURATION) {
        userRole = cachedRole.role;
      } else {
        userRole = await fetchUserRole(req.auth.token);
        setRoleCookie(response, userRole, now);
      }

      const redirect = handleRoleBasedRedirect(
        userRole,
        isUserRoute,
        isCompanyRoute,
        isAdminRoute,
        req,
      );

      if (redirect) {
        clearRoleCookie(redirect);
        return redirect;
      }

      return response;
    } catch (error) {
      console.error("Error fetching user role:", error);
      const redirect = NextResponse.redirect(
        new URL(FrontendRoutes.HOME, req.url),
      );
      clearRoleCookie(redirect);
      return redirect;
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
