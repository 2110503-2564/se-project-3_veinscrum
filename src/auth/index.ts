import NextAuth from "next-auth";
import { EmailPasswordProvider } from "./provider/EmailPassword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [EmailPasswordProvider],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
});
