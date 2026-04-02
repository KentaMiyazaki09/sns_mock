import { prisma } from "@/src/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);

  console.log("DELETE id:", id, "postId:", postId);

  const result = await prisma.post.deleteMany({
    where: { id: postId },
  });

  console.log("deleteMany result:", result);

  return Response.json(result);
}
