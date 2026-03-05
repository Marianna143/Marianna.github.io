"use client";

import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toPng } from "html-to-image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import exifr from "exifr";
import {
  buildPhotoboothPhotos,
  getEntryCoverPhoto,
  randomTilt,
  toIsoDate,
} from "@/lib/memory-board/helpers";
import { readBoardStateFromStore, writeBoardStateToStore } from "@/lib/memory-board/local-store";
import type {
  LayoutItem,
  MemoryBoardState,
  MemoryDayEntry,
  MemoryEntryPhoto,
  Sticker,
} from "@/lib/memory-board/types";

type PendingPhoto = {
  storagePath: string;
  url: string;
  takenAt: string | null;
  displayDate: string;
  isFeatured: boolean;
  boothGroup: string;
  sortOrder: number;
  width: number | null;
  height: number | null;
};

type BoardCard = {
  id: string;
  entry: MemoryDayEntry;
  cover: MemoryEntryPhoto;
  photos: MemoryEntryPhoto[];
};

type DraggableCardProps = {
  dragId: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  children: React.ReactNode;
};

type GarlandLine = {
  top: number;
  tilt: number;
  bulbs: number;
};

type StickerLayerMode = "over" | "under";

const FALLBACK_STICKER_COLORS = ["#34d399", "#22c55e", "#0ea5e9", "#10b981", "#ec4899"];
const BOOTH_FRAME_PRESETS = ["#fffdf8", "#fef3c7", "#d1fae5", "#cffafe", "#fee2e2", "#e9d5ff"];
const GARLAND_LINES: GarlandLine[] = [
  { top: 126, tilt: -4.5, bulbs: 30 },
  { top: 238, tilt: 3.5, bulbs: 28 },
  { top: 350, tilt: -5, bulbs: 30 },
  { top: 464, tilt: 2.6, bulbs: 26 },
];

const LOCAL_SESSION_KEY = "memory_local_session";
const LOCAL_BOARD_STORAGE_PREFIX = "memory-board-local-v2";
const LEGACY_LOCAL_STORAGE_PREFIX = "memory-board-local-v1";
const LOCAL_CATEGORY_ID = "local-category-main";
const STICKER_REF_SEPARATOR = "::";
const STICKER_LAYER_Z = {
  under: 22,
  over: 430,
} as const;

const BOARD_WIDTH = 3600;
const BOARD_MIN_HEIGHT = 2600;
const BOARD_COLUMNS = 14;
const PHOTO_GRID_X_STEP = 236;
const PHOTO_GRID_Y_STEP = 328;
const BOARD_PADDING_X = 90;
const BOARD_PADDING_TOP = 570;

function localId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function boardStorageKey(userId: string, year: number) {
  return `${LOCAL_BOARD_STORAGE_PREFIX}:${userId}:${year}`;
}

