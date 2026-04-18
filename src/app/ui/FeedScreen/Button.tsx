

export default function Button({
  onClick
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-slate-900 text-white text-2xl shadow-lg transition hover:scale-105"
      aria-label="投稿を開く"
    >
      ＋
    </button>
  )
}