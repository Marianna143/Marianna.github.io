import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseClientEnv } from "@/lib/supabase/env";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseClientEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
