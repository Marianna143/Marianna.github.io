import { NextResponse } from "next/server";
import { hasSupabaseClientEnv } from "@/lib/supabase/env";

export async function GET() {
  return NextResponse.json({ configured: hasSupabaseClientEnv() });
}
