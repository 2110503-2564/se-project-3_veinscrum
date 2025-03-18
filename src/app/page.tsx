import { Button } from "@/components/ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button asChild variant="outline" size="default">
        <Link href={FrontendRoutes.TEST_CLIENT}>Test Client</Link>
      </Button>
    </main>
  );
}
