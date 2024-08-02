import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("next-auth.session-token");
  if (!currentUser) {
    if (request.nextUrl.pathname.includes("/api/")) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    } else if (!request.nextUrl.pathname.includes("/login")) {
      return Response.redirect(new URL("/login", request.url));
    }
  } else {
    if (request.nextUrl.pathname.includes("/login")) {
      return Response.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/movie",
    "/movie/:type*",
    "/api/movies",
    "/api/movies/:id*",
  ],
};
