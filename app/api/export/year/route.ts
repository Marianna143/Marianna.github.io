import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { assertBoardOwnership, getAuthenticatedUser, getDatabaseClient } from "@/lib/memory-board/server";

type RequestBody = {
  boardId: string;
  year: number;
  pngDataUrl: string;
};

function decodeDataUrl(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) {
    throw new Error("Invalid data URL");
  }

  const base64 = dataUrl.slice(comma + 1);
  return Buffer.from(base64, "base64");
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.boardId || !body?.pngDataUrl || !body?.year) {
    return NextResponse.json({ error: "boardId, year and pngDataUrl are required" }, { status: 400 });
  }

  try {
    const board = await assertBoardOwnership(body.boardId, user);
    const db = await getDatabaseClient();

    const pngBytes = decodeDataUrl(body.pngDataUrl);
    const exportId = randomUUID();
    const pngPath = `${user.id}/${board.year}/${exportId}.png`;
    const pdfPath = `${user.id}/${board.year}/${exportId}.pdf`;

    const { error: pngError } = await db.storage.from("memory-exports").upload(pngPath, pngBytes, {
      contentType: "image/png",
      upsert: false,
    });

    if (pngError) {
      throw pngError;
    }

    const pdf = await PDFDocument.create();
    const pngImage = await pdf.embedPng(pngBytes);

    // A3 landscape in points
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

    const pdfBytes = Buffer.from(await pdf.save());

    const { error: pdfError } = await db.storage.from("memory-exports").upload(pdfPath, pdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

    if (pdfError) {
      throw pdfError;
    }

    const { data: createdExport, error: exportError } = await db
      .from("exports")
      .insert({
        board_id: board.id,
        year: body.year,
        png_path: pngPath,
        pdf_path: pdfPath,
        status: "completed",
      })
      .select("id")
      .single();

    if (exportError || !createdExport) {
      throw exportError ?? new Error("Failed to record export");
    }

    return NextResponse.json({ ok: true, exportId: createdExport.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
