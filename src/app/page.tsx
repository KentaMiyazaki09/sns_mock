import FeedScreen from "./components/FeedScreen";
import { Post, User } from "./types/types";

const currentUser: User = {
  id: "u1",
  name: "user1",
}

const posts: Post[] = [
  {
    id: 1,
    content: "今日は Next.js のモックを作っています。",
    userId: "u1",
    userName: "kenta",
    createdAt: "2026-03-29 10:10",
  },
  {
    id: 2,
    content: "これは他人の投稿です。削除はできません。",
    userId: "u2",
    userName: "suzuki",
    createdAt: "2026-03-29 10:18",
  },
  {
    id: 3,
    content: "下からニュッと出る投稿UIにしています。",
    userId: "u3",
    userName: "tanaka",
    createdAt: "2026-03-29 10:24",
  },
];

export default function Home() {

  /* 非ログイン時: ログイン画面 */
  // if (!currentUser) {
  //   return <LoginScreen onLogin={handleLogin} />;
  // }

  /* ログイン時: 投稿一覧画面 */
  return (
     <FeedScreen
      currentUser={currentUser}
      posts={posts}
      // onLogout={handleLogout}
      // onCreatePost={handleCreatePost}
      // onDeletePost={handleDeletePost}
      // feedback={feedback}
    />
  );
}
