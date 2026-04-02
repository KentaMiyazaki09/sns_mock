/**
 * DB接続のためのPrismaクライアントを定義するファイル
 * このファイルでは、Prismaクライアントをシングルトンとして定義し、アプリケーション全体で共有できるようにしています。
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}