export type User = {
  id: string;
  name: string;
}

export type Post = {
  id: number;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}
