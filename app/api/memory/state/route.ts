import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getPublicFileUrl, getDatabaseClient } from "@/lib/memory-board/server";
import type { MemoryBoardState, Sticker } from "@/lib/memory-board/types";

const defaultStickers = [
  { name: "Сердечко", emoji: "💚", color: "#34d399" },
  { name: "Звезда", emoji: "⭐", color: "#6ee7b7" },
  { name: "Тепло", emoji: "🕯️", color: "#2dd4bf" },
  { name: "Смех", emoji: "😂", color: "#22c55e" },
  { name: "Мечта", emoji: "☁️", color: "#38bdf8" },
] as const;

async function ensureDefaultStickers(userId: string) {
  const db = await getDatabaseClient();
  const { data: categories } = await db
    .from("sticker_categories")
    .select("id")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  let categoryId = categories?.[0]?.id ?? null;

  if (!categoryId) {
    const { data: createdCategory } = await db
      .from("sticker_categories")
      .insert({
        user_id: userId,
        name: "Изумрудные",
        icon: "🍀",
        color: "#34d399",
        sort_order: 0,
      })
      .select("id")
      .single();

    categoryId = createdCategory?.id ?? null;
  }

  const { data: existing } = await db.from("stickers").select("id").eq("user_id", userId).limit(1);
  if (existing && existing.length > 0) return;

  await db.from("stickers").insert(
    defaultStickers.map((sticker, index) => ({
      user_id: userId,
      name: sticker.name,
      emoji: sticker.emoji,
      color: sticker.color,
      category_id: categoryId,
      sort_order: index,
    })),
  );
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawYear = request.nextUrl.searchParams.get("year");
  const parsedYear = Number(rawYear || new Date().getFullYear());
  const year = Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear();

  const db = await getDatabaseClient();

  await db.from("profiles").upsert({
    user_id: user.id,
    display_name: user.user_metadata?.display_name ?? null,
  });

  const { data: board, error: boardError } = await db
    .from("boards")
    .upsert(
      {
        user_id: user.id,
        year,
        title: `Мои воспоминания ${year}`,
      },
      {
        onConflict: "user_id,year",
      },
    )
    .select("id, user_id, year, title, created_at, updated_at")
    .single();

  if (boardError || !board) {
    return NextResponse.json({ error: "Failed to load board" }, { status: 500 });
  }

  await ensureDefaultStickers(user.id);

  const { data: entryRows } = await db
    .from("day_entries")
    .select("id, board_id, date, main_event, description, created_at, updated_at")
    .eq("board_id", board.id)
    .order("date", { ascending: true });

  const entryIds = (entryRows ?? []).map((row) => row.id);

  const [{ data: photoRows }, { data: entryStickerRows }, { data: stickerRows }, { data: categoryRows }, { data: cassetteRows }, { data: layoutRows }, { data: exportRows }] =
    await Promise.all([
      entryIds.length
        ? db
            .from("entry_photos")
            .select(
              "id, entry_id, storage_path, taken_at, display_date, is_featured, booth_group, sort_order, width, height",
            )
            .in("entry_id", entryIds)
            .order("sort_order", { ascending: true })
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      entryIds.length
        ? db.from("entry_stickers").select("entry_id, sticker_id").in("entry_id", entryIds)
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      db
        .from("stickers")
        .select("id, user_id, name, emoji, image_path, color, category_id, sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      db
        .from("sticker_categories")
        .select("id, user_id, name, icon, color, sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      db
        .from("cassettes")
        .select("id, board_id, title, audio_path, duration_sec, cover_path, x, y, rotation, z_index, created_at")
        .eq("board_id", board.id)
        .order("created_at", { ascending: true }),
      db
        .from("board_layout_items")
        .select("item_type, ref_id, x, y, rotation, scale, z_index, pinned")
        .eq("board_id", board.id),
      db
        .from("exports")
        .select("id, board_id, year, png_path, pdf_path, status, created_at")
        .eq("board_id", board.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const photoByEntry = new Map<string, MemoryBoardState["entries"][number]["photos"]>();
  for (const raw of photoRows ?? []) {
    const row = raw as {
      id: string;
      entry_id: string;
      storage_path: string;
      taken_at: string | null;
      display_date: string;
      is_featured: boolean;
      booth_group: string | null;
      sort_order: number;
      width: number | null;
      height: number | null;
    };

    const photos = photoByEntry.get(row.entry_id) ?? [];
    photos.push({
      ...row,
      url: getPublicFileUrl("memory-photos", row.storage_path),
    });
    photoByEntry.set(row.entry_id, photos);
  }

  const stickersByEntry = new Map<string, string[]>();
  for (const raw of entryStickerRows ?? []) {
    const row = raw as { entry_id: string; sticker_id: string };
    const ids = stickersByEntry.get(row.entry_id) ?? [];
    ids.push(row.sticker_id);
    stickersByEntry.set(row.entry_id, ids);
  }

  const entries = (entryRows ?? []).map((entry) => ({
    ...entry,
    photos: photoByEntry.get(entry.id) ?? [],
    sticker_ids: stickersByEntry.get(entry.id) ?? [],
  }));

  const stickers: Sticker[] = (stickerRows ?? []).map((sticker) => ({
    ...sticker,
    image_url: sticker.image_path ? getPublicFileUrl("memory-stickers", sticker.image_path) : null,
  }));

  const payload: MemoryBoardState = {
    board,
    entries,
    stickers,
    stickerCategories: categoryRows ?? [],
    cassettes:
      (cassetteRows ?? []).map((cassette) => ({
        ...cassette,
        audio_url: getPublicFileUrl("memory-audio", cassette.audio_path),
      })) ?? [],
    layoutItems: (layoutRows ?? []).map((item) => ({
      itemType: item.item_type,
      refId: item.ref_id,
      x: item.x,
      y: item.y,
      rotation: item.rotation,
      scale: item.scale,
      zIndex: item.z_index,
      pinned: item.pinned,
    })),
    exports:
      (exportRows ?? []).map((entry) => ({
        ...entry,
        png_url: getPublicFileUrl("memory-exports", entry.png_path),
        pdf_url: getPublicFileUrl("memory-exports", entry.pdf_path),
      })) ?? [],
  };

  return NextResponse.json(payload);
}
