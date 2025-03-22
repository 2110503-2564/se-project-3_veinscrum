"use client";

import { DropdownMenuItem } from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { signOut } from "next-auth/react";

interface LogoutMenuItemProps {
  token?: string;
}

export const LogoutMenuItem: React.FC<LogoutMenuItemProps> = ({ token }) => {
  async function handleLogout() {
    await fetch(withBaseRoute(BackendRoutes.AUTH_LOGOUT), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    signOut();
  }

  return <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>;
};
