/**
 * Prismaをモックしたユニットテスト
 * src/lib/prismaで定義したAPIの動作をテスト
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

import { GET, POST } from "./route"

const { mockFindMany, mockCreate } = vi.hoisted(() => {
  return {
    mockFindMany: vi.fn(),
    mockCreate: vi.fn(),
  }
})

vi.mock("@/src/lib/prisma", () => {
  return {
    prisma: {
      post: {
        findMany: mockFindMany,
        create: mockCreate
      },
    },
  }
})

describe("posts route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET", () => {
    it("投稿一覧をcreatedAt降順で返す", async () => {
      const mockPosts = [
        {
          id: 2,
          content: "new post",
          userId: "u1",
          userName: "km",
          createdAt: new Date("2026-04-07T10:00:00.000Z"),
        },
        {
          id: 1,
          content: "old post",
          userId: "u2",
          userName: "other",
          createdAt: new Date("2026-04-06T10:00:00.000Z"),
        },
      ]

      mockFindMany.mockResolvedValue(mockPosts)

      const response = await GET()
      const json = await response.json()

      expect(mockFindMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
      })
      expect(response.status).toBe(200)
      expect(json).toEqual([
        {
          ...mockPosts[0],
          createdAt: "2026-04-07T10:00:00.000Z",
        },
        {
          ...mockPosts[1],
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
    it("正常なbodyなら投稿を作成して201を返す", async () => {
      const requestBody = {
        content: "hello",
        userId: "u1",
        userName: "km",
      }

      const createdPost = {
        id: 1,
        ...requestBody,
        createdAt: new Date("2026-04-07T10:00:00.000Z"),
      }

      mockCreate.mockResolvedValue(createdPost)

      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          content: "hello",
          userId: "u1",
          userName: "km",
        },
      })
      expect(response.status).toBe(201)
      expect(json).toEqual({
        ...createdPost,
        createdAt: "2026-04-07T10:00:00.000Z",
      })
    })

    it("contentがないと400を返す", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "u1",
          userName: "km",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        message: "content, userId, userNameは必須です",
      })
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it("userIdがないと400を返す", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "hello",
          userName: "km",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        message: "content, userId, userNameは必須です",
      })
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it("userNameがないと400を返す", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "hello",
          userId: "u1",
        }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        message: "content, userId, userNameは必須です",
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
          userId: "u1",
          userName: "km",
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
