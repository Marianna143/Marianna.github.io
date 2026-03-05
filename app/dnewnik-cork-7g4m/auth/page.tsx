"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function MemoryAuthPage() {
  const router = useRouter();

  const [nextPath, setNextPath] = useState("/dnewnik-cork-7g4m");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setNextPath(next);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setError("Supabase ENV не настроен на проде. Добавьте переменные в Vercel Project Settings → Environment Variables.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "sign-in") {
        const supabase = getSupabaseBrowserClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push(nextPath);
        router.refresh();
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim() || null,
          },
          emailRedirectTo: `${window.location.origin}/dnewnik-cork-7g4m`,
        },
      });

      if (signUpError) throw signUpError;
      setMessage("Аккаунт создан. Если подтверждение по email включено, подтвердите почту и войдите.");
      setMode("sign-in");
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Ошибка авторизации";
      setError(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0a07] px-6 py-10 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-amber-700/30 bg-black/35 p-7 backdrop-blur-sm">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-300/70">Секретная страница</p>
        <h1 className="mb-6 text-3xl font-semibold text-amber-100">Дневник Воспоминаний</h1>

        {!isSupabaseConfigured ? (
          <div className="mb-4 rounded-xl border border-rose-400/40 bg-rose-900/25 p-3 text-sm text-rose-200">
            Supabase ENV пока не настроен на проде.
          </div>
        ) : null}

        <div className="mb-6 flex gap-2 rounded-xl border border-amber-700/40 bg-[#1d130d] p-1">
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-sm ${mode === "sign-in" ? "bg-amber-600 text-black" : "text-amber-100/70"}`}
            onClick={() => setMode("sign-in")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-sm ${mode === "sign-up" ? "bg-amber-600 text-black" : "text-amber-100/70"}`}
            onClick={() => setMode("sign-up")}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "sign-up" ? (
            <label className="block text-sm text-amber-100/85">
              Имя
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-amber-700/50 bg-[#140d09] px-3 py-2 text-amber-50 outline-none focus:border-amber-400"
                placeholder="Как вас подписать"
              />
            </label>
          ) : null}

          <label className="block text-sm text-amber-100/85">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-amber-700/50 bg-[#140d09] px-3 py-2 text-amber-50 outline-none focus:border-amber-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-amber-100/85">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-amber-700/50 bg-[#140d09] px-3 py-2 text-amber-50 outline-none focus:border-amber-400"
              placeholder="Минимум 6 символов"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Подождите..." : mode === "sign-in" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </main>
  );
}
