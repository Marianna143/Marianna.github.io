"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LocalAccount = {
  userId: string;
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
};

type LocalSession = {
  userId: string;
  email: string;
  displayName?: string;
};

const LOCAL_ACCOUNTS_KEY = "memory_local_accounts_v1";
const LOCAL_SESSION_KEY = "memory_local_session";
const LOCAL_SESSION_COOKIE_KEY = "memory_local_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function createLocalId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function readLocalAccounts() {
  const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
  if (!raw) {
    return [] as LocalAccount[];
  }

  try {
    const parsed = JSON.parse(raw) as LocalAccount[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => Boolean(item?.userId && item?.email && item?.password));
  } catch {
    return [];
  }
}

function writeLocalAccounts(accounts: LocalAccount[]) {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function writeLocalSession(session: LocalSession) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  const encoded = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${LOCAL_SESSION_COOKIE_KEY}=${encoded}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

function readLocalSession() {
  const raw = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as LocalSession;
    if (!parsed?.userId || !parsed?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

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
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setNextPath(next);
    }

    let active = true;

    async function checkConfig() {
      try {
        const response = await fetch("/api/memory-auth/config", { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as { configured?: boolean } | null;
        if (active) {
          setIsConfigured(Boolean(payload?.configured));
        }
      } catch {
        if (active) {
          setIsConfigured(false);
        }
      }
    }

    void checkConfig();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isConfigured !== false) {
      return;
    }

    const session = readLocalSession();
    if (!session) {
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }, [isConfigured, nextPath, router]);

  async function handleLocalAuth() {
    const normalizedEmail = normalizeEmail(email);
    const trimmedName = displayName.trim();

    if (!normalizedEmail || !password) {
      throw new Error("Email и пароль обязательны");
    }

    const accounts = readLocalAccounts();

    if (mode === "sign-in") {
      const account = accounts.find((item) => normalizeEmail(item.email) === normalizedEmail);

      if (!account || account.password !== password) {
        throw new Error("Неверный email или пароль");
      }

      writeLocalSession({
        userId: account.userId,
        email: account.email,
        displayName: account.displayName,
      });

      router.push(nextPath);
      router.refresh();
      return;
    }

    if (password.length < 6) {
      throw new Error("Пароль должен быть минимум 6 символов");
    }

    const exists = accounts.some((item) => normalizeEmail(item.email) === normalizedEmail);
    if (exists) {
      throw new Error("Аккаунт с таким email уже существует");
    }

    const newAccount: LocalAccount = {
      userId: createLocalId("local-user"),
      email: normalizedEmail,
      password,
      displayName: trimmedName,
      createdAt: new Date().toISOString(),
    };

    writeLocalAccounts([...accounts, newAccount]);
    writeLocalSession({
      userId: newAccount.userId,
      email: newAccount.email,
      displayName: newAccount.displayName,
    });

    router.push(nextPath);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isConfigured === false) {
        await handleLocalAuth();
        return;
      }

      if (isConfigured !== true) {
        throw new Error("Проверяем конфигурацию. Повторите через пару секунд.");
      }

      const endpoint = mode === "sign-in" ? "/api/memory-auth/sign-in" : "/api/memory-auth/sign-up";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Ошибка авторизации");
      }

      if (mode === "sign-in") {
        router.push(nextPath);
        router.refresh();
        return;
      }

      setMessage("Аккаунт создан. Если включено подтверждение email, подтвердите почту и войдите.");
      setMode("sign-in");
      setPassword("");
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Ошибка авторизации";
      setError(text);
    } finally {
      setLoading(false);
    }
  }

  const submitDisabled = loading || isConfigured === null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02130f] px-6 py-10 text-emerald-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(20,184,166,0.2),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(6,95,70,0.45),transparent_60%)]" />

      <div className="relative mx-auto max-w-md rounded-3xl border border-emerald-400/30 bg-[#03261f]/80 p-7 shadow-[0_24px_80px_rgba(4,35,29,0.65)] backdrop-blur-md">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-emerald-200/70">Личный вход</p>
        <h1 className="mb-6 text-3xl font-semibold text-emerald-50">Дневник Воспоминаний</h1>

        {isConfigured === false ? (
          <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-900/30 p-3 text-sm text-emerald-100">
            Локальный режим включен: данные хранятся только на этом ноутбуке (в браузере).
          </div>
        ) : null}

        <div className="mb-6 flex gap-2 rounded-xl border border-emerald-500/40 bg-[#062f26] p-1">
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-sm transition ${
              mode === "sign-in" ? "bg-emerald-400 text-emerald-950" : "text-emerald-100/75 hover:bg-emerald-500/20"
            }`}
            onClick={() => setMode("sign-in")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-sm transition ${
              mode === "sign-up" ? "bg-emerald-400 text-emerald-950" : "text-emerald-100/75 hover:bg-emerald-500/20"
            }`}
            onClick={() => setMode("sign-up")}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "sign-up" ? (
            <label className="block text-sm text-emerald-100/90">
              Имя
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-600/45 bg-[#041e18] px-3 py-2 text-emerald-50 outline-none focus:border-emerald-300"
                placeholder="Как вас подписать"
              />
            </label>
          ) : null}

          <label className="block text-sm text-emerald-100/90">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-emerald-600/45 bg-[#041e18] px-3 py-2 text-emerald-50 outline-none focus:border-emerald-300"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-emerald-100/90">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-emerald-600/45 bg-[#041e18] px-3 py-2 text-emerald-50 outline-none focus:border-emerald-300"
              placeholder="Минимум 6 символов"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-200">{message}</p> : null}

          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full rounded-xl bg-emerald-400 px-4 py-2.5 font-medium text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Подождите..." : mode === "sign-in" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </main>
  );
}
