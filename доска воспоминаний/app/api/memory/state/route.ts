import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getPublicFileUrl, getServiceClient } from "@/lib/memory-board/server";
import {
  STICKER_LIBRARY_CATEGORIES,
  STICKER_LIBRARY_STICKERS,
} from "@/lib/memory-board/sticker-library";
import type { MemoryBoardState, Sticker } from "@/lib/memory-board/types";

type StickerCategoryRow = {
  id: string;
  name: string;
  sort_order: number;
};

type StickerRow = {
  id: string;
  name: string;
  image_path: string | null;
  category_id: string | null;
  sort_order: number;
};

function isExternalUrl(value: string | null | undefined) {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

async function ensureDefaultStickers(userId: string) {
  const service = getServiceClient();

  const { data: rawCategories } = await service
    .from("sticker_categories")
    .select("id, name, sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  const categories = (rawCategories ?? []) as StickerCategoryRow[];
  const categoryIdByName = new Map<string, string>(
    categories.map((category) => [category.name, category.id]),
  );
  const categoryIdByKey = new Map<string, string | null>();

  let nextCategorySortOrder = categories.length;
  const categoriesToInsert = STICKER_LIBRARY_CATEGORIES
    .filter((category) => !categoryIdByName.has(category.name))
    .map((category) => ({
      user_id: userId,
      name: category.name,
      icon: category.icon,
      color: category.color,
      sort_order: nextCategorySortOrder++,
    }));

  if (categoriesToInsert.length > 0) {
    const { data: createdCategories } = await service
      .from("sticker_categories")
      .insert(categoriesToInsert)
      .select("id, name");

    for (const row of (createdCategories ?? []) as Array<{ id: string; name: string }>) {
      categoryIdByName.set(row.name, row.id);
    }
  }

  for (const category of STICKER_LIBRARY_CATEGORIES) {
    categoryIdByKey.set(category.key, categoryIdByName.get(category.name) ?? null);
  }

  const { data: rawStickers } = await service
    .from("stickers")
    .select("id, name, image_path, category_id, sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  const stickers = (rawStickers ?? []) as StickerRow[];
  const stickerByName = new Map<string, StickerRow>(
    stickers.map((sticker) => [sticker.name, sticker]),
  );

  let nextStickerSortOrder = stickers.length;
  const stickersToInsert: Array<{
    user_id: string;
    name: string;
    emoji: string;
    image_path: string;
    color: string;
    category_id: string | null;
    sort_order: number;
  }> = [];

  const stickersToUpdate: Array<{
    id: string;
    image_path: string;
    category_id: string | null;
  }> = [];

  for (const stickerPreset of STICKER_LIBRARY_STICKERS) {
    const categoryId = categoryIdByKey.get(stickerPreset.categoryKey) ?? null;
    const existingSticker = stickerByName.get(stickerPreset.name);

    if (!existingSticker) {
      stickersToInsert.push({
        user_id: userId,
        name: stickerPreset.name,
        emoji: stickerPreset.emoji,
        image_path: stickerPreset.imagePath,
        color: stickerPreset.color,
        category_id: categoryId,
        sort_order: nextStickerSortOrder++,
      });
      continue;
    }

    if (!existingSticker.image_path || !existingSticker.category_id) {
      stickersToUpdate.push({
        id: existingSticker.id,
        image_path: existingSticker.image_path || stickerPreset.imagePath,
        category_id: existingSticker.category_id || categoryId,
      });
    }
  }

  if (stickersToInsert.length > 0) {
    await service.from("stickers").insert(
      stickersToInsert.map((sticker) => ({
        user_id: sticker.user_id,
        name: sticker.name,
        emoji: sticker.emoji,
        image_path: sticker.image_path,
        color: sticker.color,
        category_id: sticker.category_id,
        sort_order: sticker.sort_order,
      })),
    );
  }

  if (stickersToUpdate.length > 0) {
    await Promise.all(
      stickersToUpdate.map((sticker) =>
        service
          .from("stickers")
          .update({
            image_path: sticker.image_path,
            category_id: sticker.category_id,
          })
          .eq("id", sticker.id)
          .eq("user_id", userId),
      ),
    );
  }
}

async function ensureDefaultStickersFallback(userId: string) {
  const service = getServiceClient();
  const { data: existing } = await service.from("stickers").select("id").eq("user_id", userId).limit(1);
  if (existing && existing.length > 0) return;

  const { data: category } = await service
    .from("sticker_categories")
    .insert({
      user_id: userId,
      name: "Милые",
      icon: "🎀",
      color: "#f59e0b",
      sort_order: 0,
    })
    .select("id")
    .single();

  const categoryId = category?.id ?? null;
  await service.from("stickers").insert(
    STICKER_LIBRARY_STICKERS.slice(0, 8).map((sticker, index) => ({
      user_id: userId,
      name: sticker.name,
      emoji: sticker.emoji,
      image_path: sticker.imagePath,
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

  const service = getServiceClient();

  await service.from("profiles").upsert({
    user_id: user.id,
    display_name: user.user_metadata?.display_name ?? null,
  });

  const { data: board, error: boardError } = await service
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

  try {
    await ensureDefaultStickers(user.id);
  } catch {
    await ensureDefaultStickersFallback(user.id);
  }

  const { data: entryRows } = await service
    .from("day_entries")
    .select("id, board_id, date, main_event, description, created_at, updated_at")
    .eq("board_id", board.id)
    .order("date", { ascending: true });

  const entryIds = (entryRows ?? []).map((row) => row.id);

  const [{ data: photoRows }, { data: entryStickerRows }, { data: stickerRows }, { data: categoryRows }, { data: cassetteRows }, { data: layoutRows }, { data: exportRows }] =
    await Promise.all([
      entryIds.length
        ? service
            .from("entry_photos")
            .select(
              "id, entry_id, storage_path, taken_at, display_date, is_featured, booth_group, sort_order, width, height",
            )
            .in("entry_id", entryIds)
            .order("sort_order", { ascending: true })
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      entryIds.length
        ? service.from("entry_stickers").select("entry_id, sticker_id").in("entry_id", entryIds)
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      service
        .from("stickers")
        .select("id, user_id, name, emoji, image_path, color, category_id, sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      service
        .from("sticker_categories")
        .select("id, user_id, name, icon, color, sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      service
        .from("cassettes")
        .select("id, board_id, title, audio_path, duration_sec, cover_path, x, y, rotation, z_index, created_at")
        .eq("board_id", board.id)
        .order("created_at", { ascending: true }),
      service
        .from("board_layout_items")
        .select("item_type, ref_id, x, y, rotation, scale, z_index, pinned")
        .eq("board_id", board.id),
      service
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
    image_url: sticker.image_path
      ? isExternalUrl(sticker.image_path)
        ? sticker.image_path
        : getPublicFileUrl("memory-stickers", sticker.image_path)
      : null,
  }));

  const payload: MemoryBoardState = {
    board,
    entries,
    stickers,
    stickerCategories: categoryRows ?? [],
    cassettes:
      (cassetteRows ?? []).map((cassette) => {
        const audio_url = isExternalUrl(cassette.audio_path)
          ? cassette.audio_path
          : getPublicFileUrl("memory-audio", cassette.audio_path);

        const cover_url = cassette.cover_path
          ? isExternalUrl(cassette.cover_path)
            ? cassette.cover_path
            : getPublicFileUrl("memory-photos", cassette.cover_path)
          : null;

        return {
          ...cassette,
          audio_url,
          source_kind: isExternalUrl(cassette.audio_path) ? ("link" as const) : ("upload" as const),
          cover_url,
        };
      }) ?? [],
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
