import Link from "next/link"
import { User } from "../../types/types"

export default function Heaeder({
  currentUser,
  onLogout,
}: {
  currentUser: User | null;
  onLogout: () => void;
}) {
  return (
    <header className="flex justify-between w-full p-2 fixed top-0 left-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xs">
      <h1 className="text-xl font-bold">SNS Mock</h1>
      <div className="flex items-center gap-3">
        {
          currentUser ? (
            <div className="flex items-center">
              <p className="text-sm before:content-[''] before:inline-block before:w-2.5 before:h-2.5 before:rounded-full before:bg-green-500 before:mr-2 mr-3">
                {currentUser.name}
              </p>
              <button
                onClick={onLogout}
                className="text-xs inline-flex items-center rounded-2xl border border-slate-300 px-2 py-1 text-slate-700 transition hover:bg-slate-100">
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm">
              ログイン
            </Link>
          )
        }
      </div>
    </header>
  )
}
