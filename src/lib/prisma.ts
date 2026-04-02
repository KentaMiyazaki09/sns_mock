/**
 * DB接続のためのPrismaクライアントを定義するファイル
 * このファイルでは、Prismaクライアントをシングルトンとして定義し、アプリケーション全体で共有できるようにしています。
 */

import { PrismaClient } from "@prisma/client/extension";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// hot reloadingによる追加インスタンスを防ぐため、開発環境ではグローバルオブジェクトにPrismaクライアントを保存
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
