import createJiti from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "url";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env/client");
jiti("./src/env/server");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
