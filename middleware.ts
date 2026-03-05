import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const HIDDEN_ROUTE = "/dnewnik-cork-7g4m";
const AUTH_ROUTE = "/dnewnik-cork-7g4m/auth";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(AUTH_ROUTE) && user) {
    return NextResponse.redirect(new URL(HIDDEN_ROUTE, request.url));
  }

  if (pathname.startsWith(HIDDEN_ROUTE) && !pathname.startsWith(AUTH_ROUTE) && !user) {
    const url = new URL(AUTH_ROUTE, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dnewnik-cork-7g4m/:path*"],
};
