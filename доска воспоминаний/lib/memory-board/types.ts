export type MemoryLayoutItemType = "photo" | "sticker" | "cassette";

export type DayEntryPayload = {
  boardId: string;
  date: string;
  mainEvent: string;
  description: string;
  photos: Array<{
    storagePath: string;
    takenAt: string | null;
    displayDate: string;
    isFeatured: boolean;
    boothGroup: string;
    sortOrder: number;
    width: number | null;
    height: number | null;
  }>;
  stickerIds: string[];
};

export type CassettePayload = {
  boardId: string;
  title: string;
  audioPath: string;
  x: number;
  y: number;
  rotation: number;
};

export type LayoutItem = {
  itemType: MemoryLayoutItemType;
  refId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  pinned: boolean;
};

export type MemoryBoard = {
  id: string;
  user_id: string;
  year: number;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type MemoryDayEntry = {
  id: string;
  board_id: string;
  date: string;
  main_event: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  photos: MemoryEntryPhoto[];
  sticker_ids: string[];
};

export type MemoryEntryPhoto = {
  id: string;
  entry_id: string;
  storage_path: string;
  url: string;
  taken_at: string | null;
  display_date: string;
  is_featured: boolean;
  booth_group: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
};

export type StickerCategory = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
};

export type Sticker = {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  image_path: string | null;
  image_url: string | null;
  color: string;
  category_id: string | null;
};

export type Cassette = {
  id: string;
  board_id: string;
  title: string;
  audio_path: string;
  audio_url: string;
  source_kind: "upload" | "link";
  duration_sec: number | null;
  cover_path: string | null;
  cover_url: string | null;
  x: number;
  y: number;
  rotation: number;
  z_index: number;
  created_at: string;
};

export type MemoryExport = {
  id: string;
  board_id: string;
  year: number;
  png_path: string;
  pdf_path: string;
  png_url: string;
  pdf_url: string;
  status: "queued" | "processing" | "completed" | "failed";
  created_at: string;
};

export type MemoryBoardState = {
  board: MemoryBoard;
  entries: MemoryDayEntry[];
  stickers: Sticker[];
  stickerCategories: StickerCategory[];
  cassettes: Cassette[];
  layoutItems: LayoutItem[];
  exports: MemoryExport[];
};
