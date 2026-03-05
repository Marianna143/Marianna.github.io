import { NextResponse } from "next/server";
import { assertBoardOwnership, getAuthenticatedUser, getServiceClient } from "@/lib/memory-board/server";
import type { DayEntryPayload } from "@/lib/memory-board/types";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as DayEntryPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!payload.boardId || !payload.date) {
    return NextResponse.json({ error: "boardId and date are required" }, { status: 400 });
  }

  try {
    const board = await assertBoardOwnership(payload.boardId, user);
    const service = getServiceClient();

    const { data: dayEntry, error: dayError } = await service
      .from("day_entries")
      .upsert(
        {
          board_id: board.id,
          date: payload.date,
          main_event: payload.mainEvent || null,
          description: payload.description || null,
        },
        {
          onConflict: "board_id,date",
        },
      )
      .select("id, board_id, date")
      .single();

    if (dayError || !dayEntry) {
      throw dayError ?? new Error("Failed to upsert day entry");
    }

    await service.from("entry_photos").delete().eq("entry_id", dayEntry.id);

    if (payload.photos.length > 0) {
      const { error: photosError } = await service.from("entry_photos").insert(
        payload.photos.map((photo, index) => ({
          entry_id: dayEntry.id,
          storage_path: photo.storagePath,
          taken_at: photo.takenAt,
          display_date: photo.displayDate,
          is_featured: Boolean(photo.isFeatured) || index === 0,
          booth_group: photo.boothGroup,
          sort_order: photo.sortOrder,
          width: photo.width,
          height: photo.height,
        })),
      );

      if (photosError) {
        throw photosError;
      }
    }

    await service.from("entry_stickers").delete().eq("entry_id", dayEntry.id);

    if (payload.stickerIds.length > 0) {
      const { error: stickerError } = await service.from("entry_stickers").insert(
        payload.stickerIds.map((stickerId) => ({
          entry_id: dayEntry.id,
          sticker_id: stickerId,
          x: null,
          y: null,
          rotation: null,
          scale: null,
          z_index: null,
        })),
      );

      if (stickerError) {
        throw stickerError;
      }
    }

    const { data: existingLayout } = await service
      .from("board_layout_items")
      .select("id")
      .eq("board_id", board.id)
      .eq("item_type", "photo")
      .eq("ref_id", dayEntry.id)
      .maybeSingle();

    if (!existingLayout) {
      const { data: countRows } = await service
        .from("board_layout_items")
        .select("id")
        .eq("board_id", board.id)
        .eq("item_type", "photo");

      const count = countRows?.length ?? 0;
      const col = count % 6;
      const row = Math.floor(count / 6);

      await service.from("board_layout_items").insert({
        board_id: board.id,
        item_type: "photo",
        ref_id: dayEntry.id,
        x: 70 + col * 180,
        y: 140 + row * 260,
        rotation: ((count % 8) - 4) * 0.9,
        scale: 1,
        z_index: 20 + count,
        pinned: true,
      });
    }

    return NextResponse.json({ ok: true, entryId: dayEntry.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save day entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
