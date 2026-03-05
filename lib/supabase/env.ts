const requiredClientKeys = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

function readEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function tryGetSupabaseClientEnv() {
  const [urlKey, anonKeyKey] = requiredClientKeys;
  const url = process.env[urlKey];
  const anonKey = process.env[anonKeyKey];

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseClientEnv() {
  const env = tryGetSupabaseClientEnv();
  if (!env) {
    throw new Error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return env;
}

export function getSupabaseServiceEnv() {
  return {
    url: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}
