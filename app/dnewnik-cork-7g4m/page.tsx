import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MemoryBoardApp from "@/components/memory-board/MemoryBoardApp";
import MemoryBoardLocalApp from "@/components/memory-board/MemoryBoardLocalApp";
import { hasSupabaseClientEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type LocalSession = {
  userId: string;
  email: string;
  displayName?: string;
};

function parseLocalSession(rawValue: string | undefined): LocalSession | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as LocalSession;
    if (!parsed?.userId || !parsed?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default async function MemoryDiaryPage() {
  if (!hasSupabaseClientEnv()) {
    const cookieStore = await cookies();
    const session = parseLocalSession(cookieStore.get("memory_local_session")?.value);

    if (!session) {
      redirect("/dnewnik-cork-7g4m/auth");
    }

    return <MemoryBoardLocalApp userId={session.userId} userEmail={session.email} />;
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dnewnik-cork-7g4m/auth");
  }

  return <MemoryBoardApp userEmail={user.email ?? ""} />;
}
