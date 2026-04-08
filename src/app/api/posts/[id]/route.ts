import { prisma } from "@/src/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const postId = Number(id);

    if (Number.isNaN(postId)) {
      return Response.json(
        { message: "不正なidです" },
        { status: 400 },
      )
    }

    const result = await prisma.post.deleteMany({
      where: { id: postId },
    });

    return Response.json(result, { status: 200 });
  } catch {
    return Response.json(
      { message: "ポストの削除に失敗しました" },
      { status: 500 }
    )
  }
}
