"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAllowedLocalEmail,
  MEMORY_OWNER_EMAIL,
  MEMORY_TEST_ACCOUNT,
  normalizeLocalEmail,
} from "@/lib/memory-board/local-auth";
import { deleteBoardStatesForUsers } from "@/lib/memory-board/local-store";

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
const LEGACY_BOARD_PREFIXES = ["memory-board-local-v1", "memory-board-local-v2"];

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

function clearLocalSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  document.cookie = `${LOCAL_SESSION_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
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

function removeLegacyBoardStorage(userIds: string[]) {
  if (!userIds.length) {
    return;
  }

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (!key) {
      continue;
    }

    const shouldDelete = userIds.some((userId) =>
      LEGACY_BOARD_PREFIXES.some((prefix) => key.startsWith(`${prefix}:${userId}:`)),
    );

    if (shouldDelete) {
      localStorage.removeItem(key);
    }
  }
}

function enforceManagedAccounts() {
  const accounts = readLocalAccounts();
  const removedUserIds = new Set<string>();

  let ownerAccount: LocalAccount | null = null;
  let testAccount: LocalAccount | null = null;

  for (const account of accounts) {
    const normalizedEmail = normalizeLocalEmail(account.email);

    if (normalizedEmail === MEMORY_OWNER_EMAIL) {
      if (!ownerAccount) {
        ownerAccount = {
          ...account,
          email: normalizedEmail,
          displayName: account.displayName ?? "",
        };
      } else {
        removedUserIds.add(account.userId);
      }
      continue;
    }

    if (normalizedEmail === MEMORY_TEST_ACCOUNT.email) {
      if (!testAccount) {
        testAccount = {
          ...account,
          email: MEMORY_TEST_ACCOUNT.email,
          displayName: MEMORY_TEST_ACCOUNT.displayName,
          password: MEMORY_TEST_ACCOUNT.password,
        };
      } else {
        removedUserIds.add(account.userId);
      }
      continue;
    }

    removedUserIds.add(account.userId);
  }

  if (testAccount && testAccount.userId !== MEMORY_TEST_ACCOUNT.userId) {
    removedUserIds.add(testAccount.userId);
    testAccount = {
      ...testAccount,
      userId: MEMORY_TEST_ACCOUNT.userId,
    };
  }

  if (!testAccount) {
    testAccount = {
      userId: MEMORY_TEST_ACCOUNT.userId,
      email: MEMORY_TEST_ACCOUNT.email,
      password: MEMORY_TEST_ACCOUNT.password,
      displayName: MEMORY_TEST_ACCOUNT.displayName,
      createdAt: new Date().toISOString(),
    };
  }

  const nextAccounts = ownerAccount ? [ownerAccount, testAccount] : [testAccount];
  const keepUserIds = new Set(nextAccounts.map((account) => account.userId));
  const removed = [...removedUserIds].filter((userId) => !keepUserIds.has(userId));

  writeLocalAccounts(nextAccounts);
  removeLegacyBoardStorage(removed);

  if (removed.length > 0) {
    void deleteBoardStatesForUsers(removed).catch(() => {
      return;
    });
  }

  return nextAccounts;
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

    const accounts = enforceManagedAccounts();
    const session = readLocalSession();

    if (!session) {
      return;
    }

    const normalizedSessionEmail = normalizeLocalEmail(session.email);
    const matchesAccount = accounts.some(
      (account) => account.userId === session.userId && normalizeLocalEmail(account.email) === normalizedSessionEmail,
    );

    if (!isAllowedLocalEmail(normalizedSessionEmail) || !matchesAccount) {
      clearLocalSession();
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }, [isConfigured, nextPath, router]);

  async function handleLocalAuth() {
    const normalizedEmail = normalizeLocalEmail(email);
    const trimmedName = displayName.trim();

    if (!normalizedEmail || !password) {
      throw new Error("Email и пароль обязательны");
    }

    if (!isAllowedLocalEmail(normalizedEmail)) {
      throw new Error("Доступ только для владельца и тестового аккаунта");
    }

    const accounts = enforceManagedAccounts();

    if (mode === "sign-in") {
      const account = accounts.find((item) => normalizeLocalEmail(item.email) === normalizedEmail);

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

    if (normalizedEmail === MEMORY_TEST_ACCOUNT.email) {
      throw new Error("Тестовый аккаунт уже создан и закреплен для проверок");
    }

    if (password.length < 6) {
      throw new Error("Пароль должен быть минимум 6 символов");
    }

    const exists = accounts.some((item) => normalizeLocalEmail(item.email) === normalizedEmail);
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

    const normalizedAccounts = enforceManagedAccounts()
      .filter((account) => normalizeLocalEmail(account.email) !== normalizedEmail)
      .concat(newAccount);

    writeLocalAccounts(normalizedAccounts);

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
    <main className="relative min-h-screen overflow-hidden bg-[#0b0908] px-4 py-8 text-[#f3ece1] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(194,154,92,0.18),transparent_36%),radial-gradient(circle_at_86%_18%,rgba(94,78,56,0.2),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(20,17,14,0.94),rgba(11,9,8,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:58px_58px]" />

      <div className="relative mx-auto max-w-md rounded-[28px] border border-[#d2b07c]/35 bg-[#171410]/88 p-7 shadow-[0_28px_100px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-[#dbc69b]/75">Частная зона</p>
            <h1 className="text-3xl text-[#f8f1e7]">Дневник Воспоминаний</h1>
          </div>
          <span className="rounded-full border border-[#d2b07c]/30 bg-[#2b2218]/70 px-3 py-1 text-[11px] text-[#e7d6ba]">
            {mode === "sign-up" ? "Регистрация" : "Вход"}
          </span>
        </div>

        {isConfigured === false ? (
          <div className="mb-5 rounded-xl border border-[#c9ad7b]/35 bg-[#251e16]/70 px-4 py-3 text-sm text-[#e6d7be]">
            Локальный режим: храним только ваш аккаунт ({MEMORY_OWNER_EMAIL}) и один тестовый профиль.
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-[#8a7453]/45 bg-[#211b14] p-1.5">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "sign-in"
                ? "bg-[#d3b07d] text-[#2a2118] shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
                : "text-[#e9dcc8]/72 hover:bg-[#30261b]"
            }`}
            onClick={() => setMode("sign-in")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "sign-up"
                ? "bg-[#d3b07d] text-[#2a2118] shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
                : "text-[#e9dcc8]/72 hover:bg-[#30261b]"
            }`}
            onClick={() => setMode("sign-up")}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "sign-up" ? (
            <label className="block text-sm text-[#decfb7]">
              Имя
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#7f6a4e]/50 bg-[#110f0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
                placeholder="Как вас подписать"
              />
            </label>
          ) : null}

          <label className="block text-sm text-[#decfb7]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[#7f6a4e]/50 bg-[#110f0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-[#decfb7]">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-[#7f6a4e]/50 bg-[#110f0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
              placeholder="Минимум 6 символов"
            />
          </label>

          {mode === "sign-up" ? (
            <p className="rounded-lg border border-[#584734]/45 bg-[#1a1510]/80 px-3 py-2 text-xs text-[#d2bfa3]">
              Аккаунт создается в приватной зоне дневника. Доступ сохранится только за разрешенными email.
            </p>
          ) : null}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-amber-100">{message}</p> : null}

          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-[#dec193] to-[#c7a272] px-4 py-2.5 font-medium text-[#2c241b] transition hover:from-[#e3c99f] hover:to-[#d2b082] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Подождите..." : mode === "sign-in" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </main>
  );
}
