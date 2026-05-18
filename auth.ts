import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DefaultSession } from "next-auth";
import { prisma } from "@/src/lib/prisma";

function requiredEnv(name: "AUTH_GOOGLE_ID" | "AUTH_GOOGLE_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: requiredEnv("AUTH_GOOGLE_ID"),
      clientSecret: requiredEnv("AUTH_GOOGLE_SECRET"),
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
