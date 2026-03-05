import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const HIDDEN_ROUTE = "/dnewnik-cork-7g4m";
const AUTH_ROUTE = "/dnewnik-cork-7g4m/auth";

type LocalSession = {
  userId: string;
  email: string;
};

function hasValidLocalSession(request: NextRequest) {
  const rawValue = request.cookies.get("memory_local_session")?.value;

  if (!rawValue) {
    return false;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as LocalSession;
    return Boolean(parsed?.userId && parsed?.email);
  } catch {
    return false;
  }
}

function resolveSafeNextPath(pathname: string | null) {
  if (!pathname || !pathname.startsWith("/")) {
    return HIDDEN_ROUTE;
  }

  return pathname;
}

export async function middleware(request: NextRequest) {
  const { response, user, isConfigured } = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  if (!isConfigured) {
    const hasLocalSession = hasValidLocalSession(request);

    if (pathname.startsWith(AUTH_ROUTE) && hasLocalSession) {
      const nextPath = resolveSafeNextPath(request.nextUrl.searchParams.get("next"));
      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    if (pathname.startsWith(HIDDEN_ROUTE) && !pathname.startsWith(AUTH_ROUTE) && !hasLocalSession) {
      const url = new URL(AUTH_ROUTE, request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    return response;
  }

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
  matcher: ["/dnewnik-cork-7g4m/:path*", "/dnewnik/:path*"],
};
