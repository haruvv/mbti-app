import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 数値を適切にフォーマットする関数
function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 10000) {
    // 1,000以上10,000未満: 100の位で四捨五入
    const rounded = Math.ceil(num / 100) * 100;
    return `${(rounded / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  } else {
    // 10,000以上: 1,000の位で四捨五入
    const rounded = Math.ceil(num / 1000) * 1000;
    return `${Math.floor(rounded / 1000)}k+`;
  }
}

export async function GET() {
  try {
    const supabase = createClient();

    // ユーザー数を取得
    const { count: userCount, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // 診断数を取得
    const { count: testCount, error: testError } = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true });

    if (userError || testError) {
      console.error("Error fetching stats:", userError || testError);
      return NextResponse.json(
        { error: "統計情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      userCount: userCount || 0,
      formattedUserCount: formatNumber(userCount || 0),
      testCount: testCount || 0,
      formattedTestCount: formatNumber(testCount || 0),
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
