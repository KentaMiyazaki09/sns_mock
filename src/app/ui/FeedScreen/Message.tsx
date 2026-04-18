import { Feedback } from "../../types/types"

export default function Message({
  feedback,
}: {
  feedback: Feedback;
}) {
  return (
    <div
      className={`mb-4 rounded-2xl px-4 py-3 text-sm ${
        feedback.type === "success"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-red-50 text-red-700 ring-1 ring-red-200"
      }`}
    >
      {feedback.message}
    </div>
  )
}