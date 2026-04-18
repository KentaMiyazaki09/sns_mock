import { cookies } from "next/headers";
import { User } from "../app/types/types";

const SESSION_COOKIE_NAME = "sns_mock_user";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    return null;
  }

  return {
    id: session.value.toLocaleLowerCase(),
    name: session.value,
  };
}

export function createSessionCookie(name: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: name,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function deleteSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
