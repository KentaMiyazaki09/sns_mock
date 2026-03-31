"use client"

import { useState } from "react";
import FeedScreen from "./components/FeedScreen";
import LoginScreen from "./components/LoginScreen";
import { Feedback, Post, User } from "./types/types";

const seedPosts: Post[] = [
  {
    id: 1,
    content: "今日はNext.jsのモックを作っています。",
    userId: "hoge",
    userName: "Hoge",
    createdAt: "2026-03-29 10:10",
  },
  {
    id: 2,
    content: "ラーメンが美味しい季節。",
    userId: "fuga",
    userName: "Fuga",
    createdAt: "2026-03-29 10:18",
  },
  {
    id: 3,
    content: "これは他人の投稿です。削除はできません。",
    userId: "piyo",
    userName: "Piyo",
    createdAt: "2026-03-29 10:24",
  },
  {
    id: 4,
    content: "次は、Next.jsのRoute HandlerでAPIを実装。",
    userId: "hoge",
    userName: "Hoge",
    createdAt: "2026-03-31 15:39",
  },
  {
    id: 5,
    content: "最後にPrismaでDBとの繋ぎ合わせをやるぞ〜",
    userId: "hoge",
    userName: "Hoge",
    createdAt: "2026-03-31 15:40",
  },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>(seedPosts)
  const [isShownLogin, setIsShownLogin] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const showMessage = ({
    type,
    message
  }: Feedback) => {
    setFeedback({type, message})
    setTimeout(() => {
      setFeedback(null)
    }, 2500)
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    showMessage({
      type: "success",
      message: `「${user.name}」でログインしました`
    })
  }
  const handleLoout = () => {
    setCurrentUser(null)
    setIsShownLogin(false)
    showMessage({
      type: "success",
      message: "ログアウトしました"
    })
  }

  const handleIsShownLogin = () => {
    setIsShownLogin(true)
  }

  const handleCreatePost = (content: string) => {

    if (!currentUser) {
      showMessage({
        type: "error",
        message: "401 Unauthorized: 未ログインのため投稿できません"
      })
      return
    }

    const newPost: Post = {
      id: Date.now(),
      content,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: "just now",
    }

    setPosts(prev => [newPost, ...prev])
    showMessage({
      type: "success",
      message: "投稿を作成しました"
    })
  }

  const handleDeletePost = (postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
    showMessage({
      type: "success",
      message: "自分の投稿を削除しました"
    })
  }

  /* 非ログイン時: ログイン画面 */
  if (!currentUser && isShownLogin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ログイン時: 投稿一覧画面 */
  return (
    <FeedScreen
      currentUser={currentUser}
      posts={posts}
      onLogout={handleLoout}
      onCreatePost={handleCreatePost}
      onDeletePost={handleDeletePost}
      onShownLogin={handleIsShownLogin}
      feedback={feedback}
    />
  );
}
