import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0 = new Auth0Client();

export async function proxy(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  // Let the Auth0 SDK handle /api/auth/* routes
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    return authResponse;
  }

  const session = await auth0.getSession(request);

  // Redirect unauthenticated users to login
  if (!session) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  return authResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
