// ログインからそれぞれのAPI実行までの流れ
// 1. GitHubログイン成功
// 2. jwt callback で token.id を保存
// 3. session callback で session.user.id を作る
// 4. page.tsx や API で auth() を呼ぶ
// 5. session.user.id を currentUser.id として使う
// 6. 投稿作成・削除の認可に使う

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
    // tokenにGithub OAuthから取得したユーザー識別情報を保存
    // tokenは「Auth.js が内部で持っているログイン状態のデータ箱」
    // idをsessionを作るときに再利用が可能
    jwt({ token, account }) {
      if (account?.provider === "github" && account.providerAccountId) {
        token.id = account.providerAccountId;
      }

      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },

    // tokenをclient/serverから使いやすい形に変形
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },
});
