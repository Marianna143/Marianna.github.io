import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseClientEnv, hasSupabaseServiceRoleEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getDatabaseClient(): Promise<SupabaseClient> {
  if (hasSupabaseServiceRoleEnv()) {
    return getSupabaseServiceClient();
  }

  return getSupabaseServerClient();
}

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function getPublicFileUrl(bucket: string, path: string) {
  const { url } = getSupabaseClientEnv();
  return `${url}/storage/v1/object/public/${bucket}/${encodeStoragePath(path)}`;
}

export async function assertBoardOwnership(boardId: string, user: User, client?: SupabaseClient) {
  const db = client ?? (await getDatabaseClient());

  const { data, error } = await db
    .from("boards")
    .select("id, user_id, year, title, created_at, updated_at")
    .eq("id", boardId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Board not found or forbidden");
  }

  return data;
}
