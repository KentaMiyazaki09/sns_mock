import { NextResponse } from "next/server";
import { createSessionCookie, deleteSessionCookie } from "../../../lib/mock-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { message: "ユーザー名は必須です" },
        { status: 400 },
      );
    }

    const response = NextResponse.json(
      {
        user: {
          id: name.toLocaleLowerCase(),
          name,
        },
      },
      { status: 200 },
    );

    response.cookies.set(createSessionCookie(name));

    return response;
  } catch {
    return NextResponse.json(
      { message: "ログインに失敗しました" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(deleteSessionCookie());
  return response;
}
