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
            GitHubアカウントでログインして、Auth.js の標準セッション構成を確認します。
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

      <div className="mx-auto max-w-md rounded-3xl bg-amber-50 p-8 mt-6 shadow-sm ring-1 ring-amber-200">
        <p className="text-xs text-amber-900 font-bold mb-5 flex gap-1">
          <Image src="/icons/key.svg" width={16} height={10} alt="" />
          事前準備
        </p>
        <p className="text-xs text-slate-600 mb-2">※ `.env.local` に GitHub OAuth の設定が必要です</p>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between bg-white p-3 rounded-xl">
            <p>AUTH_GITHUB_ID</p>
            <p className="text-slate-500">required</p>
          </li>
          <li className="flex justify-between bg-white p-3 rounded-xl">
            <p>AUTH_GITHUB_SECRET</p>
            <p className="text-slate-500">required</p>
          </li>
          <li className="flex justify-between bg-white p-3 rounded-xl">
            <p>AUTH_SECRET</p>
            <p className="text-slate-500">required</p>
          </li>
        </ul>
      </div>
    </>
  )
}
