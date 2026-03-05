const supabaseUrlKeys = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL", "SUPABASE_PROJECT_URL"] as const;
const supabaseAnonKeyKeys = ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"] as const;
const supabaseServiceRoleKeys = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY"] as const;

function readFirstEnv(keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  return null;
}

function formatKeyList(keys: readonly string[]): string {
  return keys.join(" or ");
}

export function tryGetSupabaseClientEnv() {
  const url = readFirstEnv(supabaseUrlKeys);
  const anonKey = readFirstEnv(supabaseAnonKeyKeys);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseClientEnv() {
  return Boolean(tryGetSupabaseClientEnv());
}

export function getSupabaseClientEnv() {
  const env = tryGetSupabaseClientEnv();
  if (!env) {
    throw new Error(
      `Missing environment variables: ${formatKeyList(supabaseUrlKeys)} and ${formatKeyList(supabaseAnonKeyKeys)}`,
    );
  }

  return env;
}

export function hasSupabaseServiceRoleEnv() {
  return Boolean(readFirstEnv(supabaseServiceRoleKeys));
}

export function tryGetSupabaseServiceEnv() {
  const clientEnv = tryGetSupabaseClientEnv();
  const serviceRoleKey = readFirstEnv(supabaseServiceRoleKeys);

  if (!clientEnv || !serviceRoleKey) {
    return null;
  }

  return {
    url: clientEnv.url,
    serviceRoleKey,
  };
}

export function getSupabaseServiceEnv() {
  const env = tryGetSupabaseServiceEnv();
  if (!env) {
    throw new Error(`Missing environment variable: ${formatKeyList(supabaseServiceRoleKeys)}`);
  }

  return env;
}
