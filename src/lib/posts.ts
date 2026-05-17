import { prisma } from "@/src/lib/prisma";
import { Post } from "../app/types/types";

export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    userId: post.userId,
    userName: post.user.name ?? post.userName,
    createdAt: post.createdAt.toISOString(),
  }));
}
