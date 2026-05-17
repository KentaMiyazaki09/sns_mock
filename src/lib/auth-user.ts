import { Session } from "next-auth";
import { User } from "../app/types/types";

export function getCurrentUserFromSession(session: Session | null): User | null {
  const id = session?.user?.id;
  const name = session?.user?.name ?? null;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
  };
}
