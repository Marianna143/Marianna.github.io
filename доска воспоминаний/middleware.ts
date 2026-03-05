import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { isUserAllowed } from "@/lib/auth/access";

const HIDDEN_ROUTE = "/dnewnik-cork-7g4m";
const AUTH_ROUTE = "/dnewnik-cork-7g4m/auth";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;
  const userAllowed = isUserAllowed(user);

  if (pathname.startsWith(AUTH_ROUTE) && user && userAllowed) {
    return NextResponse.redirect(new URL(HIDDEN_ROUTE, request.url));
  }

  if (pathname.startsWith(HIDDEN_ROUTE) && !pathname.startsWith(AUTH_ROUTE)) {
    if (!user) {
      const url = new URL(AUTH_ROUTE, request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (!userAllowed) {
      const url = new URL(AUTH_ROUTE, request.url);
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dnewnik-cork-7g4m/:path*"],
};
