import { NextResponse } from "next/server";
import { assertBoardOwnership, getAuthenticatedUser, getDatabaseClient } from "@/lib/memory-board/server";

type RequestBody = {
  boardId: string;
  title: string;
  audioPath: string;
  durationSec?: number | null;
  x?: number;
  y?: number;
  rotation?: number;
};

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.boardId || !body.audioPath || !body.title?.trim()) {
    return NextResponse.json({ error: "boardId, title and audioPath are required" }, { status: 400 });
  }

  try {
    const board = await assertBoardOwnership(body.boardId, user);
    const db = await getDatabaseClient();

    const { data: countRows } = await db
      .from("cassettes")
      .select("id")
      .eq("board_id", board.id);

    const count = countRows?.length || 0;

    const { data, error } = await db
      .from("cassettes")
      .insert({
        board_id: board.id,
        title: body.title.trim(),
        audio_path: body.audioPath,
        duration_sec: body.durationSec ?? null,
        x: body.x ?? 90 + count * 130,
        y: body.y ?? 980,
        rotation: body.rotation ?? 0,
        z_index: 220 + count,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw error ?? new Error("Failed to create cassette");
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create cassette";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
