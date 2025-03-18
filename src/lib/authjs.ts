"use server";

import { auth } from "@/auth";

export async function getAuthToken() {
  const session = await auth();

  return session?.token;
}
