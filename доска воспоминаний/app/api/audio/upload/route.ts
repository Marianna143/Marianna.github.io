import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { assertBoardOwnership, getAuthenticatedUser, getServiceClient } from "@/lib/memory-board/server";

const MAX_AUDIO_SIZE = 30 * 1024 * 1024;

function guessExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "mp3";
  return fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || "mp3";
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const boardId = String(form.get("boardId") || "");
  const file = form.get("file");

  if (!boardId) {
    return NextResponse.json({ error: "boardId is required" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.type.startsWith("audio/")) {
    return NextResponse.json({ error: "Нужен аудиофайл" }, { status: 400 });
  }

  if (file.size > MAX_AUDIO_SIZE) {
    return NextResponse.json({ error: "Аудио больше 30 MB" }, { status: 413 });
  }

  try {
    await assertBoardOwnership(boardId, user);

    const ext = guessExtension(file.name);
    const storagePath = `${user.id}/${Date.now()}-${randomUUID()}.${ext}`;

    const service = getServiceClient();
    const { error: uploadError } = await service.storage
      .from("memory-audio")
      .upload(storagePath, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type || "audio/mpeg",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    return NextResponse.json({
      storagePath,
      durationSec: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
