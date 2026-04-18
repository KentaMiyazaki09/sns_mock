import { redirect } from "next/navigation";
import LoginScreen from "../ui/LoginScreen";
import { getCurrentUser } from "../../lib/mock-session";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/");
  }

  return <LoginScreen />;
}
