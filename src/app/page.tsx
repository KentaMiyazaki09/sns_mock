"use client"

import { useEffect, useState } from "react";
import FeedScreen from "./components/FeedScreen";
import LoginScreen from "./components/LoginScreen";
import { Feedback, Post, User } from "./types/types";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
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

  /* 初回レンダリング時のデータ取得 */
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts");

        if (!res.ok) {
          showMessage({
            type: "error",
            message: "投稿一覧の取得に失敗しました",
          });
          return;
        }

        const data = await res.json();
        setPosts(data);
      } catch {
        showMessage({
          type: "error",
          message: "通信エラーが発生しました",
        });
      }
    };

    loadPosts();
  }, []);

  /* ログイン周りの関数 */
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

  /* 投稿関連の関数 */
  const fetchPosts = async () => {
    const res = await fetch("/api/posts");

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "投稿一覧の取得に失敗しました",
      });
      return;
    }

    const data = await res.json();
    setPosts(data);
  };

  const handleCreatePost = async (content: string) => {

    if (!currentUser) {
      showMessage({
        type: "error",
        message: "401 Unauthorized: 未ログインのため投稿できません"
      })
      return
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        userId: currentUser.id,
        userName: currentUser.name,
      })
    })

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "投稿の作成に失敗しました"
      })
      return
    }

    await fetchPosts()

    showMessage({
      type: "success",
      message: "投稿を作成しました"
    })
  }

  const handleDeletePost = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    })

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "投稿の削除に失敗しました"
      })
      return
    }

    await fetchPosts()

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
