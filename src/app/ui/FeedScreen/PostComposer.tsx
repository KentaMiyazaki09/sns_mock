"use client"

import { useState } from "react";

export default function PostComposer({
  isOpen,
  onClose,
  onSubmit
} : {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    const trimmed = content.trim()
    if (!trimmed) return
    onSubmit(content)
    setContent("")
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full rounded-t-[28px] bg-white p-5 shadow-2xl transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">投稿を作成</h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition bg-slate-100"
            >
              ×
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          ></textarea>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              投稿する
            </button>
          </div>

        </div>
      )}
    </>
  )
}