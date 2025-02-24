import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient-x">
      <div className="max-w-2xl w-full text-center space-y-8 glass-effect p-8 rounded-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            パーソナリティ診断
          </h1>
          <p className="text-xl text-gray-600">
            60の質問で分かる、あなたらしさの本質
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">
            ✨ 約10分で完了
            <br />
            🎯 16タイプの性格診断
            <br />
            📊 詳細な分析結果
          </p>

          <a
            href="/test"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            無料で診断を始める
          </a>
        </div>
      </div>
    </div>
  );
}
