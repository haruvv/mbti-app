import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 保護したいルートを定義
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
// 公開ルートを定義
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// 基本的な保護を適用するミドルウェア
export default clerkMiddleware(async (auth, req) => {
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
