import CredentialsProvider from "next-auth/providers/credentials";

export const EmailPasswordProvider = CredentialsProvider({
  name: "email-password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize() {
    return null;
  },
});
