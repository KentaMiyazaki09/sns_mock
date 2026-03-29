import { useMemo } from "react";
import { Post, User } from "../types/types"

export default function FeedScreen({
  currentUser,
  posts,
  onLogout,
  onDeletePost,
}: {
  currentUser: User | null;
  posts: Post[];
  onLogout: () => void;
  onDeletePost: (postId: number) => void;
}) {

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.id - a.id)
  }, [posts])

  return (
    <div>
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
              <button className="text-sm">ログイン</button>
            )
          }
        </div>
      </header>

      <main className="pt-5">
        <div className="space-y-3">
          {sortedPosts.map(post => {
            const isOwner = currentUser?.id === post.userId

            return (
              <article key={post.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <p className="font-semibold text-slate-900">{post.userName}</p>
                    {
                      isOwner && (
                        <p className="text-blue-600 bg-blue-100 px-1 py-0.5 rounded-md text-xs ml-2">自分の投稿</p>
                      )
                    }
                  </div>

                  <div className="flex items-center">
                    <p className="mt-1 text-xs text-slate-500">{post.createdAt}</p>
                    {
                      isOwner && (
                        <button
                          onClick={() => onDeletePost(post.id)}
                          className="text-xs font-semibold inline-flex items-center rounded-md border border-red-500 px-1 py-0.5 text-red-500 transition hover:bg-slate-100 ml-2">
                          削除
                        </button>
                      )
                    }
                  </div>
                </div>

                 <p className="mt-4 whitespace-pre-wrap text-slate-700">{post.content}</p>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}