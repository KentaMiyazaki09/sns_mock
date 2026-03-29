"use client"

import { useState } from "react";
import FeedScreen from "./components/FeedScreen";
import LoginScreen from "./components/LoginScreen";
import { Post, User } from "./types/types";

const posts: Post[] = [
  {
    id: 1,
    content: "今日は Next.js のモックを作っています。",
    userId: "hoge",
    userName: "Hoge",
    createdAt: "2026-03-29 10:10",
  },
  {
    id: 2,
    content: "これは他人の投稿です。削除はできません。",
    userId: "fuga",
    userName: "Fuga",
    createdAt: "2026-03-29 10:18",
  },
  {
    id: 3,
    content: "下からニュッと出る投稿UIにしています。",
    userId: "piyo",
    userName: "Piyo",
    createdAt: "2026-03-29 10:24",
  },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }
  const handleLoout = () => {
    setCurrentUser(null)
  }

  /* 非ログイン時: ログイン画面 */
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ログイン時: 投稿一覧画面 */
  return (
    <FeedScreen
      currentUser={currentUser}
      posts={posts}
      onLogout={handleLoout}
      // onCreatePost={handleCreatePost}
      // onDeletePost={handleDeletePost}
      // feedback={feedback}
    />
  );
}
