import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Awaitable, Session } from "next-auth";
import GooGleProvider from "next-auth/providers/google";

import prisma from "../../../lib/prismadb";

export default NextAuth({
  providers: [
    GooGleProvider({
      clientId: process.env.GOOGLE_CLIENT || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        let x = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
        });
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
});
