import { Suspense } from "react";
import HomeClient from "./HomeClient";
import FeedScreenLoading from "./ui/FeedScreen/Loading";
import { getPosts } from "../lib/posts";
import { getCurrentUser } from "../lib/mock-session";

async function HomeContent() {
  const [posts, currentUser] = await Promise.all([getPosts(), getCurrentUser()]);

  return <HomeClient initialPosts={posts} currentUser={currentUser} />;
}

export default function Home() {
  return (
    <Suspense fallback={<FeedScreenLoading />}>
      <HomeContent />
    </Suspense>
  );
}
