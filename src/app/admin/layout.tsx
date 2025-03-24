"use client";

import { Button } from "@/components/ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] max-md:flex-col">
      <div className="shrink-0 space-y-2.5 border-r px-6 py-16">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-y-1.5">
          <Button
            className={cn(
              "flex w-full justify-start px-2.5",
              pathname === FrontendRoutes.ADMIN_SESSION &&
                "bg-accent text-accent-foreground",
            )}
            variant="ghost"
          >
            <Link href={FrontendRoutes.ADMIN_SESSION}>Interview Sessions</Link>
          </Button>
          <Button className="flex w-full justify-start px-2.5" variant="ghost">
            <Link href={FrontendRoutes.ADMIN_COMPANY}>Companies</Link>
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
