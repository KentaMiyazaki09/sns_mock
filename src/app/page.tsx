import { Suspense } from "react";
import { auth } from "@/auth";
import HomeClient from "./HomeClient";
import FeedScreenLoading from "./ui/FeedScreen/Loading";
import { getPosts } from "../lib/posts";
import { getCurrentUserFromSession } from "../lib/auth-user";

async function HomeContent() {
  const [posts, session] = await Promise.all([getPosts(), auth()]);
  const currentUser = getCurrentUserFromSession(session);

  return <HomeClient initialPosts={posts} currentUser={currentUser} />;
}

export default function Home() {
  return (
    <Suspense fallback={<FeedScreenLoading />}>
      <HomeContent />
    </Suspense>
  );
}
