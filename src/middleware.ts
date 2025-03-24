import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { BackendRoutes } from "./constants/routes/Backend";
import { FrontendRoutes } from "./constants/routes/Frontend";
import { withBaseRoute } from "./utils/routes/withBaseRoute";

const unAuthRoutes = [FrontendRoutes.AUTH_SIGN_IN, FrontendRoutes.AUTH_SIGN_UP];

const publicRoutes = [FrontendRoutes.HOME, ...unAuthRoutes];

const adminRoutes = [
  FrontendRoutes.ADMIN_SESSION,
  FrontendRoutes.ADMIN_COMPANY,
  FrontendRoutes.COMPANY_CREATE,
];

const userRoutes = [FrontendRoutes.SESSION_LIST, FrontendRoutes.COMPANY_LIST];

export default auth(async (req) => {
  const currentPath = req.nextUrl.pathname;

  if (!publicRoutes.includes(currentPath) && !req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.AUTH_SIGN_IN, req.url));
  }

  if (unAuthRoutes.includes(currentPath) && req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.HOME, req.url));
  }

  if (
    (adminRoutes.includes(currentPath) || userRoutes.includes(currentPath)) &&
    req.auth?.token
  ) {
    const user = await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
      headers: {
        Authorization: `Bearer ${req.auth.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json() as Promise<GETMeResponse>)
      .catch(() => null);

    if (
      (adminRoutes.includes(currentPath) && user?.data.role !== "admin") ||
      (userRoutes.includes(currentPath) && user?.data.role !== "user")
    ) {
      return NextResponse.redirect(new URL(FrontendRoutes.HOME, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
