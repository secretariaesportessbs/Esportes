import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

function expectedToken(): string | null {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) return null;
  return createHash("sha256").update(senha).digest("hex");
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valido = token && token === expectedToken();

  if (!valido) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
