import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Payload = {
  email?: string;
  password?: string;
  displayName?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Payload | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const displayName = body?.displayName?.trim() ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Пароль должен быть минимум 6 символов" }, { status: 400 });
  }

  try {
    const supabase = await getSupabaseServerClient();
    const origin = new URL(request.url).origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || null,
        },
        emailRedirectTo: `${origin}/dnewnik-cork-7g4m`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка регистрации";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
