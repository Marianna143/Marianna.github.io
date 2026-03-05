import type { User } from "@supabase/supabase-js";
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

export function getServiceClient() {
  return getSupabaseServiceClient();
}

export function getPublicFileUrl(bucket: string, path: string) {
  const client = getSupabaseServiceClient();
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function assertBoardOwnership(boardId: string, user: User) {
  const service = getSupabaseServiceClient();
  const { data, error } = await service
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
