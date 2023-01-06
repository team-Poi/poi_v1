import NextAuth from "next-auth";
import GooGleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GooGleProvider({
      clientId: process.env.GOOGLE_CLIENT || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
};

export default NextAuth(authOptions);
