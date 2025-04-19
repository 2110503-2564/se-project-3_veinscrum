import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { BackendRoutes } from "./constants/routes/Backend";
import { FrontendRoutes } from "./constants/routes/Frontend";
import { withBaseRoute } from "./utils/routes/withBaseRoute";

const unAuthRoutes = [
  FrontendRoutes.AUTH_SIGN_IN,
  FrontendRoutes.AUTH_SIGN_UP,
  FrontendRoutes.AUTH_SIGN_UP_COMPANY,
];

const publicRoutes = [
  FrontendRoutes.HOME,
  FrontendRoutes.COMPANY_LIST,
  ...unAuthRoutes,
];

const adminRoutes = [
  FrontendRoutes.ADMIN_SESSION,
  FrontendRoutes.ADMIN_COMPANY,
];

const userRoutes = [
  FrontendRoutes.COMPANY_CREATE,
  FrontendRoutes.SESSION_LIST,
  FrontendRoutes.SESSION_CREATE,
  FrontendRoutes.SESSION_CREATE_ID,
];

const companyRoutes = [
  FrontendRoutes.COMPANY_CREATE,
  FrontendRoutes.SESSION_LIST,
];

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const ROLE_CACHE_COOKIE = "role_cache";

const isPathMatchingRoutes = (
  currentPath: string,
  routes: Array<string | ((params: { id: string }) => string)>,
): boolean => {
  return routes.some((route) => {
    if (typeof route === "string") {
      return currentPath === route || currentPath.startsWith(route + "/");
    }
    return false;
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

  if (!publicRoutes.includes(currentPath) && !req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.AUTH_SIGN_IN, req.url));
  }

  if (unAuthRoutes.includes(currentPath) && req.auth) {
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
