import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const publicPaths = ["/", "/login", "/register"];
	const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
	const token = request.cookies.get("jwt");

	if (!isPublicPath && !token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isPublicPath && token) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
