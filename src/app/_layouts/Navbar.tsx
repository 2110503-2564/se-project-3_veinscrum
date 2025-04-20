import { auth } from "@/auth";
import { Button } from "@/components/ui/shadcn/button";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import Link from "next/link";
import { AuthenticatedDropdownMenu } from "./AuthenticatedDropdownMenu";

export const Navbar = async () => {
  const session = await auth();

  const user = session?.token
    ? await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json() as Promise<GETMeResponse>)
        .catch(() => null)
    : null;

  return (
    <nav className="h-18 w-full bg-white px-4 shadow-md">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between py-4">
        <div className="flex items-center gap-x-6">
          <Link href={FrontendRoutes.HOME} className="text-lg font-semibold">
            Online Job Fair Registration
          </Link>
          {user?.data.role === "admin" ? (
            <Link
              className="transition-all hover:font-medium"
              href={FrontendRoutes.ADMIN_SESSION}
            >
              Dashboard
            </Link>
          ) : (
            <>
              {session?.token && (
                <Link
                  className="transition-all hover:font-medium"
                  href={FrontendRoutes.SESSION_LIST}
                >
                  My Session
                </Link>
              )}
              <Link
                className="transition-all hover:font-medium"
                href={FrontendRoutes.COMPANY_LIST}
              >
                Companies
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          {!user ? (
            <>
              <Button variant="outline">
                <Link href={FrontendRoutes.AUTH_SIGN_UP}>Sign up</Link>
              </Button>
              <Button>
                <Link href={FrontendRoutes.AUTH_SIGN_IN}>Sign in</Link>
              </Button>
            </>
          ) : (
            <AuthenticatedDropdownMenu
              user={user.data}
              token={session?.token}
            />
          )}
        </div>
      </div>
    </nav>
  );
};
