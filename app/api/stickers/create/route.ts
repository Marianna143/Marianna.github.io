import { NextResponse } from "next/server";
import { getAuthenticatedUser, getDatabaseClient } from "@/lib/memory-board/server";

type RequestBody = {
  name: string;
  emoji?: string;
  color?: string;
  categoryId?: string | null;
};

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const db = await getDatabaseClient();

  const { data: existing } = await db.from("stickers").select("id").eq("user_id", user.id);

  const { data, error } = await db
    .from("stickers")
    .insert({
      user_id: user.id,
      name: body.name.trim(),
      emoji: body.emoji?.trim() || "✨",
      color: body.color || "#34d399",
      category_id: body.categoryId || null,
      sort_order: existing?.length || 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to create sticker" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
