import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/verify"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isLoggedIn = !!accessToken && accessToken.trim() !== "";

  // Nếu accessToken tồn tại nhưng rỗng, xóa cookie và cho vào login
  if (accessToken === "") {
    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    return response;
  }

  // Nếu chưa login, chỉ cho vào đúng các path public (so sánh tuyệt đối)
  if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đã login, không cho vào đúng các path public nữa (so sánh tuyệt đối)
  // Sửa: KHÔNG redirect về /drive nếu accessToken chỉ tồn tại, chỉ cho phép vào /drive nếu token thực sự hợp lệ (để client tự xử lý)
  // => Cho phép vào /login kể cả khi có accessToken, tránh vòng lặp 307

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
