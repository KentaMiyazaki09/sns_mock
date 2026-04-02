import { prisma } from "@/src/lib/prisma"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
  return new Response(JSON.stringify(posts))
}

export async function POST(request: Request) {
  const body = await request.json()

  const post = await prisma.post.create({
    data: {
      content: body.content,
      userId: body.userId,
      userName: body.userName,
    }
  })
  
  return new Response(JSON.stringify(post))
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await prisma.post.delete({
    where: { id: Number(id) },
  })
  return new Response(JSON.stringify({ message: "Post deleted" }))
}
