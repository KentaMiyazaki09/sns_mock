export type User = {
  id: string;
  name: string;
  // password: string;
}

export type Post = {
  id: number;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export type Feedback = {
  type: "success" | "error";
  message: string;
}
