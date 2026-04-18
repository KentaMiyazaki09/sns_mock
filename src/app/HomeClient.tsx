"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import FeedScreen from "./ui/FeedScreen";
import { Feedback, Post, User } from "./types/types";

export default function HomeClient({
  initialPosts,
  currentUser,
}: {
  initialPosts: Post[];
  currentUser: User | null;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showMessage = ({ type, message }: Feedback) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

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

  const handleLogout = async () => {
    const res = await fetch("/api/session", {
      method: "DELETE",
    });

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "ログアウトに失敗しました",
      });
      return;
    }

    router.refresh();
  };

  const handleCreatePost = async (content: string) => {
    if (!currentUser) {
      showMessage({
        type: "error",
        message: "401 Unauthorized: 未ログインのため投稿できません",
      });
      return;
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
      }),
    });

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "投稿の作成に失敗しました",
      });
      return;
    }

    await fetchPosts();

    showMessage({
      type: "success",
      message: "投稿を作成しました",
    });
  };

  const handleDeletePost = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showMessage({
        type: "error",
        message: "投稿の削除に失敗しました",
      });
      return;
    }

    await fetchPosts();

    showMessage({
      type: "success",
      message: "自分の投稿を削除しました",
    });
  };

  return (
    <FeedScreen
      currentUser={currentUser}
      posts={posts}
      onLogout={handleLogout}
      onCreatePost={handleCreatePost}
      onDeletePost={handleDeletePost}
      feedback={feedback}
    />
  );
}
