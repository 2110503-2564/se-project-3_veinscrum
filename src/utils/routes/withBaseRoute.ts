import { env } from "@/env/client";

export function withBaseRoute(path: string): string {
  return env.NEXT_PUBLIC_API_BASE_URL + path;
}
