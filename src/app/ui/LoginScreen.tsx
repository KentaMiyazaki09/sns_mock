"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    const trimmed = name.trim()

    if (!trimmed) return

    setIsSubmitting(true)
    setError("")

    const res = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trimmed,
      }),
    })

    if (!res.ok) {
      setError("ログインに失敗しました")
      setIsSubmitting(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <>
      <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold mb-5">ログイン</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 pb-1">ユーザー名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-1 outline-none transition focus:border-slate-500"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-3xl bg-amber-50 p-8 mt-6 shadow-sm ring-1 ring-amber-200">
        <p className="text-xs text-amber-900 font-bold mb-5 flex gap-1">
          <Image src="/icons/key.svg" width={16} height={10} alt="" />
          テスト用アカウント
        </p>
        <p className="text-xs text-slate-600 mb-2">※現在はユーザー名のみでログインする簡易モック版</p>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between bg-white p-3 rounded-xl">
            <p>Hoge</p>
            <p className="text-slate-500">password</p>
          </li>
          <li className="flex justify-between bg-white p-3 rounded-xl">
            <p>Fuga</p>
            <p className="text-slate-500">password</p>
          </li>
        </ul>
      </div>
    </>
  )
}
