import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/memory-board/server";

type RequestBody = {
  sourceUrl?: string;
};

type AppleLookupItem = {
  kind?: string;
  trackName?: string;
  artistName?: string;
  trackTimeMillis?: number;
  previewUrl?: string;
  artworkUrl100?: string;
};

type AppleLookupResponse = {
  resultCount: number;
  results: AppleLookupItem[];
};

function extractTrackId(url: URL) {
  const queryTrackId = url.searchParams.get("i");
  if (queryTrackId && /^\d+$/.test(queryTrackId)) {
    return queryTrackId;
  }

  const fromPath = url.pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .reverse()
    .find((segment) => /^\d+$/.test(segment));

  return fromPath || null;
}

function buildAppleEmbedUrl(sourceUrl: URL) {
  const embed = new URL(sourceUrl.toString());
  if (embed.hostname === "music.apple.com") {
    embed.hostname = "embed.music.apple.com";
  }
  return embed.toString();
}

function toArtwork600(url: string | undefined) {
  if (!url) return null;
  return url.replace(/\/\d+x\d+bb\./, "/600x600bb.");
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const sourceUrl = body?.sourceUrl?.trim() || "";
  if (!sourceUrl) {
    return NextResponse.json({ error: "Нужна ссылка на трек Apple Music" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    return NextResponse.json({ error: "Ссылка некорректная" }, { status: 400 });
  }

  if (parsed.hostname !== "music.apple.com") {
    return NextResponse.json({ error: "Поддерживаются только ссылки music.apple.com" }, { status: 400 });
  }

  const trackId = extractTrackId(parsed);
  if (!trackId) {
    return NextResponse.json({ error: "Не удалось определить трек в ссылке Apple Music" }, { status: 400 });
  }

  try {
    const lookup = await fetch(`https://itunes.apple.com/lookup?id=${trackId}&entity=song`, {
      cache: "no-store",
    });

    if (!lookup.ok) {
      throw new Error(`Apple lookup failed: ${lookup.status}`);
    }

    const payload = (await lookup.json()) as AppleLookupResponse;
    const song =
      payload.results.find((item) => item.kind === "song" && item.previewUrl) ||
      payload.results.find((item) => item.previewUrl);

    if (!song?.previewUrl) {
      return NextResponse.json(
        {
          error:
            "Apple не отдала предпрослушивание для этого трека. Попробуйте другой трек или загрузите файл вручную.",
        },
        { status: 422 },
      );
    }

    const titleParts = [song.trackName, song.artistName].filter(Boolean);
    const title = titleParts.join(" — ") || `Apple Music #${trackId}`;

    return NextResponse.json({
      trackId,
      title,
      artist: song.artistName || null,
      durationSec: song.trackTimeMillis ? Math.round(song.trackTimeMillis / 1000) : null,
      previewUrl: song.previewUrl,
      artworkUrl: toArtwork600(song.artworkUrl100),
      sourceUrl: parsed.toString(),
      embedUrl: buildAppleEmbedUrl(parsed),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось обработать Apple Music ссылку";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
