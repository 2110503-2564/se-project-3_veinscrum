import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.string().url(),
    AUTH_SECRET: z.string(),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: process.env.IS_ACTION === "true",
});
