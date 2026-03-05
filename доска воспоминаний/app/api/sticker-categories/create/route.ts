import { NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceClient } from "@/lib/memory-board/server";

type RequestBody = {
  name: string;
  icon?: string;
  color?: string;
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

  const service = getServiceClient();

  const { data: existing } = await service
    .from("sticker_categories")
    .select("id")
    .eq("user_id", user.id);

  const { data, error } = await service
    .from("sticker_categories")
    .insert({
      user_id: user.id,
      name: body.name.trim(),
      icon: body.icon?.trim() || "📌",
      color: body.color || "#f59e0b",
      sort_order: existing?.length || 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
