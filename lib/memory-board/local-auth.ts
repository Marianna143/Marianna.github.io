export const MEMORY_OWNER_EMAIL = "mim2178023@gmail.com";
export const MEMORY_TEST_ACCOUNT = {
  userId: "local-user-test",
  email: "memory.test@marianna.local",
  password: "MemoryTest7890",
  displayName: "Memory Test",
} as const;

export function normalizeLocalEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isAllowedLocalEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const normalizedEmail = normalizeLocalEmail(email);
  return normalizedEmail === MEMORY_OWNER_EMAIL || normalizedEmail === MEMORY_TEST_ACCOUNT.email;
}
