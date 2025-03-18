import { env } from "@/env/client";
import { default as axiosBase } from "axios";
import { getAuthToken } from "./authjs";

const axios = axiosBase.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
});

axios.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (!config.headers["Content-Type"])
      config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axios };
