import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import exifr from "exifr";
import { assertBoardOwnership, getAuthenticatedUser, getPublicFileUrl, getServiceClient } from "@/lib/memory-board/server";

const MAX_PHOTO_SIZE = 20 * 1024 * 1024;

function guessExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "jpg";
  return fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
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

  if (file.size > MAX_PHOTO_SIZE) {
    return NextResponse.json({ error: "Фото больше 20 MB" }, { status: 413 });
  }

  try {
    await assertBoardOwnership(boardId, user);

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await exifr.parse(buffer, {
      pick: ["DateTimeOriginal", "CreateDate", "ModifyDate", "ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight"],
    });

    const takenDate =
      metadata?.DateTimeOriginal ?? metadata?.CreateDate ?? metadata?.ModifyDate ?? null;

    const takenAt = takenDate instanceof Date ? takenDate.toISOString() : null;
    const width = metadata?.ExifImageWidth ?? metadata?.ImageWidth ?? null;
    const height = metadata?.ExifImageHeight ?? metadata?.ImageHeight ?? null;

    const ext = guessExtension(file.name);
    const storagePath = `${user.id}/${Date.now()}-${randomUUID()}.${ext}`;

    const service = getServiceClient();
    const { error: uploadError } = await service.storage
      .from("memory-photos")
      .upload(storagePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    return NextResponse.json({
      storagePath,
      url: getPublicFileUrl("memory-photos", storagePath),
      takenAt,
      width,
      height,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
