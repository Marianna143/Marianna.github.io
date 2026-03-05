"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { getEntryCoverPhoto } from "@/lib/memory-board/helpers";
import type { MemoryBoardState } from "@/lib/memory-board/types";

export default function ExportRenderBoard({ year }: { year: number }) {
  const [state, setState] = useState<MemoryBoardState | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/memory/state?year=${year}`, { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as MemoryBoardState;
      setState(payload);
    }

    void load();
  }, [year]);

  const cards = useMemo(() => {
    if (!state) return [];

    return state.entries
      .map((entry) => {
        const cover = getEntryCoverPhoto(entry);
        if (!cover) return null;
        return { entry, cover };
      })
      .filter((item): item is { entry: MemoryBoardState["entries"][number]; cover: MemoryBoardState["entries"][number]["photos"][number] } => item !== null);
  }, [state]);

  return (
    <main className="min-h-screen bg-[#2a1c14] p-6 text-white">
      <div className="mx-auto grid max-w-[2000px] grid-cols-8 gap-4">
        {cards.map((card) => (
          <article key={card.entry.id} className="rounded-sm bg-white p-2 pb-7 text-black">
            <img src={card.cover.url} alt={card.entry.main_event || "Фото"} className="h-36 w-full object-cover" />
            <p className="font-handwriting mt-2 text-center text-sm text-zinc-700">
              {format(new Date(card.entry.date), "d MMM yyyy", { locale: ru })}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
