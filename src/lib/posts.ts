import { prisma } from "@/src/lib/prisma";
import { Post } from "../app/types/types";

export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));
}
