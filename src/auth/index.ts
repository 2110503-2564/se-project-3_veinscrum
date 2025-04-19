import { FrontendRoutes } from "@/constants/routes/Frontend";
import NextAuth from "next-auth";
import { EmailPasswordProvider } from "./provider/EmailPassword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [EmailPasswordProvider],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.token) {
        session.token = token.token;
      }

      return session;
    },
  },
  pages: {
    signIn: FrontendRoutes.AUTH_SIGN_IN,
    signOut: "/",
  },
});
