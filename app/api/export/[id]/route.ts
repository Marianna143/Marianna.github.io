import { NextResponse } from "next/server";
import { getAuthenticatedUser, getPublicFileUrl, getDatabaseClient } from "@/lib/memory-board/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Export id is required" }, { status: 400 });
  }

  const db = await getDatabaseClient();

  const { data: exportRow, error } = await db
    .from("exports")
    .select("id, board_id, year, png_path, pdf_path, status, created_at, boards!inner(id, user_id)")
    .eq("id", id)
    .eq("boards.user_id", user.id)
    .single();

  if (error || !exportRow) {
    return NextResponse.json({ error: "Export not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: exportRow.id,
    boardId: exportRow.board_id,
    year: exportRow.year,
    status: exportRow.status,
    createdAt: exportRow.created_at,
    pngUrl: getPublicFileUrl("memory-exports", exportRow.png_path),
    pdfUrl: getPublicFileUrl("memory-exports", exportRow.pdf_path),
  });
}
