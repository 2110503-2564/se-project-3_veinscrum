import { signOut } from "@/auth";
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { cookies } from "next/headers";

interface LogoutMenuItemProps {
  token?: string;
}

export const LogoutMenuItem: React.FC<LogoutMenuItemProps> = ({ token }) => {
  return (
    <form
      action={async () => {
        await fetch(withBaseRoute(BackendRoutes.AUTH_LOGOUT), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        signOut();
        (await cookies()).delete("role_cache");
      }}
    >
      <button
        className="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
        type="submit"
      >
        Logout
      </button>
    </form>
  );
};
