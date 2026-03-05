import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { MemoryDayEntry, MemoryEntryPhoto } from "@/lib/memory-board/types";

export function formatPhotoDate(date: string) {
  return format(new Date(date), "d MMM yyyy", { locale: ru });
}

export function toIsoDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "yyyy-MM-dd");
}

export function buildPhotoboothPhotos(entry: MemoryDayEntry): MemoryEntryPhoto[] {
  return [...entry.photos].sort((a, b) => a.sort_order - b.sort_order);
}

export function getEntryCoverPhoto(entry: MemoryDayEntry): MemoryEntryPhoto | null {
  if (!entry.photos.length) return null;
  return entry.photos.find((photo) => photo.is_featured) ?? entry.photos[0];
}

export function chunkBy<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function randomTilt(seed: string) {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((hash % 12) - 6) * 0.8;
}
