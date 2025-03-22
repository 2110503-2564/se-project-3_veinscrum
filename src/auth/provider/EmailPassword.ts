import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import CredentialsProvider from "next-auth/providers/credentials";

export const EmailPasswordProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize(credentials) {
    const { email, password } = credentials;

    const user = await fetch(withBaseRoute(BackendRoutes.AUTH_LOGIN), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!user.ok) {
      throw new Error("Invalid credentials");
    }

    const data: LoginResponse = await user.json();

    if (!data.success) {
      console.error("Login failed", data);
      throw new Error(data.message);
    }

    return { token: data.token };
  },
});
