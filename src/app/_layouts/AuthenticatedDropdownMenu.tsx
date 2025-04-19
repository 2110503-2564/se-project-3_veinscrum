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
  name: string;
  token?: string;
}

export const AuthenticatedDropdownMenu: React.FC<
  AuthenticatedDropdownMenuProps
> = ({ name, token }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg">
          <p>{name}</p>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={FrontendRoutes.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
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
