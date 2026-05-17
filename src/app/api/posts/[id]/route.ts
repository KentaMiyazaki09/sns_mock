import { auth } from "@/auth"
import { prisma } from "@/src/lib/prisma"
import { getCurrentUserFromSession } from "../../../../lib/auth-user"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const session = await auth()
    const currentUser = getCurrentUserFromSession(session)

    if (!currentUser) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await params;
    const postId = Number(id);

    if (Number.isNaN(postId)) {
      return Response.json(
        { message: "不正なidです" },
        { status: 400 },
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return Response.json(
        { message: "投稿が見つかりません" },
        { status: 404 },
      )
    }

    if (post.userId !== currentUser.id) {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 },
      )
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json(
      { message: "ポストの削除に失敗しました" },
      { status: 500 }
    )
  }
}
