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
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildPhotoboothPhotos,
  getEntryCoverPhoto,
  randomTilt,
  toIsoDate,
} from "@/lib/memory-board/helpers";
import type {
  DayEntryPayload,
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

type GarlandBulb = {
  index: number;
  leftPct: number;
  wireY: number;
  dropLength: number;
  bulbWidth: number;
  bulbHeight: number;
  glowSize: number;
  warmShift: number;
  pulseDuration: number;
  flickerDuration: number;
  delay: number;
};

const FALLBACK_STICKER_COLORS = ["#f59e0b", "#22c55e", "#0ea5e9", "#f97316", "#ec4899"];
const VINYL_SOURCES = {
  upload: "upload",
  apple: "apple",
} as const;

type VinylSource = (typeof VINYL_SOURCES)[keyof typeof VINYL_SOURCES];

type AppleResolvedTrack = {
  title: string;
  previewUrl: string;
  artworkUrl: string | null;
  durationSec: number | null;
  sourceUrl: string;
  embedUrl: string;
};

function layoutKey(item: Pick<LayoutItem, "itemType" | "refId">) {
  return `${item.itemType}:${item.refId}`;
}

function toLayoutArray(items: Iterable<LayoutItem>) {
  const map = new Map<string, LayoutItem>();
  for (const item of items) {
    map.set(layoutKey(item), item);
  }

  return [...map.values()].sort((a, b) => layoutKey(a).localeCompare(layoutKey(b)));
}

function formatDuration(seconds: number | null) {
  if (!seconds || seconds < 0) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
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

function buildGarlandWirePath(points: Array<{ x: number; y: number }>) {
  if (!points.length) return "";

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const current = points[index];
    const controlX = (prev.x + current.x) / 2;
    const controlY = Math.max(prev.y, current.y) + 3.8;
    path += ` Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
  }
  return path;
}

export default function MemoryBoardApp({ userEmail }: { userEmail: string }) {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<MemoryBoardState | null>(null);

  const [entryDate, setEntryDate] = useState(toIsoDate(new Date()));
  const [mainEvent, setMainEvent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
  const [stickerSearch, setStickerSearch] = useState("");
  const [activeStickerCategoryFilter, setActiveStickerCategoryFilter] = useState<string>("all");
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [savingEntry, setSavingEntry] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📌");
  const [newCategoryColor, setNewCategoryColor] = useState("#f59e0b");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newStickerName, setNewStickerName] = useState("");
  const [newStickerEmoji, setNewStickerEmoji] = useState("✨");
  const [newStickerColor, setNewStickerColor] = useState(FALLBACK_STICKER_COLORS[0]);
  const [newStickerCategoryId, setNewStickerCategoryId] = useState<string>("");
  const [creatingSticker, setCreatingSticker] = useState(false);

  const [cassetteTitle, setCassetteTitle] = useState("");
  const [cassetteSource, setCassetteSource] = useState<VinylSource>(VINYL_SOURCES.upload);
  const [appleMusicUrl, setAppleMusicUrl] = useState("");
  const [savingCassette, setSavingCassette] = useState(false);
  const [activeCassetteId, setActiveCassetteId] = useState<string | null>(null);
  const [isPlayingCassette, setIsPlayingCassette] = useState(false);
  const [isCassetteBuffering, setIsCassetteBuffering] = useState(false);
  const [trackProgressRatio, setTrackProgressRatio] = useState(0);
  const [deckAnimationCounter, setDeckAnimationCounter] = useState(0);
  const [masterVolume, setMasterVolume] = useState(82);
  const [speakerVolume, setSpeakerVolume] = useState(86);

  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [savingLayout, setSavingLayout] = useState(false);

  const [modalEntry, setModalEntry] = useState<MemoryDayEntry | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  const [exporting, setExporting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queuedAutoPlayRef = useRef(false);
  const newlyCreatedCassetteIdRef = useRef<string | null>(null);
  const pendingLayoutSaveRef = useRef<{ boardId: string; items: LayoutItem[] } | null>(null);
  const isSavingLayoutRef = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const garlandBulbs = useMemo<GarlandBulb[]>(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const ratio = (index + 0.5) / 18;
        const arch = Math.sin(Math.PI * ratio);
        const sway = Math.cos((index * 1.7 + 0.8) * Math.PI) * 0.6;

        return {
          index,
          leftPct: ratio * 100,
          wireY: 7 + arch * 11 + sway,
          dropLength: 7 + (index % 4),
          bulbWidth: 8 + ((index + 1) % 2),
          bulbHeight: 13 + ((index + 2) % 3),
          glowSize: 22 + (index % 4) * 2,
          warmShift: -6 + (index % 5) * 3,
          pulseDuration: 2.2 + (index % 4) * 0.35,
          flickerDuration: 8 + (index % 5) * 1.4,
          delay: index * 0.17,
        };
      }),
    [],
  );

  const garlandWirePath = useMemo(() => {
    const points = [
      { x: 0, y: 8 },
      ...garlandBulbs.map((bulb) => ({ x: bulb.leftPct, y: bulb.wireY })),
      { x: 100, y: 9 },
    ];

    return buildGarlandWirePath(points);
  }, [garlandBulbs]);

  const fetchState = useCallback(async (selectedYear: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/memory/state?year=${selectedYear}`, { cache: "no-store" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Не удалось загрузить данные доски");
      }

      const payload = (await response.json()) as MemoryBoardState;
      setState(payload);
      setLayoutItems(payload.layoutItems);
    } catch (fetchError) {
      const text = fetchError instanceof Error ? fetchError.message : "Неизвестная ошибка";
      setError(text);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const filteredStickers = useMemo(() => {
    if (!state) return [];

    const query = stickerSearch.trim().toLowerCase();
    return state.stickers.filter((sticker) => {
      const categoryMatches =
        activeStickerCategoryFilter === "all" || sticker.category_id === activeStickerCategoryFilter;
      if (!categoryMatches) return false;

      if (!query.length) return true;

      return (
        sticker.name.toLowerCase().includes(query) ||
        sticker.emoji.toLowerCase().includes(query)
      );
    });
  }, [activeStickerCategoryFilter, state, stickerSearch]);

  useEffect(() => {
    if (!state) return;
    if (activeStickerCategoryFilter === "all") return;

    const categoryExists = state.stickerCategories.some(
      (category) => category.id === activeStickerCategoryFilter,
    );

    if (!categoryExists) {
      setActiveStickerCategoryFilter("all");
    }
  }, [activeStickerCategoryFilter, state]);

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

  const activeCassette = useMemo(() => {
    if (!state || !activeCassetteId) return null;
    return state.cassettes.find((cassette) => cassette.id === activeCassetteId) ?? null;
  }, [activeCassetteId, state]);

  const cueCassette = useCallback((cassetteId: string, autoPlay = false) => {
    queuedAutoPlayRef.current = autoPlay;
    setDeckAnimationCounter((prev) => prev + 1);
    setActiveCassetteId(cassetteId);
  }, []);

  useEffect(() => {
    if (!state?.cassettes.length) {
      setActiveCassetteId(null);
      return;
    }

    if (!activeCassetteId || !state.cassettes.some((cassette) => cassette.id === activeCassetteId)) {
      setActiveCassetteId(state.cassettes[state.cassettes.length - 1].id);
    }
  }, [activeCassetteId, state]);

  useEffect(() => {
    if (!state || !newlyCreatedCassetteIdRef.current) return;
    const targetId = newlyCreatedCassetteIdRef.current;

    if (!state.cassettes.some((cassette) => cassette.id === targetId)) {
      return;
    }

    newlyCreatedCassetteIdRef.current = null;
    cueCassette(targetId, true);
  }, [cueCassette, state]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!activeCassette) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setTrackProgressRatio(0);
      setIsPlayingCassette(false);
      return;
    }

    const shouldLoadNewTrack = audio.getAttribute("src") !== activeCassette.audio_url;
    if (shouldLoadNewTrack) {
      audio.pause();
      audio.src = activeCassette.audio_url;
      audio.currentTime = 0;
      audio.load();
      setTrackProgressRatio(0);
      setIsPlayingCassette(false);
    }

    if (queuedAutoPlayRef.current) {
      queuedAutoPlayRef.current = false;
      void audio.play().catch(() => {
        setError("Автовоспроизведение заблокировано браузером. Нажмите Play на проигрывателе.");
      });
    }
  }, [activeCassette]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const volume = Math.min(1, Math.max(0, (masterVolume / 100) * (speakerVolume / 100)));
    audio.volume = volume;
  }, [masterVolume, speakerVolume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlayingCassette(true);
      setIsCassetteBuffering(false);
    };
    const onPause = () => {
      setIsPlayingCassette(false);
      setIsCassetteBuffering(false);
    };
    const onWaiting = () => {
      setIsCassetteBuffering(true);
    };
    const onCanPlay = () => {
      setIsCassetteBuffering(false);
    };
    const onEnded = () => {
      setIsPlayingCassette(false);
      setTrackProgressRatio(0);
    };
    const onTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) {
        setTrackProgressRatio(0);
        return;
      }
      setTrackProgressRatio(Math.min(1, audio.currentTime / audio.duration));
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  async function uploadPhoto(file: File): Promise<PendingPhoto> {
    if (!state) {
      throw new Error("Доска ещё не загружена");
    }

    const form = new FormData();
    form.append("file", file);
    form.append("boardId", state.board.id);

    const response = await fetch("/api/photos/upload", {
      method: "POST",
      body: form,
    });

    const payload = (await response.json()) as {
      error?: string;
      storagePath: string;
      url: string;
      takenAt: string | null;
      width: number | null;
      height: number | null;
    };

    if (!response.ok) {
      throw new Error(payload.error || "Ошибка загрузки фото");
    }

    const defaultDate = payload.takenAt ? payload.takenAt.slice(0, 10) : entryDate;

    return {
      storagePath: payload.storagePath,
      url: payload.url,
      takenAt: payload.takenAt,
      displayDate: defaultDate,
      isFeatured: false,
      boothGroup: `${entryDate}-booth`,
      sortOrder: 0,
      width: payload.width,
      height: payload.height,
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

    const payload: DayEntryPayload = {
      boardId: state.board.id,
      date: entryDate,
      mainEvent,
      description,
      photos: pendingPhotos.map((photo, index) => ({
        storagePath: photo.storagePath,
        takenAt: photo.takenAt,
        displayDate: photo.displayDate,
        isFeatured: photo.isFeatured || index === 0,
        boothGroup: photo.boothGroup,
        sortOrder: index,
        width: photo.width,
        height: photo.height,
      })),
      stickerIds: selectedStickerIds,
    };

    setSavingEntry(true);
    setError(null);

    try {
      const response = await fetch("/api/day-entry/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error || "Ошибка сохранения дня");
      }

      setMainEvent("");
      setDescription("");
      setPendingPhotos([]);
      setSelectedStickerIds([]);
      await fetchState(year);
    } catch (saveError) {
      const text = saveError instanceof Error ? saveError.message : "Ошибка сохранения";
      setError(text);
    } finally {
      setSavingEntry(false);
    }
  }

  async function createStickerCategory() {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);

    try {
      const response = await fetch("/api/sticker-categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          icon: newCategoryIcon || "📌",
          color: newCategoryColor,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Не удалось создать категорию");
      }

      setNewCategoryName("");
      await fetchState(year);
    } catch (categoryError) {
      const text = categoryError instanceof Error ? categoryError.message : "Ошибка категории";
      setError(text);
    } finally {
      setCreatingCategory(false);
    }
  }

  async function createSticker() {
    if (!newStickerName.trim()) return;

    setCreatingSticker(true);

    try {
      const response = await fetch("/api/stickers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStickerName,
          emoji: newStickerEmoji,
          color: newStickerColor,
          categoryId: newStickerCategoryId || null,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Не удалось создать стикер");
      }

      setNewStickerName("");
      await fetchState(year);
    } catch (stickerError) {
      const text = stickerError instanceof Error ? stickerError.message : "Ошибка стикера";
      setError(text);
    } finally {
      setCreatingSticker(false);
    }
  }

  async function uploadCassetteAudio(file: File) {
    if (!state) throw new Error("Доска ещё не загружена");

    const form = new FormData();
    form.append("file", file);
    form.append("boardId", state.board.id);

    const response = await fetch("/api/audio/upload", {
      method: "POST",
      body: form,
    });

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      storagePath: string;
      durationSec: number | null;
    } | null;

    if (!response.ok || !payload) {
      throw new Error(payload?.error || "Не удалось загрузить аудио");
    }

    return payload;
  }

  async function resolveAppleMusicTrack(sourceUrl: string): Promise<AppleResolvedTrack> {
    const response = await fetch("/api/audio/apple-resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceUrl }),
    });

    const payload = (await response.json().catch(() => null)) as
      | ({
          error?: string;
        } & Partial<AppleResolvedTrack>)
      | null;

    if (!response.ok || !payload?.previewUrl || !payload.title) {
      throw new Error(payload?.error || "Не удалось обработать ссылку Apple Music");
    }

    return {
      title: payload.title,
      previewUrl: payload.previewUrl,
      artworkUrl: payload.artworkUrl ?? null,
      durationSec: payload.durationSec ?? null,
      sourceUrl: payload.sourceUrl ?? sourceUrl,
      embedUrl: payload.embedUrl ?? sourceUrl,
    };
  }

  async function createCassette(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    setSavingCassette(true);
    setError(null);

    try {
      const input = event.currentTarget.elements.namedItem("audio") as HTMLInputElement | null;
      let title = cassetteTitle.trim();
      let audioPath = "";
      let durationSec: number | null = null;
      let coverPath: string | null = null;

      if (cassetteSource === VINYL_SOURCES.upload) {
        const file = input?.files?.[0];
        if (!file) {
          throw new Error("Выберите аудиофайл");
        }

        const uploaded = await uploadCassetteAudio(file);
        audioPath = uploaded.storagePath;
        durationSec = uploaded.durationSec;

        if (!title) {
          title = file.name.replace(/\.[^/.]+$/, "").trim();
        }
      } else {
        if (!appleMusicUrl.trim()) {
          throw new Error("Вставьте ссылку Apple Music");
        }

        const appleTrack = await resolveAppleMusicTrack(appleMusicUrl.trim());
        audioPath = appleTrack.previewUrl;
        durationSec = appleTrack.durationSec;
        coverPath = appleTrack.artworkUrl;

        if (!title) {
          title = appleTrack.title;
        }
      }

      if (!title) {
        throw new Error("Введите название трека");
      }

      const response = await fetch("/api/cassettes/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: state.board.id,
          title,
          audioPath,
          durationSec,
          coverPath,
          x: 120,
          y: 980,
          rotation: randomTilt(title),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; id?: string } | null;
      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error || "Не удалось создать кассету");
      }

      newlyCreatedCassetteIdRef.current = payload.id;
      setCassetteTitle("");
      setAppleMusicUrl("");
      if (input) input.value = "";
      await fetchState(year);
    } catch (cassetteError) {
      const text = cassetteError instanceof Error ? cassetteError.message : "Ошибка кассеты";
      setError(text);
    } finally {
      setSavingCassette(false);
    }
  }

  async function toggleCassettePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!activeCassetteId) {
      if (state?.cassettes.length) {
        cueCassette(state.cassettes[0].id, true);
      }
      return;
    }

    try {
      if (audio.paused) {
        setIsCassetteBuffering(true);
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setError("Браузер заблокировал воспроизведение. Нажмите Play ещё раз.");
    } finally {
      setIsCassetteBuffering(false);
    }
  }

  function switchCassette(offset: -1 | 1) {
    if (!state?.cassettes.length) return;

    if (!activeCassetteId) {
      cueCassette(state.cassettes[0].id, true);
      return;
    }

    const currentIndex = state.cassettes.findIndex((item) => item.id === activeCassetteId);
    if (currentIndex === -1) {
      cueCassette(state.cassettes[0].id, true);
      return;
    }

    const nextIndex = (currentIndex + offset + state.cassettes.length) % state.cassettes.length;
    cueCassette(state.cassettes[nextIndex].id, true);
  }

  const flushLayoutQueue = useCallback(async () => {
    if (isSavingLayoutRef.current) return;

    const nextSave = pendingLayoutSaveRef.current;
    if (!nextSave) return;

    pendingLayoutSaveRef.current = null;
    isSavingLayoutRef.current = true;
    setSavingLayout(true);

    try {
      const response = await fetch("/api/layout/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextSave),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Не удалось сохранить раскладку");
      }
    } catch (layoutError) {
      const text = layoutError instanceof Error ? layoutError.message : "Ошибка сохранения раскладки";
      setError(text);
    } finally {
      isSavingLayoutRef.current = false;
      if (pendingLayoutSaveRef.current) {
        void flushLayoutQueue();
      } else {
        setSavingLayout(false);
      }
    }
  }, []);

  const queueLayoutSave = useCallback((boardId: string, items: LayoutItem[]) => {
    pendingLayoutSaveRef.current = {
      boardId,
      items: toLayoutArray(items).map((item) => ({ ...item })),
    };
    void flushLayoutQueue();
  }, [flushLayoutQueue]);

  function upsertLocalLayout(nextItem: LayoutItem) {
    if (!state) return;

    const nextMap = new Map(layoutByKey);
    nextMap.set(layoutKey(nextItem), nextItem);

    const next = toLayoutArray(nextMap.values());
    setLayoutItems(next);
    queueLayoutSave(state.board.id, next);
  }

  function onDragEnd(event: DragEndEvent) {
    if (!state || !event.delta.x && !event.delta.y) return;

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
        backgroundColor: "#2a1c14",
        pixelRatio: 2,
      });

      const response = await fetch("/api/export/year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: state.board.id,
          year,
          pngDataUrl,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Экспорт завершился ошибкой");
      }

      await fetchState(year);
    } catch (exportError) {
      const text = exportError instanceof Error ? exportError.message : "Ошибка экспорта";
      setError(text);
    } finally {
      setExporting(false);
    }
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/dnewnik-cork-7g4m/auth";
  }

  if (loading || !state) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#140d08] text-amber-100">
        Загрузка доски воспоминаний...
      </main>
    );
  }

  const selectedPhoto = modalEntry ? modalEntry.photos[modalPhotoIndex] : null;

  return (
    <main className="min-h-screen bg-[#120c08] text-amber-50">
      <div className="mx-auto grid max-w-[1800px] gap-4 px-4 pb-10 pt-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-2xl border border-amber-700/30 bg-[#1e140e]/85 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/60">Личный кабинет</p>
              <p className="text-sm text-amber-100/90">{userEmail}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs hover:bg-amber-500/20"
            >
              Выйти
            </button>
          </div>

          <div className="mb-4 rounded-xl border border-amber-700/30 bg-black/20 p-3">
            <label className="text-xs uppercase tracking-[0.2em] text-amber-300/70">Год доски</label>
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(Number(event.target.value || new Date().getFullYear()))}
              className="mt-2 w-full rounded-lg border border-amber-700/50 bg-[#150e0a] px-3 py-2 outline-none focus:border-amber-400"
            />
          </div>

          <section className="space-y-3 rounded-xl border border-amber-700/30 bg-black/20 p-3">
            <h2 className="text-lg font-semibold text-amber-100">Запись дня</h2>
            <input
              type="date"
              value={entryDate}
              onChange={(event) => setEntryDate(event.target.value)}
              className="w-full rounded-lg border border-amber-700/50 bg-[#150e0a] px-3 py-2 outline-none focus:border-amber-400"
            />
            <input
              type="text"
              value={mainEvent}
              onChange={(event) => setMainEvent(event.target.value)}
              placeholder="Главное событие дня"
              className="w-full rounded-lg border border-amber-700/50 bg-[#150e0a] px-3 py-2 outline-none focus:border-amber-400"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Короткая подпись к дню"
              rows={3}
              className="w-full rounded-lg border border-amber-700/50 bg-[#150e0a] px-3 py-2 outline-none focus:border-amber-400"
            />

            <label className="block rounded-lg border border-dashed border-amber-600/50 px-3 py-2 text-sm text-amber-200/80 hover:bg-amber-500/10">
              Загрузить фото (дата подтянется из EXIF)
              <input type="file" accept="image/*" multiple onChange={handlePhotoInput} className="mt-2 block w-full text-xs" />
            </label>

            {pendingPhotos.length ? (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {pendingPhotos.map((photo, index) => (
                  <div key={`${photo.storagePath}-${index}`} className="rounded-lg border border-amber-700/40 bg-black/25 p-2">
                    <img src={photo.url} alt="preview" className="mb-2 h-20 w-full rounded-md object-cover" />
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs text-amber-100/80">
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
                          className="mt-1 w-full rounded-md border border-amber-700/40 bg-[#170f0a] px-2 py-1 text-xs"
                        />
                      </label>

                      <label className="text-xs text-amber-100/80">
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
                          className="mt-1 w-full rounded-md border border-amber-700/40 bg-[#170f0a] px-2 py-1 text-xs"
                        />
                      </label>
                    </div>

                    <label className="mt-2 flex items-center gap-2 text-xs text-amber-100/80">
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
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-amber-300/70">Стикеры дня</p>
                <span className="text-[10px] uppercase tracking-[0.16em] text-amber-200/60">
                  Выбрано: {selectedStickerIds.length}
                </span>
              </div>

              <div className="mb-2 grid grid-cols-[1fr_120px] gap-2">
                <input
                  value={stickerSearch}
                  onChange={(event) => setStickerSearch(event.target.value)}
                  placeholder="Поиск стикеров"
                  className="rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-xs"
                />
                <select
                  value={activeStickerCategoryFilter}
                  onChange={(event) => setActiveStickerCategoryFilter(event.target.value)}
                  className="rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-xs"
                >
                  <option value="all">Все</option>
                  {state.stickerCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="max-h-52 overflow-y-auto rounded-lg border border-amber-700/35 bg-black/15 p-2">
                <div className="grid grid-cols-2 gap-2">
                  {filteredStickers.map((sticker) => {
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
                        className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs ${
                          checked
                            ? "border-amber-300 bg-amber-500/30"
                            : "border-amber-700/50 bg-black/25 hover:bg-amber-500/20"
                        }`}
                      >
                        {sticker.image_url ? (
                          <img
                            src={sticker.image_url}
                            alt={sticker.name}
                            className="h-6 w-6 shrink-0 object-contain"
                            loading="lazy"
                            style={{ filter: "saturate(0.82) contrast(1.06)" }}
                          />
                        ) : (
                          <span className="grid h-6 w-6 shrink-0 place-items-center text-base">
                            {sticker.emoji || "✨"}
                          </span>
                        )}
                        <span className="truncate">{sticker.name}</span>
                      </button>
                    );
                  })}
                </div>
                {filteredStickers.length === 0 ? (
                  <p className="px-1 py-3 text-center text-xs text-amber-200/70">
                    Ничего не найдено. Попробуй другой запрос или категорию.
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={saveDayEntry}
              disabled={savingEntry}
              className="w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-60"
            >
              {savingEntry ? "Сохраняю..." : "Сохранить день"}
            </button>
          </section>

          <section className="mt-4 space-y-2 rounded-xl border border-amber-700/30 bg-black/20 p-3">
            <h2 className="text-base font-semibold text-amber-100">Новые стикеры</h2>
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Категория"
              className="w-full rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                value={newCategoryIcon}
                onChange={(event) => setNewCategoryIcon(event.target.value)}
                placeholder="Иконка"
                className="rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-sm"
              />
              <input
                value={newCategoryColor}
                onChange={(event) => setNewCategoryColor(event.target.value)}
                type="color"
                className="h-9 rounded-md border border-amber-700/50 bg-[#150e0a] px-1"
              />
              <button
                type="button"
                onClick={createStickerCategory}
                disabled={creatingCategory}
                className="rounded-md border border-amber-500/50 px-2 py-1 text-xs hover:bg-amber-500/20 disabled:opacity-60"
              >
                + категория
              </button>
            </div>

            <input
              value={newStickerName}
              onChange={(event) => setNewStickerName(event.target.value)}
              placeholder="Название стикера"
              className="w-full rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                value={newStickerEmoji}
                onChange={(event) => setNewStickerEmoji(event.target.value)}
                placeholder="Эмодзи"
                className="rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-sm"
              />
              <input
                value={newStickerColor}
                onChange={(event) => setNewStickerColor(event.target.value)}
                type="color"
                className="h-9 rounded-md border border-amber-700/50 bg-[#150e0a] px-1"
              />
              <select
                value={newStickerCategoryId}
                onChange={(event) => setNewStickerCategoryId(event.target.value)}
                className="rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-xs"
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
              className="w-full rounded-md border border-amber-500/50 px-2 py-1.5 text-sm hover:bg-amber-500/20 disabled:opacity-60"
            >
              {creatingSticker ? "Создаю..." : "Создать стикер"}
            </button>
          </section>

          <section className="mt-4 rounded-xl border border-amber-700/30 bg-black/20 p-3">
            <h2 className="text-base font-semibold text-amber-100">Виниловый проигрыватель</h2>
            <p className="mt-1 text-xs text-amber-200/75">
              Импорт трека: загрузка файла или ссылка Apple Music (играет preview от Apple).
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCassetteSource(VINYL_SOURCES.upload)}
                className={`rounded-md border px-2 py-1.5 ${
                  cassetteSource === VINYL_SOURCES.upload
                    ? "border-amber-300 bg-amber-500/25 text-amber-100"
                    : "border-amber-700/50 bg-black/25 text-amber-200/80 hover:bg-amber-500/15"
                }`}
              >
                Файл
              </button>
              <button
                type="button"
                onClick={() => setCassetteSource(VINYL_SOURCES.apple)}
                className={`rounded-md border px-2 py-1.5 ${
                  cassetteSource === VINYL_SOURCES.apple
                    ? "border-amber-300 bg-amber-500/25 text-amber-100"
                    : "border-amber-700/50 bg-black/25 text-amber-200/80 hover:bg-amber-500/15"
                }`}
              >
                Apple Music
              </button>
            </div>

            <form onSubmit={createCassette} className="mt-2 space-y-2">
              <input
                value={cassetteTitle}
                onChange={(event) => setCassetteTitle(event.target.value)}
                placeholder="Название трека (можно оставить пустым)"
                className="w-full rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-sm"
              />

              {cassetteSource === VINYL_SOURCES.upload ? (
                <input name="audio" type="file" accept="audio/*" className="w-full text-xs" />
              ) : (
                <input
                  value={appleMusicUrl}
                  onChange={(event) => setAppleMusicUrl(event.target.value)}
                  placeholder="https://music.apple.com/..."
                  className="w-full rounded-md border border-amber-700/50 bg-[#150e0a] px-2 py-1.5 text-xs"
                />
              )}

              <button
                type="submit"
                disabled={savingCassette}
                className="w-full rounded-md border border-amber-500/50 px-2 py-1.5 text-sm hover:bg-amber-500/20 disabled:opacity-60"
              >
                {savingCassette ? "Добавляю трек..." : "Создать пластинку"}
              </button>
            </form>

            <div className="mt-4 rounded-xl border border-amber-700/40 bg-[#120c08]/70 p-3">
              <div className="relative mx-auto h-56 w-full max-w-[290px] rounded-[22px] border border-amber-900/40 bg-gradient-to-b from-[#d7ac74] via-[#c08b5e] to-[#7b4e2e] shadow-[0_20px_35px_rgba(0,0,0,0.45)]">
                <div className="absolute left-1/2 top-5 h-[175px] w-[175px] -translate-x-1/2 rounded-full border border-black/50 bg-[#1e2f3f] shadow-[inset_0_0_0_7px_rgba(0,0,0,0.45),inset_0_0_0_14px_rgba(18,29,42,0.45)]" />

                {activeCassette ? (
                  <div
                    key={`${activeCassette.id}-${deckAnimationCounter}`}
                    className="absolute left-1/2 top-5 h-[175px] w-[175px] -translate-x-1/2 rounded-full border border-black/50 bg-[radial-gradient(circle_at_center,#0c1523_0_14%,#12263b_15%_29%,#0b1521_30%_100%)] shadow-[0_9px_18px_rgba(0,0,0,0.45)]"
                    style={{
                      animation: isPlayingCassette
                        ? "vinylDrop 520ms ease-out, recordSpin 2.5s linear infinite 520ms"
                        : "vinylDrop 520ms ease-out",
                    }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/40 bg-gradient-to-b from-[#f8edcf] to-[#c8b288]">
                      {activeCassette.cover_url ? (
                        <img
                          src={activeCassette.cover_url}
                          alt={activeCassette.title}
                          className="h-full w-full rounded-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] text-amber-900">VINYL</div>
                      )}
                    </div>
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2a1c14]" />
                  </div>
                ) : (
                  <div className="absolute left-1/2 top-[94px] -translate-x-1/2 text-xs tracking-[0.14em] text-amber-100/60">
                    Пластинка не выбрана
                  </div>
                )}

                <div
                  className="absolute right-[34px] top-5 h-[120px] w-[9px] origin-top rounded-full bg-gradient-to-b from-zinc-100 to-zinc-400 shadow-[0_2px_5px_rgba(0,0,0,0.35)] transition-transform duration-500"
                  style={{
                    transform: activeCassette ? `rotate(${isPlayingCassette ? 24 : 4}deg)` : "rotate(-20deg)",
                  }}
                >
                  <div className="absolute -bottom-2 -left-[11px] h-3 w-8 rounded-sm bg-zinc-900" />
                </div>
                <div className="absolute bottom-3 right-4 h-10 w-10 rounded-full border border-black/40 bg-gradient-to-br from-[#2f2f35] to-black shadow-inner" />
              </div>

              <div className="mt-3">
                <p className="truncate text-sm font-semibold text-amber-100">
                  {activeCassette ? activeCassette.title : "Выберите трек из списка"}
                </p>
                <p className="mt-0.5 text-xs text-amber-200/75">
                  {isCassetteBuffering
                    ? "Буферизация..."
                    : isPlayingCassette
                      ? "Сейчас играет"
                      : activeCassette
                        ? "Пауза"
                        : "Ожидание"}
                  {activeCassette ? ` · ${formatDuration(activeCassette.duration_sec)}` : ""}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/35">
                  <div
                    className="h-full rounded-full bg-amber-300 transition-[width] duration-200"
                    style={{ width: `${Math.round(trackProgressRatio * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => switchCassette(-1)}
                  className="rounded-md border border-amber-700/50 bg-black/25 px-2 py-2 hover:bg-amber-500/15"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={toggleCassettePlayback}
                  className="rounded-md border border-amber-300/60 bg-amber-500/20 px-2 py-2 font-semibold text-amber-100 hover:bg-amber-500/30"
                >
                  {isPlayingCassette ? "Пауза" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={() => switchCassette(1)}
                  className="rounded-md border border-amber-700/50 bg-black/25 px-2 py-2 hover:bg-amber-500/15"
                >
                  Вперёд
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                  Master
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={masterVolume}
                    onChange={(event) => setMasterVolume(Number(event.target.value))}
                    className="mt-1 w-full accent-amber-400"
                  />
                  <span className="text-[10px] text-amber-100/70">{masterVolume}%</span>
                </label>
                <label className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                  Speaker
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={speakerVolume}
                    onChange={(event) => setSpeakerVolume(Number(event.target.value))}
                    className="mt-1 w-full accent-amber-400"
                  />
                  <span className="text-[10px] text-amber-100/70">{speakerVolume}%</span>
                </label>
              </div>

              <audio ref={audioRef} preload="metadata" className="hidden" />
            </div>

            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
              {[...state.cassettes].reverse().map((cassette) => {
                const isActive = cassette.id === activeCassetteId;
                return (
                  <button
                    key={cassette.id}
                    type="button"
                    onClick={() => cueCassette(cassette.id, true)}
                    className={`flex w-full items-center justify-between rounded-md border px-2 py-2 text-left ${
                      isActive
                        ? "border-amber-300/60 bg-amber-500/20"
                        : "border-amber-700/40 bg-black/25 hover:bg-amber-500/10"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-amber-100">{cassette.title}</span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-amber-300/70">
                        {cassette.source_kind === "link" ? "Apple link" : "Файл"} · {formatDuration(cassette.duration_sec)}
                      </span>
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-amber-200/70">
                      {isActive && isPlayingCassette ? "Играет" : "Поставить"}
                    </span>
                  </button>
                );
              })}

              {!state.cassettes.length ? (
                <p className="rounded-md border border-dashed border-amber-700/40 px-2 py-2 text-xs text-amber-200/70">
                  Добавьте первый трек, и пластинка появится в проигрывателе.
                </p>
              ) : null}
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-amber-700/30 bg-black/20 p-3">
            <button
              type="button"
              onClick={triggerExport}
              disabled={exporting}
              className="w-full rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-300 disabled:opacity-60"
            >
              {exporting ? "Формирую PNG 8K + PDF A3..." : "Экспортировать доску"}
            </button>

            {state.exports.length ? (
              <div className="mt-3 space-y-2 text-xs">
                {state.exports.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-md border border-amber-700/30 p-2">
                    <p className="text-amber-100/80">
                      {format(new Date(item.created_at), "d MMM HH:mm", { locale: ru })} · {item.status}
                    </p>
                    <div className="mt-1 flex gap-3">
                      <a href={item.png_url} target="_blank" rel="noreferrer" className="text-emerald-300 underline">
                        PNG
                      </a>
                      <a href={item.pdf_url} target="_blank" rel="noreferrer" className="text-emerald-300 underline">
                        PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {savingLayout ? <p className="mt-2 text-xs text-amber-200/70">Сохраняю раскладку...</p> : null}
        </aside>

        <section className="min-h-[80vh] rounded-2xl border border-amber-700/30 bg-[#2a1c14] p-4">
          <div
            ref={boardRef}
            className="relative min-h-[1200px] overflow-hidden rounded-xl border border-amber-700/20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 0%, rgba(255,205,112,0.11), transparent 42%), repeating-linear-gradient(45deg, rgba(102,66,42,0.35) 0 8px, rgba(115,76,48,0.28) 8px 16px)",
              backgroundColor: "#5a3c2a",
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay">
              <div className="h-full w-full" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.95\" numOctaves=\"3\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.4\"/></svg>')" }} />
            </div>

            <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-24 select-none">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 28"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="garland-wire-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path
                  d={garlandWirePath}
                  fill="none"
                  stroke="#241b16"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={garlandWirePath}
                  fill="none"
                  stroke="url(#garland-wire-highlight)"
                  strokeWidth="0.38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(0 -0.45)"
                />
              </svg>

              {garlandBulbs.map((bulb) => (
                <div key={`lamp-${bulb.index}`} className="absolute top-0" style={{ left: `calc(${bulb.leftPct}% - 7px)` }}>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/35 blur-[3px]"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength + bulb.bulbHeight + 2}px`,
                      width: `${bulb.bulbWidth + 7}px`,
                      height: "4px",
                    }}
                  />
                  <div
                    className="absolute left-1/2 w-[1.5px] -translate-x-1/2 bg-[#2f2620]"
                    style={{ top: `${bulb.wireY}px`, height: `${bulb.dropLength}px` }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-[3px] border border-black/35"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength - 1}px`,
                      width: "9px",
                      height: "7px",
                      background: "linear-gradient(180deg, #3d312a 0%, #2a201a 65%, #211914 100%)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 1px 2px rgba(0,0,0,0.35)",
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength + 3}px`,
                      width: `${bulb.glowSize}px`,
                      height: `${Math.round(bulb.glowSize * 0.82)}px`,
                      background:
                        "radial-gradient(ellipse at center, rgba(255,209,130,0.45) 0%, rgba(255,180,82,0.18) 45%, rgba(255,140,40,0) 78%)",
                      filter: "blur(2px)",
                      animation: `garlandHalo ${bulb.pulseDuration + 0.6}s ease-in-out ${bulb.delay}s infinite`,
                      opacity: 0.9,
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-[999px_999px_70%_70%] border border-amber-100/35"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength + 2}px`,
                      width: `${bulb.bulbWidth}px`,
                      height: `${bulb.bulbHeight}px`,
                      background: `radial-gradient(circle at 48% 28%, rgba(255,255,245,0.95) 0%, rgba(255,235,178,0.9) 30%, hsl(${38 + bulb.warmShift} 94% 58%) 70%, hsl(${30 + bulb.warmShift} 90% 45%) 100%)`,
                      boxShadow:
                        "0 0 16px rgba(255,184,84,0.55), 0 2px 3px rgba(0,0,0,0.28), inset -1px -2px 4px rgba(138,68,20,0.42), inset 1px 1px 3px rgba(255,255,255,0.4)",
                      animation: `garlandBulbGlow ${bulb.pulseDuration}s ease-in-out ${bulb.delay}s infinite, garlandBulbFlicker ${bulb.flickerDuration}s steps(1,end) ${bulb.delay}s infinite`,
                      transformOrigin: "50% 15%",
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/55"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength + 4}px`,
                      width: `${Math.max(2, Math.round(bulb.bulbWidth * 0.34))}px`,
                      height: "2px",
                      filter: "blur(0.2px)",
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: `${bulb.wireY + bulb.dropLength + 7}px`,
                      width: "1px",
                      height: `${Math.max(3, Math.round(bulb.bulbHeight * 0.35))}px`,
                      background: "linear-gradient(180deg, rgba(255,248,220,0.96), rgba(255,208,122,0.72))",
                      boxShadow: "0 0 2px rgba(255,220,145,0.8)",
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
                      <div className="absolute -top-3 left-1/2 z-10 h-6 w-5 -translate-x-1/2 rounded-t bg-amber-700 shadow">
                        <div className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500" />
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
                      <div className="grid h-24 w-24 place-items-center" title={sticker.name}>
                        {sticker.image_url ? (
                          <img
                            src={sticker.image_url}
                            alt={sticker.name}
                            className="h-20 w-20 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.48)]"
                            loading="lazy"
                            style={{ filter: "saturate(0.84) contrast(1.05)" }}
                          />
                        ) : (
                          <div
                            className="grid h-20 w-20 place-items-center rounded-xl border border-amber-200/20 text-4xl shadow-[0_9px_16px_rgba(0,0,0,0.35)]"
                            style={{ backgroundColor: `${sticker.color}88` }}
                          >
                            {sticker.emoji || "✨"}
                          </div>
                        )}
                      </div>
                    </DraggableCard>
                  );
                })}

            </DndContext>
          </div>

          <div className="mt-3 rounded-lg border border-amber-700/35 bg-[#1d130f]/65 p-2">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-amber-300/70">
              Приклеить на доску ({filteredStickers.length})
            </p>
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredStickers.map((sticker) => (
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
                    className="flex items-center gap-1.5 rounded-md border border-amber-600/50 bg-black/25 px-2 py-1 text-xs hover:bg-amber-500/20"
                  >
                    {sticker.image_url ? (
                      <img
                        src={sticker.image_url}
                        alt={sticker.name}
                        className="h-5 w-5 object-contain"
                        loading="lazy"
                        style={{ filter: "saturate(0.84) contrast(1.06)" }}
                      />
                    ) : (
                      <span>{sticker.emoji || "✨"}</span>
                    )}
                    <span>{sticker.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {modalEntry && selectedPhoto ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4" onClick={() => setModalEntry(null)}>
          <div
            className="max-w-2xl rounded-2xl border border-amber-500/30 bg-[#18100c] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-amber-300/70">Подпись дня</p>
                <h3 className="text-xl text-amber-100">
                  {format(new Date(modalEntry.date), "d MMMM yyyy", { locale: ru })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalEntry(null)}
                className="rounded-md border border-amber-600/50 px-3 py-1 text-xs hover:bg-amber-500/20"
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
                className="rounded-md border border-amber-600/50 px-3 py-1 text-xs hover:bg-amber-500/20"
              >
                Назад
              </button>
              <p className="text-sm text-amber-100/85">
                {modalEntry.main_event || "Без заголовка"}
                {modalEntry.description ? ` — ${modalEntry.description}` : ""}
              </p>
              <button
                type="button"
                onClick={() => setModalPhotoIndex((prev) => (prev + 1) % modalEntry.photos.length)}
                className="rounded-md border border-amber-600/50 px-3 py-1 text-xs hover:bg-amber-500/20"
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes garlandBulbGlow {
          0%,
          100% {
            opacity: 0.84;
            transform: translateX(-50%) scale(0.96);
          }
          25% {
            opacity: 0.96;
            transform: translateX(-50%) scale(1);
          }
          58% {
            opacity: 1;
            transform: translateX(-50%) scale(1.04);
          }
          78% {
            opacity: 0.9;
            transform: translateX(-50%) scale(0.99);
          }
        }

        @keyframes garlandBulbFlicker {
          0%,
          88%,
          100% {
            filter: brightness(1) saturate(1);
          }
          89% {
            filter: brightness(0.88) saturate(0.9);
          }
          90% {
            filter: brightness(1.06) saturate(1.08);
          }
          91% {
            filter: brightness(0.92) saturate(0.97);
          }
        }

        @keyframes garlandHalo {
          0%,
          100% {
            opacity: 0.66;
            transform: translateX(-50%) scale(0.92);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.12);
          }
        }

        @keyframes recordSpin {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes vinylDrop {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-18px) scale(0.92);
          }
          70% {
            opacity: 1;
            transform: translateX(-50%) translateY(1px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
