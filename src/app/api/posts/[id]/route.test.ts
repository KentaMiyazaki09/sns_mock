import { beforeEach, describe, expect, it, vi } from "vitest"
import { DELETE } from "./route"

const { mockDeleteMany } = vi.hoisted(() => {
  return {
    mockDeleteMany: vi.fn(),
  }
})

vi.mock("@/src/lib/prisma", () => ({
  prisma: {
    post: {
      deleteMany: mockDeleteMany,
    },
  },
}))

describe("posts/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("idを受け取って該当ポストを削除する", async () => {
    mockDeleteMany.mockResolvedValue({ count: 1 })

    const request = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    })

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    })

    const json = await response.json()

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: 1 },
    })
    expect(response.status).toBe(200)
    expect(json).toEqual({ count: 1 })
  })
})