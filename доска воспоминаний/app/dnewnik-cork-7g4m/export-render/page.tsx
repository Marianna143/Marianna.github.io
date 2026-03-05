import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ExportRenderBoard from "@/components/memory-board/ExportRenderBoard";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isUserAllowed } from "@/lib/auth/access";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ExportRenderPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
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

  const params = await searchParams;
  const parsed = Number(params.year || new Date().getFullYear());
  const year = Number.isFinite(parsed) ? parsed : new Date().getFullYear();

  return <ExportRenderBoard year={year} />;
}
