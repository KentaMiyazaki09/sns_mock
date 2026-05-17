import { prisma } from "@/src/lib/prisma"
import { getPosts } from "../../../lib/posts"
import { getCurrentUser } from "../../../lib/mock-session"

export async function GET() {
  try {
    const posts = await getPosts()
    return new Response(JSON.stringify(posts), { status: 200 })
  } catch {
    return Response.json(
      { message: "ポストの取得に失敗しました" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 },
      )
    }

    const body = await request.json()
    const content = typeof body.content === "string" ? body.content.trim() : ""

    if (!content) {
      return Response.json(
        { message: "contentは必須です" },
        { status: 400 },
      )
    }
  
    const post = await prisma.post.create({
      data: {
        content,
        userId: currentUser.id,
        userName: currentUser.name,
      }
    })
    
    return new Response(JSON.stringify(post), { status: 201 })
  } catch {
    return Response.json(
      { message: "ポストの投稿に失敗しました" },
      { status: 500 },
    )
  }
}
