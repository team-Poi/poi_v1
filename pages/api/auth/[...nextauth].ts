import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GooGleProvider from "next-auth/providers/google";

import prisma from "../../../lib/prismadb";

export const authOptions = {
  providers: [
    GooGleProvider({
      clientId: process.env.GOOGLE_CLIENT || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
