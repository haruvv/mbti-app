import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 保護ルート（認証が必要）
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// 公開ルート（認証不要）
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/test(.*)",
  "/result(.*)",
  "/api/webhook/clerk",
  "/type(.*)",
  "/types(.*)",
]);

// リダイレクト処理
function handleRedirects(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /type/XXX → /types/XXX のリダイレクト（恒久的）
  if (pathname.startsWith("/type/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/type/", "/types/"), req.url),
      301
    );
  }

  return null;
}

// Clerk ミドルウェア
export default clerkMiddleware(async (auth, req) => {
  // リダイレクト処理
  const redirect = handleRedirects(req);
  if (redirect) return redirect;

  // 公開ルートなら認証不要
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 保護ルートなら認証を要求
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Next.js のミドルウェアマッチャー設定
export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // 静的ファイルと_nextを除外
    "/",
    "/(api|trpc)(.*)",
  ],
};
