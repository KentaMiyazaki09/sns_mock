import { prisma } from "@/src/lib/prisma"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
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
    const body = await request.json()
    const { content, userId, userName } = body

    if (!content || !userId || !userName) {
      return Response.json(
        { message: "content, userId, userNameは必須です" },
        { status: 400 },
      )
    }
  
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        userName,
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
