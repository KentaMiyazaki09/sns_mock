import { Post } from "../../types/types"

export default function List({
  post,
  isOwner,
  onDeletePost,
}: {
  post: Post;
  isOwner: boolean;
  onDeletePost: (postId: number) => void;
}) {
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
}