function legacyLocalStorageKey(userId: string, year: number) {
  return `${LEGACY_LOCAL_STORAGE_PREFIX}:${userId}:${year}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function createStickerLayoutRef(stickerId: string) {
  return `${stickerId}${STICKER_REF_SEPARATOR}${localId("sticker-instance")}`;
}

function parseStickerLayoutRef(refId: string) {
  const separatorIndex = refId.indexOf(STICKER_REF_SEPARATOR);

  if (separatorIndex === -1) {
    return { stickerId: refId, instanceId: null as string | null };
  }

  const stickerId = refId.slice(0, separatorIndex);
  const instanceId = refId.slice(separatorIndex + STICKER_REF_SEPARATOR.length) || null;

  return { stickerId, instanceId };
}

function parseDragIdentifier(rawId: string) {
  const divider = rawId.indexOf(":");
  if (divider === -1) {
    return null;
  }

  return {
    itemType: rawId.slice(0, divider) as LayoutItem["itemType"],
    refId: rawId.slice(divider + 1),
  };
}

function createEmptyLocalState(userId: string, selectedYear: number): MemoryBoardState {
  const now = new Date().toISOString();

  return {
    board: {
      id: `local-board-${userId}-${selectedYear}`,
      user_id: userId,
      year: selectedYear,
      title: `Мои воспоминания ${selectedYear}`,
      created_at: now,
      updated_at: now,
    },
    entries: [],
    stickerCategories: [
      {
        id: LOCAL_CATEGORY_ID,
        user_id: userId,
        name: "Изумрудные",
        icon: "🍀",
        color: "#34d399",
        sort_order: 0,
      },
    ],
    stickers: [
      {
        id: localId("sticker"),
        user_id: userId,
        name: "Сердечко",
        emoji: "💚",
        image_path: null,
        image_url: null,
        color: "#34d399",
        category_id: LOCAL_CATEGORY_ID,
      },
      {
        id: localId("sticker"),
        user_id: userId,
        name: "Звезда",
        emoji: "⭐",
        image_path: null,
        image_url: null,
        color: "#6ee7b7",
        category_id: LOCAL_CATEGORY_ID,
      },
      {
        id: localId("sticker"),
        user_id: userId,
        name: "Тепло",
        emoji: "🕯️",
        image_path: null,
        image_url: null,
        color: "#2dd4bf",
        category_id: LOCAL_CATEGORY_ID,
      },
      {
        id: localId("sticker"),
        user_id: userId,
        name: "Смех",
        emoji: "😂",
        image_path: null,
        image_url: null,
        color: "#22c55e",
        category_id: LOCAL_CATEGORY_ID,
      },
      {
        id: localId("sticker"),
        user_id: userId,
        name: "Мечта",
        emoji: "☁️",
        image_path: null,
        image_url: null,
        color: "#38bdf8",
        category_id: LOCAL_CATEGORY_ID,
      },
    ],
    cassettes: [],
    layoutItems: [],
    exports: [],
  };
}

function readLegacyLocalState(userId: string, selectedYear: number): MemoryBoardState | null {
  const key = legacyLocalStorageKey(userId, selectedYear);
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as MemoryBoardState;
    if (!parsed?.board?.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Не удалось обработать изображение"));
    image.src = dataUrl;
  });
}

async function optimizeImageForBoard(file: File) {
  const sourceDataUrl = await fileToDataUrl(file);

  if (!file.type.startsWith("image/")) {
    return {
      dataUrl: sourceDataUrl,
      width: null,
      height: null,
    };
  }

  try {
    const image = await loadImageFromDataUrl(sourceDataUrl);
    const maxSide = 2048;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));

    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      return {
        dataUrl: sourceDataUrl,
        width: image.width,
        height: image.height,
      };
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const isPng = file.type === "image/png";
    const mimeType = isPng ? "image/png" : "image/jpeg";
    const quality = isPng ? undefined : 0.86;

    return {
      dataUrl: canvas.toDataURL(mimeType, quality),
      width: targetWidth,
      height: targetHeight,
    };
  } catch {
    return {
      dataUrl: sourceDataUrl,
      width: null,
      height: null,
    };
  }
}

async function optimizeStickerAsset(file: File) {
  const sourceDataUrl = await fileToDataUrl(file);

  if (!file.type.startsWith("image/")) {
    return {
      dataUrl: sourceDataUrl,
      width: null,
      height: null,
    };
  }

  try {
    const image = await loadImageFromDataUrl(sourceDataUrl);
    const maxSide = 720;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));

    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return {
        dataUrl: sourceDataUrl,
        width: image.width,
        height: image.height,
      };
    }

    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const mimeType = file.type === "image/webp" ? "image/webp" : "image/png";

    return {
      dataUrl: canvas.toDataURL(mimeType, 0.97),
      width: targetWidth,
      height: targetHeight,
    };
  } catch {
    return {
      dataUrl: sourceDataUrl,
      width: null,
      height: null,
    };
  }
}

function decodeDataUrl(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) {
    throw new Error("Invalid data URL");
  }

  const base64 = dataUrl.slice(comma + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function downloadBytes(filename: string, bytes: Uint8Array, mimeType: string) {
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function DraggableCard({ dragId, x, y, rotation, zIndex, children }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId });

  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    zIndex: isDragging ? 999 : zIndex,
    transform: `${CSS.Translate.toString(transform)} rotate(${rotation}deg)`,
    touchAction: "none",
    cursor: isDragging ? "grabbing" : "grab",
    transition: isDragging
      ? "none"
      : "left 0.22s cubic-bezier(0.2, 0.72, 0.12, 1), top 0.22s cubic-bezier(0.2, 0.72, 0.12, 1)",
    willChange: isDragging ? "transform" : "left, top",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export default function MemoryBoardLocalApp({ userId, userEmail }: { userId: string; userEmail: string }) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const stickerImageInputRef = useRef<HTMLInputElement | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<MemoryBoardState | null>(null);

  const [entryDate, setEntryDate] = useState(toIsoDate(new Date()));
  const [mainEvent, setMainEvent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [boothFrameColor, setBoothFrameColor] = useState(BOOTH_FRAME_PRESETS[0]);
  const [savingEntry, setSavingEntry] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("🍀");
  const [newCategoryColor, setNewCategoryColor] = useState("#34d399");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newStickerName, setNewStickerName] = useState("");
  const [newStickerEmoji, setNewStickerEmoji] = useState("✨");
  const [newStickerColor, setNewStickerColor] = useState(FALLBACK_STICKER_COLORS[0]);
  const [newStickerCategoryId, setNewStickerCategoryId] = useState<string>(LOCAL_CATEGORY_ID);
  const [stickerLayerMode, setStickerLayerMode] = useState<StickerLayerMode>("over");
  const [creatingSticker, setCreatingSticker] = useState(false);
  const [importingStickers, setImportingStickers] = useState(false);

  const [cassetteTitle, setCassetteTitle] = useState("");
  const [savingCassette, setSavingCassette] = useState(false);

  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [savingLayout, setSavingLayout] = useState(false);

  const [modalEntry, setModalEntry] = useState<MemoryDayEntry | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  const [exporting, setExporting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const persistState = useCallback(
    (nextState: MemoryBoardState) => {
      setState(nextState);
      setLayoutItems(nextState.layoutItems);

      void writeBoardStateToStore(boardStorageKey(userId, nextState.board.year), nextState).catch(() => {
        setError("Не удалось сохранить локальные данные доски");
      });
    },
    [userId],
  );

  const fetchState = useCallback(
    async (selectedYear: number) => {
      setLoading(true);
      setError(null);

      try {
        const key = boardStorageKey(userId, selectedYear);
        const stored = await readBoardStateFromStore(key);

        if (stored?.board?.id) {
          setState(stored);
          setLayoutItems(stored.layoutItems);
          return;
        }

        const legacy = readLegacyLocalState(userId, selectedYear);
        if (legacy) {
          localStorage.removeItem(legacyLocalStorageKey(userId, selectedYear));
          await writeBoardStateToStore(key, legacy);
          setState(legacy);
          setLayoutItems(legacy.layoutItems);
          return;
        }

        const empty = createEmptyLocalState(userId, selectedYear);
        await writeBoardStateToStore(key, empty);
        setState(empty);
        setLayoutItems(empty.layoutItems);
      } catch {
        setError("Не удалось загрузить локальные данные доски");
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    void fetchState(year);
  }, [fetchState, year]);

  const cards = useMemo<BoardCard[]>(() => {
    if (!state) return [];

    return state.entries
      .map((entry) => {
        const cover = getEntryCoverPhoto(entry);
        if (!cover) return null;
        return {
          id: entry.id,
          entry,
          cover,
          photos: buildPhotoboothPhotos(entry),
        };
      })
      .filter((item): item is BoardCard => item !== null)
      .sort((a, b) => (a.entry.date > b.entry.date ? 1 : -1));
  }, [state]);

  const stickersById = useMemo(() => {
    const map = new Map<string, Sticker>();
    state?.stickers.forEach((sticker) => {
      map.set(sticker.id, sticker);
    });
    return map;
  }, [state]);

  const boardDimensions = useMemo(() => {
    const rows = Math.ceil((Math.max(cards.length, 1) + 10) / BOARD_COLUMNS);
    const autoGridHeight = BOARD_PADDING_TOP + rows * PHOTO_GRID_Y_STEP + 420;
    const maxLayoutY =
      layoutItems.reduce((max, item) => Math.max(max, item.y), 0) + 560;

    return {
      width: BOARD_WIDTH,
      height: Math.max(BOARD_MIN_HEIGHT, autoGridHeight, maxLayoutY),
    };
  }, [cards.length, layoutItems]);

  const layoutByKey = useMemo(() => {
    const map = new Map<string, LayoutItem>();
    layoutItems.forEach((item) => {
      map.set(`${item.itemType}:${item.refId}`, item);
    });

    cards.forEach((card, index) => {
      const key = `photo:${card.entry.id}`;
      if (!map.has(key)) {
        const row = Math.floor(index / BOARD_COLUMNS);
        const col = index % BOARD_COLUMNS;
        map.set(key, {
          itemType: "photo",
          refId: card.entry.id,
          x: BOARD_PADDING_X + col * PHOTO_GRID_X_STEP,
          y: BOARD_PADDING_TOP + row * PHOTO_GRID_Y_STEP,
          rotation: randomTilt(card.entry.id),
          scale: 1,
          zIndex: 40 + index,
          pinned: true,
        });
      }
    });

    state?.cassettes.forEach((cassette, index) => {
      const key = `cassette:${cassette.id}`;
      if (!map.has(key)) {
        map.set(key, {
          itemType: "cassette",
          refId: cassette.id,
          x: cassette.x ?? 120 + index * 180,
          y: cassette.y ?? boardDimensions.height - 240,
          rotation: cassette.rotation ?? randomTilt(cassette.id),
          scale: 1,
          zIndex: cassette.z_index || 300,
          pinned: true,
        });
      }
    });

    return map;
  }, [boardDimensions.height, cards, layoutItems, state]);

  async function uploadPhoto(file: File): Promise<PendingPhoto> {
    const buffer = await file.arrayBuffer();
    const metadata = await exifr.parse(buffer, {
      pick: ["DateTimeOriginal", "CreateDate", "ModifyDate", "ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight"],
    });

    const takenDate = metadata?.DateTimeOriginal ?? metadata?.CreateDate ?? metadata?.ModifyDate ?? null;
    const takenAt = takenDate instanceof Date ? takenDate.toISOString() : null;

    const defaultDate = takenAt ? takenAt.slice(0, 10) : entryDate;
    const optimized = await optimizeImageForBoard(file);

    return {
      storagePath: localId("photo"),
      url: optimized.dataUrl,
      takenAt,
      displayDate: defaultDate,
      isFeatured: false,
      boothGroup: `${entryDate}-booth`,
      sortOrder: 0,
      width: metadata?.ExifImageWidth ?? metadata?.ImageWidth ?? optimized.width ?? null,
      height: metadata?.ExifImageHeight ?? metadata?.ImageHeight ?? optimized.height ?? null,
    };
  }

  async function handlePhotoInput(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;

    const files = Array.from(event.target.files);

    try {
      const uploaded = await Promise.all(files.map(uploadPhoto));
      setPendingPhotos((prev) => {
        const combined = [...prev, ...uploaded].map((photo, index) => ({
          ...photo,
          sortOrder: index,
          isFeatured: index === 0,
        }));

        return combined;
      });
    } catch (uploadError) {
      const text = uploadError instanceof Error ? uploadError.message : "Ошибка загрузки фото";
      setError(text);
    } finally {
      event.target.value = "";
    }
  }

  function removePendingPhoto(index: number) {
    setPendingPhotos((prev) => {
      const next = prev.filter((_, currentIndex) => currentIndex !== index).map((photo, nextIndex) => ({
        ...photo,
        sortOrder: nextIndex,
        isFeatured: nextIndex === 0,
      }));

      return next;
    });
  }

  async function saveDayEntry() {
    if (!state) return;

    setSavingEntry(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const existing = state.entries.find((entry) => entry.date === entryDate);
      const entryId = existing?.id ?? localId("entry");

      const nextPhotos = pendingPhotos.map((photo, index) => ({
        id: localId("photo-item"),
        entry_id: entryId,
        storage_path: photo.storagePath,
        url: photo.url,
        taken_at: photo.takenAt,
        display_date: photo.displayDate,
        is_featured: photo.isFeatured || index === 0,
        booth_group: photo.boothGroup,
        sort_order: (existing?.photos.length ?? 0) + index,
        width: photo.width,
        height: photo.height,
      }));

      const mergedPhotos = [...(existing?.photos ?? []), ...nextPhotos]
        .map((photo, index) => ({
          ...photo,
          sort_order: index,
        }))
        .map((photo, index) => ({
          ...photo,
          is_featured: index === 0,
        }));

      const mergedStickerIds = selectedStickerIds.length
        ? selectedStickerIds
        : existing?.sticker_ids ?? [];

      const nextEntry: MemoryDayEntry = {
        id: entryId,
        board_id: state.board.id,
        date: entryDate,
        main_event: mainEvent || existing?.main_event || null,
        description: description || existing?.description || null,
        booth_frame_color: boothFrameColor,
        created_at: existing?.created_at ?? now,
        updated_at: now,
        photos: mergedPhotos,
        sticker_ids: mergedStickerIds,
      };

      const entriesWithoutDay = state.entries.filter((entry) => entry.id !== entryId);
      const nextEntries = [...entriesWithoutDay, nextEntry].sort((a, b) => (a.date > b.date ? 1 : -1));

      const hasLayout = state.layoutItems.some(
        (item) => item.itemType === "photo" && item.refId === entryId,
      );

      let nextLayout = state.layoutItems;
      if (!hasLayout) {
        const photoLayoutCount = state.layoutItems.filter((item) => item.itemType === "photo").length;
        const col = photoLayoutCount % BOARD_COLUMNS;
        const row = Math.floor(photoLayoutCount / BOARD_COLUMNS);

        nextLayout = [
          ...state.layoutItems,
          {
            itemType: "photo",
            refId: entryId,
            x: BOARD_PADDING_X + col * PHOTO_GRID_X_STEP,
            y: BOARD_PADDING_TOP + row * PHOTO_GRID_Y_STEP,
            rotation: randomTilt(entryId),
            scale: 1,
            zIndex: 40 + photoLayoutCount,
            pinned: true,
          },
        ];
      }

      persistState({
        ...state,
        board: {
          ...state.board,
          updated_at: now,
        },
        entries: nextEntries,
        layoutItems: nextLayout,
      });

      setMainEvent("");
      setDescription("");
      setPendingPhotos([]);
      setSelectedStickerIds([]);
      setBoothFrameColor(BOOTH_FRAME_PRESETS[0]);
    } catch (saveError) {
      const text = saveError instanceof Error ? saveError.message : "Ошибка сохранения";
      setError(text);
    } finally {
      setSavingEntry(false);
    }
  }

  function deleteDayEntry(entryId: string) {
    if (!state) return;

    const now = new Date().toISOString();
    const nextEntries = state.entries.filter((entry) => entry.id !== entryId);
    const nextLayout = state.layoutItems.filter((item) => !(item.itemType === "photo" && item.refId === entryId));

    persistState({
      ...state,
      board: {
        ...state.board,
        updated_at: now,
      },
      entries: nextEntries,
      layoutItems: nextLayout,
    });

    if (modalEntry?.id === entryId) {
      setModalEntry(null);
      setModalPhotoIndex(0);
    }
  }

  function deletePhotoFromEntry(entryId: string, photoId: string) {
    if (!state) return;

    const entry = state.entries.find((item) => item.id === entryId);
    if (!entry) return;

    const filteredPhotos = entry.photos.filter((photo) => photo.id !== photoId);
    if (!filteredPhotos.length) {
      deleteDayEntry(entryId);
      return;
    }

    const fixedPhotos = filteredPhotos.map((photo, index) => ({
      ...photo,
      sort_order: index,
      is_featured: index === 0,
    }));

    const now = new Date().toISOString();
    const nextEntries = state.entries
      .map((item) =>
        item.id === entryId
          ? {
              ...item,
              photos: fixedPhotos,
              updated_at: now,
            }
          : item,
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    persistState({
      ...state,
      board: {
        ...state.board,
        updated_at: now,
      },
      entries: nextEntries,
    });

    if (modalEntry?.id === entryId) {
      const nextModalEntry = nextEntries.find((item) => item.id === entryId) ?? null;
      setModalEntry(nextModalEntry);
      setModalPhotoIndex((prev) => Math.min(prev, fixedPhotos.length - 1));
    }
  }

  async function createStickerCategory() {
    if (!state || !newCategoryName.trim()) return;

    setCreatingCategory(true);

    try {
      const nextCategory = {
        id: localId("sticker-category"),
        user_id: userId,
        name: newCategoryName.trim(),
        icon: newCategoryIcon || "🍀",
        color: newCategoryColor,
        sort_order: state.stickerCategories.length,
      };

      persistState({
        ...state,
        stickerCategories: [...state.stickerCategories, nextCategory],
      });

      setNewCategoryName("");
      setNewStickerCategoryId(nextCategory.id);
    } catch (categoryError) {
      const text = categoryError instanceof Error ? categoryError.message : "Ошибка категории";
      setError(text);
    } finally {
      setCreatingCategory(false);
    }
  }

  async function createSticker() {
    if (!state || !newStickerName.trim()) return;

    setCreatingSticker(true);

    try {
      const uploadedFile = stickerImageInputRef.current?.files?.[0] ?? null;
      const optimizedAsset = uploadedFile ? await optimizeStickerAsset(uploadedFile) : null;
      const imageUrl = optimizedAsset?.dataUrl ?? null;

      const nextSticker = {
        id: localId("sticker"),
        user_id: userId,
        name: newStickerName.trim(),
        emoji: imageUrl ? "" : newStickerEmoji || "✨",
        image_path: imageUrl ? localId("sticker-image") : null,
        image_url: imageUrl,
        color: newStickerColor,
        category_id: newStickerCategoryId || null,
      };

      persistState({
        ...state,
        stickers: [...state.stickers, nextSticker],
      });

      setNewStickerName("");
      setNewStickerEmoji("✨");

      if (stickerImageInputRef.current) {
        stickerImageInputRef.current.value = "";
      }
    } catch (stickerError) {
      const text = stickerError instanceof Error ? stickerError.message : "Ошибка стикера";
      setError(text);
    } finally {
      setCreatingSticker(false);
    }
  }

  async function importStickerPack(event: React.ChangeEvent<HTMLInputElement>) {
    if (!state || !event.target.files?.length) return;

    setImportingStickers(true);
    setError(null);

    try {
      const files = Array.from(event.target.files).filter((file) => file.type.startsWith("image/"));

      if (!files.length) {
        throw new Error("Выберите PNG или WEBP стикеры");
      }

      const importedStickers = await Promise.all(
        files.map(async (file, index) => {
          const optimizedAsset = await optimizeStickerAsset(file);
          const normalizedName = file.name.replace(/\.[^.]+$/, "").replace(/[\-_]+/g, " ").trim();

          return {
            id: localId("sticker"),
            user_id: userId,
            name: normalizedName || `Sticker ${state.stickers.length + index + 1}`,
            emoji: "",
            image_path: localId("sticker-image"),
            image_url: optimizedAsset.dataUrl,
            color: "#ffffff",
            category_id: newStickerCategoryId || null,
          };
        }),
      );

      persistState({
        ...state,
        stickers: [...state.stickers, ...importedStickers],
      });
    } catch (importError) {
      const text = importError instanceof Error ? importError.message : "Не удалось импортировать стикеры";
      setError(text);
    } finally {
      setImportingStickers(false);
      event.target.value = "";
    }
  }

  function addStickerToBoard(stickerId: string) {
    const layerZIndex = stickerLayerMode === "under" ? STICKER_LAYER_Z.under : STICKER_LAYER_Z.over;

    upsertLocalLayout({
      itemType: "sticker",
      refId: createStickerLayoutRef(stickerId),
      x: 80 + Math.round(Math.random() * (boardDimensions.width - 420)),
      y: Math.round(520 + Math.random() * Math.max(240, boardDimensions.height - 820)),
      rotation: randomTilt(`${stickerId}-${Date.now()}`),
      scale: 1,
      zIndex: layerZIndex,
      pinned: true,
    });
  }

  function removeStickerFromBoard(layoutRefId: string) {
    const nextItems = layoutItems.filter((item) => !(item.itemType === "sticker" && item.refId === layoutRefId));
    saveLayout(nextItems);
  }

  function toggleStickerLayer(layoutRefId: string) {
    const layoutItem = layoutItems.find((item) => item.itemType === "sticker" && item.refId === layoutRefId);
    if (!layoutItem) return;

    const nextLayer = layoutItem.zIndex <= STICKER_LAYER_Z.under + 12 ? STICKER_LAYER_Z.over : STICKER_LAYER_Z.under;

    upsertLocalLayout({
      ...layoutItem,
      zIndex: nextLayer,
    });
  }

  async function createCassette(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    const input = event.currentTarget.elements.namedItem("audio") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file || !cassetteTitle.trim()) return;

    setSavingCassette(true);

    try {
      const audioUrl = await fileToDataUrl(file);
      const now = new Date().toISOString();

      const cassette = {
        id: localId("cassette"),
        board_id: state.board.id,
        title: cassetteTitle.trim(),
        audio_path: localId("audio"),
        audio_url: audioUrl,
        duration_sec: null,
        cover_path: null,
        x: 160,
        y: boardDimensions.height - 220,
        rotation: randomTilt(cassetteTitle),
        z_index: 320 + state.cassettes.length,
        created_at: now,
      };

      const nextLayout = [
        ...state.layoutItems,
        {
          itemType: "cassette" as const,
          refId: cassette.id,
          x: cassette.x,
          y: cassette.y,
          rotation: cassette.rotation,
          scale: 1,
          zIndex: cassette.z_index,
          pinned: true,
        },
      ];

      persistState({
        ...state,
        cassettes: [...state.cassettes, cassette],
        layoutItems: nextLayout,
      });

      setCassetteTitle("");
      if (input) input.value = "";
    } catch (cassetteError) {
      const text = cassetteError instanceof Error ? cassetteError.message : "Ошибка кассеты";
      setError(text);
    } finally {
      setSavingCassette(false);
    }
  }

  function saveLayout(nextItems: LayoutItem[]) {
    if (!state) return;

    setSavingLayout(true);
    persistState({
      ...state,
      layoutItems: nextItems,
    });

    window.setTimeout(() => {
      setSavingLayout(false);
    }, 240);
  }

  function upsertLocalLayout(nextItem: LayoutItem) {
    setLayoutItems((prev) => {
      const without = prev.filter(
        (item) => !(item.itemType === nextItem.itemType && item.refId === nextItem.refId),
      );
      const next = [...without, nextItem];
      saveLayout(next);
      return next;
    });
  }

  function autoArrangePhotoCards() {
    if (!state) return;

    const preserved = layoutItems.filter((item) => item.itemType !== "photo");
    const photoLayouts = cards.map((card, index) => {
      const row = Math.floor(index / BOARD_COLUMNS);
      const col = index % BOARD_COLUMNS;
      const previous = layoutByKey.get(`photo:${card.entry.id}`);

      return {
        itemType: "photo" as const,
        refId: card.entry.id,
        x: BOARD_PADDING_X + col * PHOTO_GRID_X_STEP,
        y: BOARD_PADDING_TOP + row * PHOTO_GRID_Y_STEP,
        rotation: previous?.rotation ?? randomTilt(card.entry.id),
        scale: 1,
        zIndex: 40 + index,
        pinned: true,
      };
    });

    saveLayout([...preserved, ...photoLayouts]);
  }

  function onDragEnd(event: DragEndEvent) {
    if (!state || (!event.delta.x && !event.delta.y)) return;

    const rawId = String(event.active.id);
    const parsedId = parseDragIdentifier(rawId);
    if (!parsedId) return;

    const { itemType, refId } = parsedId;
    const prev = layoutByKey.get(rawId);
    if (!prev) return;

    const maxXByType =
      itemType === "cassette"
        ? boardDimensions.width - 300
        : itemType === "sticker"
          ? boardDimensions.width - 130
          : boardDimensions.width - 220;

    const maxYByType =
      itemType === "cassette"
        ? boardDimensions.height - 130
        : itemType === "sticker"
          ? boardDimensions.height - 130
          : boardDimensions.height - 290;

    const updated: LayoutItem = {
      ...prev,
      itemType,
      refId,
      x: clamp(Math.round(prev.x + event.delta.x), 0, maxXByType),
      y: clamp(Math.round(prev.y + event.delta.y), 0, maxYByType),
    };

    upsertLocalLayout(updated);
  }

  async function triggerExport() {
    if (!state || !boardRef.current) return;

    setExporting(true);
    setError(null);

    try {
      const pngDataUrl = await toPng(boardRef.current, {
        cacheBust: true,
        backgroundColor: "#24180f",
        pixelRatio: 2,
      });

      downloadDataUrl(`memory-board-${year}.png`, pngDataUrl);

      const { PDFDocument } = await import("pdf-lib");
      const pngBytes = decodeDataUrl(pngDataUrl);
      const pdf = await PDFDocument.create();
      const pngImage = await pdf.embedPng(pngBytes);

      const pageWidth = 1190.55;
      const pageHeight = 841.89;
      const page = pdf.addPage([pageWidth, pageHeight]);

      const imageRatio = pngImage.width / pngImage.height;
      const pageRatio = pageWidth / pageHeight;

      let drawWidth = pageWidth;
      let drawHeight = pageHeight;

      if (imageRatio > pageRatio) {
        drawHeight = pageWidth / imageRatio;
      } else {
        drawWidth = pageHeight * imageRatio;
      }

      page.drawImage(pngImage, {
        x: (pageWidth - drawWidth) / 2,
        y: (pageHeight - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });

      const pdfBytes = await pdf.save();
      downloadBytes(`memory-board-${year}.pdf`, pdfBytes, "application/pdf");
    } catch (exportError) {
      const text = exportError instanceof Error ? exportError.message : "Ошибка экспорта";
      setError(text);
    } finally {
      setExporting(false);
    }
  }

  async function signOut() {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    document.cookie = "memory_local_session=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/dnewnik-cork-7g4m/auth";
  }

  if (loading || !state) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#130b07] text-amber-100">
        Загрузка доски воспоминаний...
      </main>
    );
  }

  const selectedPhoto = modalEntry ? modalEntry.photos[modalPhotoIndex] : null;

  return (
    <main className="min-h-screen bg-[#0f0806] text-amber-50">
      <div className="mx-auto grid max-w-[2100px] gap-4 px-4 pb-10 pt-6 xl:grid-cols-[380px_1fr]">
        <aside className="rounded-2xl border border-emerald-700/25 bg-[#10231f]/90 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/65">Личный кабинет</p>
              <p className="text-sm text-emerald-100/95">{userEmail}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-emerald-300/55">Локальный режим</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs hover:bg-emerald-500/20"
            >
              Выйти
            </button>
          </div>

          <p className="mb-4 rounded-xl border border-emerald-500/20 bg-black/30 p-3 text-xs text-emerald-100/85">
            Сейчас данные хранятся только локально. Для синхронизации ноутбук + телефон нужен облачный режим (Supabase).
          </p>

          <div className="mb-4 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
            <label className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">Год доски</label>
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(Number(event.target.value || new Date().getFullYear()))}
              className="mt-2 w-full rounded-lg border border-emerald-700/50 bg-[#041914] px-3 py-2 outline-none focus:border-emerald-400"
            />
          </div>

          <section className="space-y-3 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
            <h2 className="text-lg font-semibold text-emerald-100">Запись дня</h2>
            <input
              type="date"
              value={entryDate}
              onChange={(event) => setEntryDate(event.target.value)}
              className="w-full rounded-lg border border-emerald-700/50 bg-[#041914] px-3 py-2 outline-none focus:border-emerald-400"
            />
            <input
              type="text"
              value={mainEvent}
              onChange={(event) => setMainEvent(event.target.value)}
              placeholder="Главное событие дня"
              className="w-full rounded-lg border border-emerald-700/50 bg-[#041914] px-3 py-2 outline-none focus:border-emerald-400"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Короткая подпись к дню"
              rows={3}
              className="w-full rounded-lg border border-emerald-700/50 bg-[#041914] px-3 py-2 outline-none focus:border-emerald-400"
            />

            <label className="block rounded-lg border border-dashed border-emerald-600/50 px-3 py-2 text-sm text-emerald-200/80 hover:bg-emerald-500/10">
              Загрузить фото (дата подтянется из EXIF)
              <input type="file" accept="image/*" multiple onChange={handlePhotoInput} className="mt-2 block w-full text-xs" />
            </label>

            <div className="rounded-lg border border-emerald-600/30 bg-black/25 p-2">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-300/70">Рамка фотобудки</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={boothFrameColor}
                  onChange={(event) => setBoothFrameColor(event.target.value)}
                  className="h-8 w-10 rounded border border-emerald-700/50 bg-[#041914]"
                />
                <div className="flex flex-wrap gap-1">
                  {BOOTH_FRAME_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBoothFrameColor(color)}
                      className={`h-6 w-6 rounded border ${boothFrameColor === color ? "border-emerald-200" : "border-emerald-700/40"}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Цвет рамки ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {pendingPhotos.length ? (
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {pendingPhotos.map((photo, index) => (
                  <div key={`${photo.storagePath}-${index}`} className="rounded-lg border border-emerald-700/40 bg-black/25 p-2">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <img src={photo.url} alt="preview" className="h-20 w-full rounded-md object-cover" />
                      <button
                        type="button"
                        onClick={() => removePendingPhoto(index)}
                        className="rounded border border-rose-300/40 bg-rose-900/35 px-2 py-1 text-xs text-rose-100 hover:bg-rose-900/55"
                      >
                        Удалить
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs text-emerald-100/80">
                        Дата кадра
                        <input
                          type="date"
                          value={photo.displayDate}
                          onChange={(event) =>
                            setPendingPhotos((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      displayDate: event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }
                          className="mt-1 w-full rounded-md border border-emerald-700/40 bg-[#05201a] px-2 py-1 text-xs"
                        />
                      </label>

                      <label className="text-xs text-emerald-100/80">
                        Группа фотобудки
                        <input
                          type="text"
                          value={photo.boothGroup}
                          onChange={(event) =>
                            setPendingPhotos((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      boothGroup: event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }
                          className="mt-1 w-full rounded-md border border-emerald-700/40 bg-[#05201a] px-2 py-1 text-xs"
                        />
                      </label>
                    </div>

                    <label className="mt-2 flex items-center gap-2 text-xs text-emerald-100/80">
                      <input
                        type="checkbox"
                        checked={photo.isFeatured}
                        onChange={() =>
                          setPendingPhotos((prev) =>
                            prev.map((item, i) => ({
                              ...item,
                              isFeatured: i === index,
                            })),
                          )
                        }
                      />
                      Основное фото дня
                    </label>
                  </div>
                ))}
              </div>
            ) : null}

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-emerald-300/70">Стикеры дня</p>
              <div className="flex flex-wrap gap-2">
                {state.stickers.map((sticker) => {
                  const checked = selectedStickerIds.includes(sticker.id);
                  return (
                    <button
                      key={sticker.id}
                      type="button"
                      onClick={() =>
                        setSelectedStickerIds((prev) =>
                          checked ? prev.filter((id) => id !== sticker.id) : [...prev, sticker.id],
                        )
                      }
                      className={`rounded-lg border px-2 py-1 text-xs ${
                        checked
                          ? "border-emerald-300 bg-emerald-500/30"
                          : "border-emerald-700/50 bg-black/25 hover:bg-emerald-500/20"
                      }`}
                    >
                      {sticker.image_url ? (
                        <img src={sticker.image_url} alt={sticker.name} className="mr-1 inline-block h-5 w-5 object-contain" />
                      ) : (
                        <span className="mr-1">{sticker.emoji || "✨"}</span>
                      )}
                      {sticker.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={saveDayEntry}
              disabled={savingEntry}
              className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {savingEntry ? "Сохраняю..." : "Сохранить день"}
            </button>
          </section>

          <section className="mt-4 space-y-2 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
            <h2 className="text-base font-semibold text-emerald-100">Новые стикеры</h2>
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Категория"
              className="w-full rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                value={newCategoryIcon}
                onChange={(event) => setNewCategoryIcon(event.target.value)}
                placeholder="Иконка"
                className="rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-sm"
              />
              <input
                value={newCategoryColor}
                onChange={(event) => setNewCategoryColor(event.target.value)}
                type="color"
                className="h-9 rounded-md border border-emerald-700/50 bg-[#041914] px-1"
              />
              <button
                type="button"
                onClick={createStickerCategory}
                disabled={creatingCategory}
                className="rounded-md border border-emerald-500/50 px-2 py-1 text-xs hover:bg-emerald-500/20 disabled:opacity-60"
              >
                + категория
              </button>
            </div>

            <input
              value={newStickerName}
              onChange={(event) => setNewStickerName(event.target.value)}
              placeholder="Название стикера"
              className="w-full rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                value={newStickerEmoji}
                onChange={(event) => setNewStickerEmoji(event.target.value)}
                placeholder="Эмодзи"
                className="rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-sm"
              />
              <input
                value={newStickerColor}
                onChange={(event) => setNewStickerColor(event.target.value)}
                type="color"
                className="h-9 rounded-md border border-emerald-700/50 bg-[#041914] px-1"
              />
              <select
                value={newStickerCategoryId}
                onChange={(event) => setNewStickerCategoryId(event.target.value)}
                className="rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-xs"
              >
                <option value="">Без категории</option>
                {state.stickerCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="block text-xs text-emerald-100/80">
              Прозрачный стикер (PNG/WEBP)
              <input
                ref={stickerImageInputRef}
                type="file"
                accept="image/png,image/webp,image/jpeg"
                className="mt-1 block w-full text-xs"
              />
            </label>

            <button
              type="button"
              onClick={createSticker}
              disabled={creatingSticker}
              className="w-full rounded-md border border-emerald-500/50 px-2 py-1.5 text-sm hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {creatingSticker ? "Создаю..." : "Создать стикер"}
            </button>

            <label className="block text-xs text-emerald-100/80">
              Импорт пакета Telegram (несколько PNG/WEBP)
              <input
                type="file"
                accept="image/png,image/webp,image/jpeg"
                multiple
                onChange={importStickerPack}
                className="mt-1 block w-full text-xs"
              />
            </label>

            {importingStickers ? <p className="text-xs text-emerald-100/75">Импортирую стикеры...</p> : null}
          </section>

          <section className="mt-4 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
            <h2 className="mb-2 text-base font-semibold text-emerald-100">Кассета</h2>
            <form onSubmit={createCassette} className="space-y-2">
              <input
                value={cassetteTitle}
                onChange={(event) => setCassetteTitle(event.target.value)}
                placeholder="Название трека"
                className="w-full rounded-md border border-emerald-700/50 bg-[#041914] px-2 py-1.5 text-sm"
              />
              <input name="audio" type="file" accept="audio/*" className="w-full text-xs" />
              <button
                type="submit"
                disabled={savingCassette}
                className="w-full rounded-md border border-emerald-500/50 px-2 py-1.5 text-sm hover:bg-emerald-500/20 disabled:opacity-60"
              >
                {savingCassette ? "Загружаю..." : "Добавить кассету"}
              </button>
            </form>
          </section>

          <section className="mt-4 space-y-2 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
            <button
              type="button"
              onClick={autoArrangePhotoCards}
              className="w-full rounded-lg border border-emerald-400/60 px-3 py-2 text-sm font-medium hover:bg-emerald-500/20"
            >
              Плавно выровнять фото
            </button>

            <button
              type="button"
              onClick={triggerExport}
              disabled={exporting}
              className="w-full rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-300 disabled:opacity-60"
            >
              {exporting ? "Формирую PNG + PDF..." : "Экспортировать доску"}
            </button>
          </section>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {savingLayout ? <p className="mt-2 text-xs text-emerald-200/70">Сохраняю раскладку...</p> : null}
        </aside>

        <section className="min-h-[80vh] rounded-2xl border border-emerald-700/30 bg-[#071814] p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">Пробковая стена · большой формат · ~300 фото</p>
            <p className="text-xs text-emerald-100/70">Скролль доску в стороны и вниз</p>
          </div>

          <div className="overflow-auto rounded-2xl border border-emerald-700/25 bg-[#050e0b] p-4">
            <div ref={boardRef} className="relative rounded-[30px] bg-[#7f5a3b] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.45)]" style={{ width: `${boardDimensions.width}px` }}>
              <div className="pointer-events-none absolute inset-1 rounded-[28px] border-[18px] border-[#9a6f4a] shadow-[inset_0_0_0_2px_rgba(58,34,19,0.45)]" />

              <div
                className="relative overflow-hidden rounded-[16px] border border-[#d7b796]/30"
                style={{
                  minHeight: `${boardDimensions.height}px`,
                  backgroundColor: "#9b6d43",
                  backgroundImage:
                    "radial-gradient(circle at 12% 18%, rgba(255,226,182,0.26) 0 1.7px, transparent 2.6px), radial-gradient(circle at 74% 40%, rgba(65,38,17,0.28) 0 1.6px, transparent 2.5px), radial-gradient(circle at 35% 76%, rgba(53,30,14,0.24) 0 1.8px, transparent 2.7px), repeating-linear-gradient(16deg, rgba(139,96,58,0.35) 0 10px, rgba(125,84,50,0.26) 10px 21px), linear-gradient(130deg, #b88254, #8b5e3a)",
                }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\"/></filter><rect width=\"140\" height=\"140\" filter=\"url(%23n)\" opacity=\"0.55\"/></svg>')",
                    }}
                  />
                </div>

                {GARLAND_LINES.map((line, lineIndex) => (
                  <div
                    key={`garland-${lineIndex}`}
                    className="pointer-events-none absolute left-14 right-14 z-10 h-[2px] origin-left rounded-full bg-[#efe7d8]/70"
                    style={{ transform: `rotate(${line.tilt}deg)`, top: `${line.top}px` }}
                  >
                    {Array.from({ length: line.bulbs }).map((_, bulbIndex) => {
                      const leftPercent = (bulbIndex / (line.bulbs - 1)) * 100;
                      return (
                        <span
                          key={`bulb-${lineIndex}-${bulbIndex}`}
                          className="absolute top-1/2 h-3 w-2 -translate-y-1/2 rounded-full"
                          style={{
                            left: `calc(${leftPercent}% - 4px)`,
                            background: "radial-gradient(circle at 50% 35%, #fffbeb, #fde68a 58%, #f59e0b)",
                            boxShadow: "0 0 9px rgba(255,251,191,0.85), 0 0 18px rgba(253,224,71,0.45)",
                            animation: `twinkle ${1.7 + (bulbIndex % 4) * 0.33}s ease-in-out infinite`,
                            animationDelay: `${(bulbIndex % 7) * 0.18}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}

                <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                  {cards.map((card, index) => {
                    const layout = layoutByKey.get(`photo:${card.entry.id}`);
                    if (!layout) return null;

                    const isPhotobooth = card.photos.length > 1;
                    const frameColor = card.entry.booth_frame_color || "#fffdf8";

                    return (
                      <DraggableCard
                        key={card.id}
                        dragId={`photo:${card.entry.id}`}
                        x={layout.x}
                        y={layout.y}
                        rotation={layout.rotation}
                        zIndex={layout.zIndex || 40 + index}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setModalEntry(card.entry);
                            setModalPhotoIndex(0);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setModalEntry(card.entry);
                              setModalPhotoIndex(0);
                            }
                          }}
                          className="relative block w-[178px] text-left"
                        >
                          <div className="absolute -top-4 left-1/2 z-20 h-9 w-4 -translate-x-1/2 rounded-[3px] border border-[#89643f] bg-[#d7b386] shadow-[0_3px_8px_rgba(0,0,0,0.35)]">
                            <div className="absolute inset-x-0 top-3 h-[1px] bg-[#916b45]" />
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              deleteDayEntry(card.entry.id);
                            }}
                            className="absolute -right-2 -top-2 z-30 rounded-full border border-rose-200/60 bg-rose-900/75 px-1.5 py-0.5 text-[10px] text-rose-100 hover:bg-rose-800"
                          >
                            ✕
                          </button>

                          {isPhotobooth ? (
                            <div
                              className="relative rounded-sm p-2 pb-8 shadow-[0_16px_26px_rgba(0,0,0,0.34)]"
                              style={{ backgroundColor: frameColor }}
                            >
                              <div className="space-y-1.5">
                                {card.photos.slice(0, 4).map((photo) => (
                                  <img
                                    key={photo.id}
                                    src={photo.url}
                                    alt={card.entry.main_event || "Фотобудка"}
                                    className="h-20 w-full rounded-[2px] object-cover"
                                  />
                                ))}
                              </div>

                              {card.photos.length > 4 ? (
                                <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                  +{card.photos.length - 4}
                                </span>
                              ) : null}

                              <p className="font-handwriting absolute bottom-1 left-0 right-0 text-center text-sm text-zinc-700">
                                {format(new Date(card.entry.date), "d MMM yyyy", { locale: ru })}
                              </p>
                            </div>
                          ) : (
                            <div className="relative rounded-sm bg-white p-2 pb-8 shadow-[0_16px_26px_rgba(0,0,0,0.34)]">
                              <img
                                src={card.cover.url}
                                alt={card.entry.main_event || "Фото дня"}
                                className="h-40 w-full rounded-[2px] object-cover"
                              />
                              <p className="font-handwriting absolute bottom-1 left-0 right-0 text-center text-sm text-zinc-700">
                                {format(new Date(card.entry.date), "d MMM yyyy", { locale: ru })}
                              </p>
                            </div>
                          )}
                        </div>
                      </DraggableCard>
                    );
                  })}

                  {layoutItems
                    .filter((item) => item.itemType === "sticker")
                    .map((item) => {
                      const parsedRef = parseStickerLayoutRef(item.refId);
                      const sticker = stickersById.get(parsedRef.stickerId);
                      if (!sticker) return null;

                      const isUnderPhoto = item.zIndex <= STICKER_LAYER_Z.under + 12;

                      return (
                        <DraggableCard
                          key={`sticker-${item.refId}`}
                          dragId={`sticker:${item.refId}`}
                          x={item.x}
                          y={item.y}
                          rotation={item.rotation}
                          zIndex={item.zIndex}
                        >
                          <div className="group relative">
                            <button
                              type="button"
                              onPointerDown={(event) => event.stopPropagation()}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleStickerLayer(item.refId);
                              }}
                              className="absolute -left-2 -top-2 z-30 rounded-full border border-emerald-100/65 bg-emerald-950/80 px-1.5 py-0.5 text-[10px] text-emerald-100 opacity-0 shadow transition group-hover:opacity-100"
                              title={isUnderPhoto ? "Переместить над фото" : "Переместить под фото"}
                            >
                              {isUnderPhoto ? "↓" : "↑"}
                            </button>

                            <button
                              type="button"
                              onPointerDown={(event) => event.stopPropagation()}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                removeStickerFromBoard(item.refId);
                              }}
                              className="absolute -right-2 -top-2 z-30 rounded-full border border-rose-200/60 bg-rose-900/80 px-1.5 py-0.5 text-[10px] text-rose-100 opacity-0 shadow transition group-hover:opacity-100"
                              title="Удалить с доски"
                            >
                              ✕
                            </button>

                            {sticker.image_url ? (
                              <img
                                src={sticker.image_url}
                                alt={sticker.name}
                                className="h-24 w-24 select-none object-contain"
                                style={{ filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.35)) drop-shadow(0 8px 8px rgba(0,0,0,0.32))" }}
                                draggable={false}
                              />
                            ) : (
                              <div
                                className="grid h-20 w-20 place-items-center rounded-xl border border-emerald-200/20 text-4xl shadow-[0_9px_16px_rgba(0,0,0,0.35)]"
                                style={{ backgroundColor: `${sticker.color}99` }}
                                title={sticker.name}
                              >
                                {sticker.emoji || "✨"}
                              </div>
                            )}
                          </div>
                        </DraggableCard>
                      );
                    })}

                  {state.cassettes.map((cassette) => {
                    const layout = layoutByKey.get(`cassette:${cassette.id}`);
                    if (!layout) return null;

                    return (
                      <DraggableCard
                        key={cassette.id}
                        dragId={`cassette:${cassette.id}`}
                        x={layout.x}
                        y={layout.y}
                        rotation={layout.rotation}
                        zIndex={layout.zIndex}
                      >
                        <div className="w-60 rounded-xl border border-emerald-500/30 bg-[#052119]/90 p-3 shadow-2xl">
                          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-emerald-200/70">Cassette</p>
                          <p className="mb-2 text-sm font-semibold text-emerald-100">{cassette.title}</p>
                          <audio controls src={cassette.audio_url} className="h-8 w-full" preload="metadata" />
                        </div>
                      </DraggableCard>
                    );
                  })}
                </DndContext>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-emerald-700/35 bg-black/25 px-2 py-1.5 text-xs">
              <span className="text-emerald-200/80">Слой новых стикеров:</span>
              <button
                type="button"
                onClick={() => setStickerLayerMode("over")}
                className={`rounded px-2 py-1 ${stickerLayerMode === "over" ? "bg-emerald-400 text-black" : "border border-emerald-700/50 text-emerald-100/85"}`}
              >
                Над фото
              </button>
              <button
                type="button"
                onClick={() => setStickerLayerMode("under")}
                className={`rounded px-2 py-1 ${stickerLayerMode === "under" ? "bg-emerald-400 text-black" : "border border-emerald-700/50 text-emerald-100/85"}`}
              >
                Под фото
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {state.stickers.map((sticker) => (
                <button
                  key={`pin-${sticker.id}`}
                  type="button"
                  onClick={() => addStickerToBoard(sticker.id)}
                  className="flex items-center gap-2 rounded-md border border-emerald-600/50 bg-black/25 px-2 py-1 text-xs hover:bg-emerald-500/20"
                >
                  {sticker.image_url ? (
                    <img src={sticker.image_url} alt={sticker.name} className="h-8 w-8 object-contain" />
                  ) : (
                    <span className="text-base">{sticker.emoji || "✨"}</span>
                  )}
                  <span>{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {modalEntry && selectedPhoto ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4" onClick={() => setModalEntry(null)}>
          <div
            className="max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#052019] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/70">Подпись дня</p>
                <h3 className="text-xl text-emerald-100">
                  {format(new Date(modalEntry.date), "d MMMM yyyy", { locale: ru })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalEntry(null)}
                className="rounded-md border border-emerald-600/50 px-3 py-1 text-xs hover:bg-emerald-500/20"
              >
                Закрыть
              </button>
            </div>

            <img src={selectedPhoto.url} alt="День" className="mb-3 max-h-[60vh] w-full rounded-xl object-contain" />

            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => deletePhotoFromEntry(modalEntry.id, selectedPhoto.id)}
                className="rounded-md border border-rose-300/45 bg-rose-900/35 px-3 py-1 text-xs text-rose-100 hover:bg-rose-900/50"
              >
                {modalEntry.photos.length === 1 ? "Удалить день" : "Удалить этот кадр"}
              </button>
              <button
                type="button"
                onClick={() => deleteDayEntry(modalEntry.id)}
                className="rounded-md border border-rose-300/45 px-3 py-1 text-xs text-rose-100 hover:bg-rose-900/35"
              >
                Удалить весь день
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setModalPhotoIndex((prev) =>
                    prev === 0 ? modalEntry.photos.length - 1 : prev - 1,
                  )
                }
                className="rounded-md border border-emerald-600/50 px-3 py-1 text-xs hover:bg-emerald-500/20"
              >
                Назад
              </button>
              <p className="text-sm text-emerald-100/85">
                {modalEntry.main_event || "Без заголовка"}
                {modalEntry.description ? ` — ${modalEntry.description}` : ""}
              </p>
              <button
                type="button"
                onClick={() => setModalPhotoIndex((prev) => (prev + 1) % modalEntry.photos.length)}
                className="rounded-md border border-emerald-600/50 px-3 py-1 text-xs hover:bg-emerald-500/20"
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.72;
            transform: translateY(-50%) scale(0.88);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) scale(1.12);
          }
        }
      `}</style>
    </main>
  );
}
