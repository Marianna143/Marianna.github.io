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
    <main className="relative min-h-screen overflow-hidden bg-[#0e0c0a] px-4 py-8 text-[#f2ece2] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(198,157,99,0.16),transparent_36%),radial-gradient(circle_at_88%_20%,rgba(70,57,41,0.22),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(17,14,11,0.96),rgba(14,12,10,0.99))]" />

      <div className="relative mx-auto max-w-[430px] rounded-3xl border border-[#bfa174]/28 bg-[#16130f]/92 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.64)] backdrop-blur-md sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#5b4932]/45 pb-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-[#dcc69f]/70">Частная зона</p>
            <h1 className="text-3xl text-[#f8f1e7]">Дневник Воспоминаний</h1>
          </div>
          <span className="rounded-full border border-[#b99a6f]/35 bg-[#201912] px-3 py-1 text-[11px] text-[#ead8bc]">
            {mode === "sign-up" ? "Регистрация" : "Вход"}
          </span>
        </div>

        {isConfigured === false ? (
          <div className="mb-5 rounded-xl border border-[#b99f73]/35 bg-[#251d15]/72 px-4 py-3 text-sm text-[#e6d7bf]">
            Локальный режим: храним только ваш аккаунт ({MEMORY_OWNER_EMAIL}) и один тестовый профиль.
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-[#6f5a40]/55 bg-[#1f1913] p-1">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "sign-in"
                ? "bg-[#cfb185] text-[#2b2218] shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
                : "text-[#e7dac7]/70 hover:bg-[#2a2118]"
            }`}
            onClick={() => setMode("sign-in")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "sign-up"
                ? "bg-[#cfb185] text-[#2b2218] shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
                : "text-[#e7dac7]/70 hover:bg-[#2a2118]"
            }`}
            onClick={() => setMode("sign-up")}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "sign-up" ? (
            <label className="block text-sm text-[#ddcdb4]">
              Имя
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#6f5a40]/60 bg-[#100e0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
                placeholder="Как вас подписать"
              />
            </label>
          ) : null}

          <label className="block text-sm text-[#ddcdb4]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[#6f5a40]/60 bg-[#100e0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-[#ddcdb4]">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-[#6f5a40]/60 bg-[#100e0c] px-3 py-2.5 text-[#f4ead9] outline-none transition placeholder:text-[#8d7c66] focus:border-[#d4b483]"
              placeholder="Минимум 6 символов"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-amber-100">{message}</p> : null}

          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-[#ddc194] to-[#c7a273] px-4 py-2.5 font-medium text-[#2c241a] transition hover:from-[#e2cba3] hover:to-[#d0b082] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Подождите..." : mode === "sign-in" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </main>
  );
}
