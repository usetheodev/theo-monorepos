import { NextResponse } from "next/server";

export function middleware(request) {
  const start = Date.now();
  const response = NextResponse.next();

  // Request logging via headers (readable in instrumentation)
  response.headers.set("x-request-start", start.toString());
  response.headers.set("x-request-path", request.nextUrl.pathname);
  response.headers.set("x-request-method", request.method);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
