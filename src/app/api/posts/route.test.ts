/**
 * Prismaをモックしたユニットテスト
 * src/lib/prismaで定義したAPIの動作をテスト
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

import { GET, POST } from "./route"

const { mockFindMany, mockCreate, mockAuth } = vi.hoisted(() => {
  return {
    mockFindMany: vi.fn(),
    mockCreate: vi.fn(),
    mockAuth: vi.fn(),
  }
})

vi.mock("@/src/lib/prisma", () => {
  return {
    prisma: {
      post: {
        findMany: mockFindMany,
        create: mockCreate,
      },
    },
  }
})

vi.mock("@/auth", () => {
  return {
    auth: mockAuth,
  }
})

describe("posts route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({
      user: {
        id: "u1",
        name: "km",
      },
    })
  })

  describe("GET", () => {
    it("投稿一覧をcreatedAt降順で返す", async () => {
      const mockPosts = [
        {
          id: 2,
          content: "new post",
          userId: "u1",
          user: {
            id: "u1",
            name: "km",
            email: null,
            emailVerified: null,
            image: null,
          },
          createdAt: new Date("2026-04-07T10:00:00.000Z"),
        },
        {
          id: 1,
          content: "old post",
          userId: "u2",
          user: {
            id: "u2",
            name: "other",
            email: null,
            emailVerified: null,
            image: null,
          },
          createdAt: new Date("2026-04-06T10:00:00.000Z"),
        },
      ]

      mockFindMany.mockResolvedValue(mockPosts)

      const response = await GET()
      const json = await response.json()

      expect(mockFindMany).toHaveBeenCalledWith({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      expect(response.status).toBe(200)
      expect(json).toEqual([
        {
          id: 2,
          content: "new post",
          userId: "u1",
          userName: "km",
          createdAt: "2026-04-07T10:00:00.000Z",
        },
        {
          id: 1,
          content: "old post",
          userId: "u2",
          userName: "other",
          createdAt: "2026-04-06T10:00:00.000Z",
        },
      ])
    })

    it("取得に失敗したら500を返す", async () => {
      mockFindMany.mockRejectedValue(new Error("DB error"))

      const response = await GET()
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        message: "ポストの取得に失敗しました",
      })
    })
  })

  describe("POST", () => {
    it("ログイン中のユーザーで投稿を作成して201を返す", async () => {
      const createdPost = {
        id: 1,
        content: "hello",
        userId: "u1",
        createdAt: new Date("2026-04-07T10:00:00.000Z"),
      }

      mockCreate.mockResolvedValue(createdPost)

      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "hello",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          content: "hello",
          userId: "u1",
        },
      })
      expect(response.status).toBe(201)
      expect(json).toEqual({
        ...createdPost,
        createdAt: "2026-04-07T10:00:00.000Z",
      })
    })

    it("未ログインなら401を返す", async () => {
      mockAuth.mockResolvedValue(null)

      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "hello",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json).toEqual({
        message: "Unauthorized",
      })
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it("contentがないと400を返す", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        message: "contentは必須です",
      })
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it("投稿に失敗したら500を返す", async () => {
      mockCreate.mockRejectedValue(new Error("DB error"))

      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "hello",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        message: "ポストの投稿に失敗しました",
      })
    })
  })
})
