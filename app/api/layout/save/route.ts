import { NextResponse } from "next/server";
import { assertBoardOwnership, getAuthenticatedUser, getDatabaseClient } from "@/lib/memory-board/server";
import type { LayoutItem } from "@/lib/memory-board/types";

type RequestBody = {
  boardId: string;
  items: LayoutItem[];
};

const validTypes = new Set(["photo", "sticker", "cassette"]);

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body || !body.boardId || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const board = await assertBoardOwnership(body.boardId, user);
    const db = await getDatabaseClient();

    await db.from("board_layout_items").delete().eq("board_id", board.id);

    if (body.items.length > 0) {
      const rows = body.items
        .filter((item) => validTypes.has(item.itemType))
        .map((item) => ({
          board_id: board.id,
          item_type: item.itemType,
          ref_id: item.refId,
          x: Math.round(item.x),
          y: Math.round(item.y),
          rotation: item.rotation,
          scale: item.scale,
          z_index: item.zIndex,
          pinned: item.pinned,
        }));

      if (rows.length > 0) {
        const { error: insertError } = await db.from("board_layout_items").insert(rows);
        if (insertError) {
          throw insertError;
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save layout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
