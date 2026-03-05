import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка входа";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
