import { redirect } from "next/navigation";
import MemoryBoardApp from "@/components/memory-board/MemoryBoardApp";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isUserAllowed } from "@/lib/auth/access";

export default async function MemoryDiaryPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dnewnik-cork-7g4m/auth");
  }

  if (!isUserAllowed(user)) {
    redirect("/dnewnik-cork-7g4m/auth?error=access_denied");
  }

  return <MemoryBoardApp userEmail={user.email ?? ""} />;
}
