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

const FALLBACK_STICKER_COLORS = ["#34d399", "#22c55e", "#0ea5e9", "#10b981", "#ec4899"];
const LOCAL_SESSION_KEY = "memory_local_session";
const LOCAL_STORAGE_PREFIX = "memory-board-local-v1";
const LOCAL_CATEGORY_ID = "local-category-main";

function localId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function localStorageKey(userId: string, year: number) {
  return `${LOCAL_STORAGE_PREFIX}:${userId}:${year}`;
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

function readLocalState(userId: string, selectedYear: number): MemoryBoardState {
  const key = localStorageKey(userId, selectedYear);
  const raw = localStorage.getItem(key);

  if (!raw) {
    return createEmptyLocalState(userId, selectedYear);
  }

  try {
    const parsed = JSON.parse(raw) as MemoryBoardState;
    if (!parsed?.board?.id) {
      return createEmptyLocalState(userId, selectedYear);
    }
    return parsed;
  } catch {
    return createEmptyLocalState(userId, selectedYear);
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
    transform: CSS.Translate.toString(transform) + ` rotate(${rotation}deg)`,
    touchAction: "none",
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export default function MemoryBoardLocalApp({ userId, userEmail }: { userId: string; userEmail: string }) {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<MemoryBoardState | null>(null);

  const [entryDate, setEntryDate] = useState(toIsoDate(new Date()));
  const [mainEvent, setMainEvent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [savingEntry, setSavingEntry] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("🍀");
  const [newCategoryColor, setNewCategoryColor] = useState("#34d399");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newStickerName, setNewStickerName] = useState("");
  const [newStickerEmoji, setNewStickerEmoji] = useState("✨");
  const [newStickerColor, setNewStickerColor] = useState(FALLBACK_STICKER_COLORS[0]);
  const [newStickerCategoryId, setNewStickerCategoryId] = useState<string>(LOCAL_CATEGORY_ID);
  const [creatingSticker, setCreatingSticker] = useState(false);

  const [cassetteTitle, setCassetteTitle] = useState("");
  const [savingCassette, setSavingCassette] = useState(false);

  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [savingLayout, setSavingLayout] = useState(false);

  const [modalEntry, setModalEntry] = useState<MemoryDayEntry | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  const [exporting, setExporting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const persistState = useCallback(
    (nextState: MemoryBoardState) => {
      localStorage.setItem(localStorageKey(userId, nextState.board.year), JSON.stringify(nextState));
      setState(nextState);
      setLayoutItems(nextState.layoutItems);
    },
    [userId],
  );

  const fetchState = useCallback(
    async (selectedYear: number) => {
      setLoading(true);
      setError(null);

      try {
        const payload = readLocalState(userId, selectedYear);
        setState(payload);
        setLayoutItems(payload.layoutItems);
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

  const layoutByKey = useMemo(() => {
    const map = new Map<string, LayoutItem>();
    layoutItems.forEach((item) => {
      map.set(`${item.itemType}:${item.refId}`, item);
    });

    cards.forEach((card, index) => {
      const key = `photo:${card.entry.id}`;
      if (!map.has(key)) {
        const row = Math.floor(index / 6);
        const col = index % 6;
        map.set(key, {
          itemType: "photo",
          refId: card.entry.id,
          x: 70 + col * 180,
          y: 140 + row * 260,
          rotation: randomTilt(card.entry.id),
          scale: 1,
          zIndex: 20 + index,
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
          x: cassette.x ?? 90 + index * 140,
          y: cassette.y ?? 920,
          rotation: cassette.rotation ?? randomTilt(cassette.id),
          scale: 1,
          zIndex: cassette.z_index || 200,
          pinned: true,
        });
      }
    });

    return map;
  }, [cards, layoutItems, state]);

  async function uploadPhoto(file: File): Promise<PendingPhoto> {
    const buffer = await file.arrayBuffer();
    const metadata = await exifr.parse(buffer, {
      pick: ["DateTimeOriginal", "CreateDate", "ModifyDate", "ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight"],
    });

    const takenDate = metadata?.DateTimeOriginal ?? metadata?.CreateDate ?? metadata?.ModifyDate ?? null;
    const takenAt = takenDate instanceof Date ? takenDate.toISOString() : null;

    const defaultDate = takenAt ? takenAt.slice(0, 10) : entryDate;
    const url = await fileToDataUrl(file);

    return {
      storagePath: localId("photo"),
      url,
      takenAt,
      displayDate: defaultDate,
      isFeatured: false,
      boothGroup: `${entryDate}-booth`,
      sortOrder: 0,
      width: metadata?.ExifImageWidth ?? metadata?.ImageWidth ?? null,
      height: metadata?.ExifImageHeight ?? metadata?.ImageHeight ?? null,
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

  async function saveDayEntry() {
    if (!state) return;

    setSavingEntry(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const existing = state.entries.find((entry) => entry.date === entryDate);
      const entryId = existing?.id ?? localId("entry");

      const photos = pendingPhotos.map((photo, index) => ({
        id: localId("photo-item"),
        entry_id: entryId,
        storage_path: photo.storagePath,
        url: photo.url,
        taken_at: photo.takenAt,
        display_date: photo.displayDate,
        is_featured: photo.isFeatured || index === 0,
        booth_group: photo.boothGroup,
        sort_order: index,
        width: photo.width,
        height: photo.height,
      }));

      const nextEntry: MemoryDayEntry = {
        id: entryId,
        board_id: state.board.id,
        date: entryDate,
        main_event: mainEvent || null,
        description: description || null,
        created_at: existing?.created_at ?? now,
        updated_at: now,
        photos,
        sticker_ids: selectedStickerIds,
      };

      const entriesWithoutDay = state.entries.filter((entry) => entry.id !== entryId);
      const nextEntries = [...entriesWithoutDay, nextEntry].sort((a, b) => (a.date > b.date ? 1 : -1));

      const hasLayout = state.layoutItems.some(
        (item) => item.itemType === "photo" && item.refId === entryId,
      );

      let nextLayout = state.layoutItems;
      if (!hasLayout) {
        const photoLayoutCount = state.layoutItems.filter((item) => item.itemType === "photo").length;
        const col = photoLayoutCount % 6;
        const row = Math.floor(photoLayoutCount / 6);

        nextLayout = [
          ...state.layoutItems,
          {
            itemType: "photo",
            refId: entryId,
            x: 70 + col * 180,
            y: 140 + row * 260,
            rotation: ((photoLayoutCount % 8) - 4) * 0.9,
            scale: 1,
            zIndex: 20 + photoLayoutCount,
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
    } catch (saveError) {
      const text = saveError instanceof Error ? saveError.message : "Ошибка сохранения";
      setError(text);
    } finally {
      setSavingEntry(false);
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
      const nextSticker = {
        id: localId("sticker"),
        user_id: userId,
        name: newStickerName.trim(),
        emoji: newStickerEmoji || "✨",
        image_path: null,
        image_url: null,
        color: newStickerColor,
        category_id: newStickerCategoryId || null,
      };

      persistState({
        ...state,
        stickers: [...state.stickers, nextSticker],
      });

      setNewStickerName("");
    } catch (stickerError) {
      const text = stickerError instanceof Error ? stickerError.message : "Ошибка стикера";
      setError(text);
    } finally {
      setCreatingSticker(false);
    }
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
        x: 120,
        y: 980,
        rotation: randomTilt(cassetteTitle),
        z_index: 220 + state.cassettes.length,
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

  async function saveLayout(nextItems: LayoutItem[]) {
    if (!state) return;

    setSavingLayout(true);

    try {
      persistState({
        ...state,
        layoutItems: nextItems,
      });
    } catch {
      setError("Ошибка сохранения раскладки");
    } finally {
      setSavingLayout(false);
    }
  }

  function upsertLocalLayout(nextItem: LayoutItem) {
    setLayoutItems((prev) => {
      const without = prev.filter(
        (item) => !(item.itemType === nextItem.itemType && item.refId === nextItem.refId),
      );
      const next = [...without, nextItem];
      void saveLayout(next);
      return next;
    });
  }

  function onDragEnd(event: DragEndEvent) {
    if (!state || (!event.delta.x && !event.delta.y)) return;

    const rawId = String(event.active.id);
    const [itemType, refId] = rawId.split(":") as [LayoutItem["itemType"], string];
    const prev = layoutByKey.get(rawId);
    if (!prev) return;

    const updated: LayoutItem = {
      ...prev,
      itemType,
      refId,
      x: Math.max(0, Math.round(prev.x + event.delta.x)),
      y: Math.max(0, Math.round(prev.y + event.delta.y)),
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
        backgroundColor: "#0b2a23",
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
      <main className="flex min-h-screen items-center justify-center bg-[#071c18] text-emerald-100">
        Загрузка доски воспоминаний...
      </main>
    );
  }

  const selectedPhoto = modalEntry ? modalEntry.photos[modalPhotoIndex] : null;

  return (
    <main className="min-h-screen bg-[#031611] text-emerald-50">
      <div className="mx-auto grid max-w-[1800px] gap-4 px-4 pb-10 pt-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-2xl border border-emerald-700/30 bg-[#05221b]/85 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/60">Личный кабинет</p>
              <p className="text-sm text-emerald-100/90">{userEmail}</p>
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

            {pendingPhotos.length ? (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {pendingPhotos.map((photo, index) => (
                  <div key={`${photo.storagePath}-${index}`} className="rounded-lg border border-emerald-700/40 bg-black/25 p-2">
                    <img src={photo.url} alt="preview" className="mb-2 h-20 w-full rounded-md object-cover" />
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
                        Фотобудка
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
                      {sticker.emoji} {sticker.name}
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
            <button
              type="button"
              onClick={createSticker}
              disabled={creatingSticker}
              className="w-full rounded-md border border-emerald-500/50 px-2 py-1.5 text-sm hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {creatingSticker ? "Создаю..." : "Создать стикер"}
            </button>
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

          <section className="mt-4 rounded-xl border border-emerald-700/30 bg-black/20 p-3">
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

        <section className="min-h-[80vh] rounded-2xl border border-emerald-700/30 bg-[#0d2b24] p-4">
          <div
            ref={boardRef}
            className="relative min-h-[1200px] overflow-hidden rounded-xl border border-emerald-700/20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 0%, rgba(110,231,183,0.17), transparent 42%), repeating-linear-gradient(45deg, rgba(16,75,61,0.45) 0 8px, rgba(10,57,46,0.42) 8px 16px)",
              backgroundColor: "#1f4b3f",
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay">
              <div className="h-full w-full" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.95\" numOctaves=\"3\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.4\"/></svg>')" }} />
            </div>

            <div className="pointer-events-none absolute left-0 right-0 top-1 z-10 flex items-start justify-around px-4">
              {Array.from({ length: 18 }).map((_, index) => (
                <div key={`lamp-${index}`} className="relative h-9 w-3">
                  <div className="absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 bg-emerald-900" />
                  <div
                    className="absolute left-1/2 top-2 h-4 w-3 -translate-x-1/2 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 50% 35%, #ecfeff, #34d399)",
                      boxShadow: "0 0 10px rgba(16,185,129,0.62)",
                      animation: `pulse ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
                    }}
                  />
                </div>
              ))}
            </div>

            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              {cards.map((card, index) => {
                const layout = layoutByKey.get(`photo:${card.entry.id}`);
                if (!layout) return null;

                return (
                  <DraggableCard
                    key={card.id}
                    dragId={`photo:${card.entry.id}`}
                    x={layout.x}
                    y={layout.y}
                    rotation={layout.rotation}
                    zIndex={layout.zIndex || 20 + index}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setModalEntry(card.entry);
                        setModalPhotoIndex(0);
                      }}
                      className="relative block w-[150px] rounded-sm bg-white p-2 pb-7 text-left shadow-[0_14px_25px_rgba(0,0,0,0.35)]"
                    >
                      <div className="absolute -top-3 left-1/2 z-10 h-6 w-5 -translate-x-1/2 rounded-t bg-emerald-700 shadow">
                        <div className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500" />
                      </div>

                      {card.photos.length > 1 ? (
                        <div className="grid gap-1">
                          {card.photos.slice(0, 4).map((photo) => (
                            <img
                              key={photo.id}
                              src={photo.url}
                              alt={card.entry.main_event || "День"}
                              className="h-20 w-full rounded-[2px] object-cover"
                            />
                          ))}
                        </div>
                      ) : (
                        <img
                          src={card.cover.url}
                          alt={card.entry.main_event || "Фото дня"}
                          className="h-36 w-full rounded-[2px] object-cover"
                        />
                      )}

                      <p className="font-handwriting absolute bottom-1 left-0 right-0 text-center text-sm text-zinc-700">
                        {format(new Date(card.entry.date), "d MMM yyyy", { locale: ru })}
                      </p>
                    </button>
                  </DraggableCard>
                );
              })}

              {layoutItems
                .filter((item) => item.itemType === "sticker")
                .map((item) => {
                  const sticker = stickersById.get(item.refId);
                  if (!sticker) return null;

                  return (
                    <DraggableCard
                      key={`sticker-${item.refId}`}
                      dragId={`sticker:${item.refId}`}
                      x={item.x}
                      y={item.y}
                      rotation={item.rotation}
                      zIndex={item.zIndex}
                    >
                      <div
                        className="grid h-20 w-20 place-items-center rounded-xl border border-emerald-200/20 text-4xl shadow-[0_9px_16px_rgba(0,0,0,0.35)]"
                        style={{ backgroundColor: `${sticker.color}88` }}
                        title={sticker.name}
                      >
                        {sticker.emoji || "✨"}
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
                    <div className="w-56 rounded-xl border border-emerald-500/30 bg-[#052119]/90 p-3 shadow-2xl">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-emerald-200/70">Cassette</p>
                      <p className="mb-2 text-sm font-semibold text-emerald-100">{cassette.title}</p>
                      <audio controls src={cassette.audio_url} className="h-8 w-full" preload="metadata" />
                    </div>
                  </DraggableCard>
                );
              })}
            </DndContext>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {state.stickers.map((sticker) => (
              <button
                key={`pin-${sticker.id}`}
                type="button"
                onClick={() =>
                  upsertLocalLayout({
                    itemType: "sticker",
                    refId: sticker.id,
                    x: 60 + Math.round(Math.random() * 500),
                    y: 760 + Math.round(Math.random() * 240),
                    rotation: randomTilt(sticker.id),
                    scale: 1,
                    zIndex: 250,
                    pinned: true,
                  })
                }
                className="rounded-md border border-emerald-600/50 bg-black/25 px-2 py-1 text-xs hover:bg-emerald-500/20"
              >
                Приклеить: {sticker.emoji} {sticker.name}
              </button>
            ))}
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
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: translateX(-50%) scale(0.92);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.08);
          }
        }
      `}</style>
    </main>
  );
}
