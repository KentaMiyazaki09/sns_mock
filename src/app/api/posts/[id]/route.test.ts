import { beforeEach, describe, expect, it, vi } from "vitest"
import { DELETE } from "./route"

const { mockDelete, mockFindUnique, mockGetCurrentUser } = vi.hoisted(() => {
  return {
    mockDelete: vi.fn(),
    mockFindUnique: vi.fn(),
    mockGetCurrentUser: vi.fn(),
  }
})

vi.mock("@/src/lib/prisma", () => ({
  prisma: {
    post: {
      delete: mockDelete,
      findUnique: mockFindUnique,
    },
  },
}))

vi.mock("../../../../lib/mock-session", () => ({
  getCurrentUser: mockGetCurrentUser,
}))

describe("posts/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue({
      id: "u1",
      name: "km",
    })
  })

  it("本人の投稿なら削除する", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      content: "hello",
      userId: "u1",
      userName: "km",
      createdAt: new Date("2026-04-07T10:00:00.000Z"),
    })
    mockDelete.mockResolvedValue({
      id: 1,
    })

    const request = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    })

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    })

    const json = await response.json()

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    })
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: 1 },
    })
    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
  })

  it("未ログインなら401を返す", async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const request = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    })

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    })

    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json).toEqual({ message: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it("他人の投稿なら403を返す", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      content: "hello",
      userId: "u2",
      userName: "other",
      createdAt: new Date("2026-04-07T10:00:00.000Z"),
    })

    const request = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    })

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    })

    const json = await response.json()

    expect(response.status).toBe(403)
    expect(json).toEqual({ message: "Forbidden" })
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it("投稿が存在しなければ404を返す", async () => {
    mockFindUnique.mockResolvedValue(null)

    const request = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    })

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json).toEqual({ message: "投稿が見つかりません" })
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
