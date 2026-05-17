"use client"

import Image from "next/image"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setIsSubmitting(true)
    setError("")

    const result = await signIn("github", {
      callbackUrl: "/",
      redirect: false,
    })

    if (!result || result.error) {
      setError("ログインに失敗しました")
      setIsSubmitting(false)
      return
    }

    window.location.href = result.url ?? "/"
  }

  return (
    <>
      <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold mb-5">ログイン</h1>

        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            GitHubアカウントでログイン。
          </p>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            <Image src="/icons/key.svg" width={16} height={16} alt="" />
            {isSubmitting ? "GitHubへ移動中..." : "GitHubでログイン"}
          </button>
        </div>
      </div>
    </>
  )
}
