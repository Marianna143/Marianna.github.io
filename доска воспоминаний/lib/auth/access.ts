import type { User } from "@supabase/supabase-js";

const ALLOWED_EMAILS_ENV = "MEMORY_ALLOWED_EMAILS";

let cachedRaw: string | undefined;
let cachedAllowedEmails: Set<string> | null = null;

function getAllowedEmails() {
  const raw = process.env[ALLOWED_EMAILS_ENV];
  if (cachedAllowedEmails && raw === cachedRaw) {
    return cachedAllowedEmails;
  }

  cachedRaw = raw;
  cachedAllowedEmails = new Set(
    (raw ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );

  return cachedAllowedEmails;
}

export function isEmailAllowed(email: string | null | undefined) {
  const allowedEmails = getAllowedEmails();
  if (allowedEmails.size === 0) {
    return true;
  }

  if (!email) {
    return false;
  }

  return allowedEmails.has(email.trim().toLowerCase());
}

export function isUserAllowed(user: Pick<User, "email"> | null | undefined) {
  return isEmailAllowed(user?.email);
}
