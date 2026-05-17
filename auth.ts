import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DefaultSession } from "next-auth";

function requiredEnv(name: "AUTH_GITHUB_ID" | "AUTH_GITHUB_SECRET") {
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

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: requiredEnv("AUTH_GITHUB_ID"),
      clientSecret: requiredEnv("AUTH_GITHUB_SECRET"),
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider === "github" && account.providerAccountId) {
        token.id = account.providerAccountId;
      }

      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },
});
