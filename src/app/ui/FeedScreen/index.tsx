"use client"

import { useMemo, useState } from "react";
import { Feedback, Post, User } from "../../types/types"
import PostComposer from "./PostComposer";
import Heaeder from "./Header";
import Message from "./Message";
import Button from "./Button";
import List from "./List";

export default function FeedScreen({
  currentUser,
  posts,
  onLogout,
  onDeletePost,
  onCreatePost,
  feedback,
}: {
  currentUser: User | null;
  posts: Post[];
  onLogout: () => void;
  onDeletePost: (postId: number) => void;
  onCreatePost: (content: string) => void;
  feedback: Feedback | null;
}) {

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.id - a.id)
  }, [posts])

  const [composerOpen, setComposerOpen] = useState(false)

  return (
    <div>

      <Heaeder
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="pt-5">
        { feedback && <Message feedback={feedback} /> }

        <List
          posts={sortedPosts}
          currentUser={currentUser}
          onDeletePost={onDeletePost}
        />
      </main>

      <Button onClick={() => setComposerOpen(true)} />

      <PostComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={onCreatePost}
      />

    </div>
  )
}
