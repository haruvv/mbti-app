import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 保護したいルートを定義
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
// 公開ルートを定義（typesを追加）
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

// リダイレクト用の関数
function handleRedirects(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /type/XXX から /types/XXX へのリダイレクト
  if (pathname.startsWith("/type/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/type/", "/types/"), req.url)
    );
  }

  return null;
}

// 基本的な保護を適用するミドルウェア
export default clerkMiddleware(async (auth, req) => {
  // リダイレクトを処理
  const redirect = handleRedirects(req);
  if (redirect) return redirect;

  // 保護されたルートの場合のみ認証を要求
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Next.jsのミドルウェアマッチャー設定
export const config = {
  matcher: [
    // 静的ファイルと_nextを除くすべてのルートに適用
    "/((?!.*\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
