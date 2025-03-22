import { auth } from "@/auth";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { LogoutMenuItem } from "../_components/LogoutMenuItem";

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
    <nav className="w-full bg-white px-4 shadow-md">
      <div className="mx-auto flex max-w-(--screen-2xl) items-center justify-between py-4">
        <div>
          <Link href="/" className="font-semibold">
            Online Job Fair Registration
          </Link>
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
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="lg">
                    <p>{user.data.name}</p>
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={FrontendRoutes.PROFILE}>Profile</Link>
                  </DropdownMenuItem>
                  <LogoutMenuItem token={session?.token} />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
