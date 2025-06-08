import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/verify"];
const PRIVATE_PATHS = ["/drive", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Nếu chưa login, chỉ cho vào các path public
  if (!accessToken && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đã login, không cho vào các path public nữa (trừ /)
  if (accessToken && PUBLIC_PATHS.includes(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/drive", request.url));
  }

  // Nếu đã login, chỉ cho vào các path private
  if (
    accessToken &&
    !PRIVATE_PATHS.some((p) => pathname.startsWith(p)) &&
    !PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/drive", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
