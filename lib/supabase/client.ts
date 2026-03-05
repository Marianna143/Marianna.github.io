"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseClientEnv } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseClientEnv();
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
