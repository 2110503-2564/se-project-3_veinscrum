"use client";

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
import { deleteCookie } from "cookies-next";
import { ChevronDownIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
interface AuthenticatedDropdownMenuProps {
  user: User;
  token?: string;
}

export const AuthenticatedDropdownMenu: React.FC<
  AuthenticatedDropdownMenuProps
> = ({ user, token }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="auth-dropdown-menu-trigger"
          variant="ghost"
          size="lg"
        >
          <p>{user?.name}</p>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user.role === "company" && user.company === null ? (
          <DropdownMenuItem asChild>
            <Link
              data-testid="auth-dropdown-menu-create-company"
              href={FrontendRoutes.COMPANY_CREATE}
            >
              Create Company
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link
            data-testid="auth-dropdown-menu-profile"
            href={FrontendRoutes.PROFILE}
          >
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="auth-dropdown-menu-logout"
          onClick={async () => {
            await fetch(withBaseRoute(BackendRoutes.AUTH_LOGOUT), {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            signOut();
            deleteCookie("token");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
