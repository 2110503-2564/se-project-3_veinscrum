import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { FrontendRoutes } from "./constants/routes/Frontend";

const unAuthRoutes = [FrontendRoutes.AUTH_SIGN_IN, FrontendRoutes.AUTH_SIGN_UP];

const publicRoutes = [FrontendRoutes.HOME, ...unAuthRoutes];

export default auth((req) => {
  if (!publicRoutes.includes(req.nextUrl.pathname) && !req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.AUTH_SIGN_IN, req.url));
  }

  if (unAuthRoutes.includes(req.nextUrl.pathname) && req.auth) {
    return NextResponse.redirect(new URL(FrontendRoutes.HOME, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
