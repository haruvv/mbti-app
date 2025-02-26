import Link from "next/link";
import Image from "next/image";
import { typeDescriptions } from "./data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { ArrowRight, Users, Brain, Medal, BookOpen } from "lucide-react";

export default function HomePage() {
  // 各グループから1つずつタイプを選んで表示
  const featuredTypes = ["INTJ", "ENFP", "ISTJ", "ESTP"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-300 blur-3xl"></div>
          <div className="absolute top-60 right-20 w-60 h-60 rounded-full bg-blue-300 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-pink-300 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6 animate-fadeIn">
                あなたの性格タイプを
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  発見しよう
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                MBTIはあなたの思考パターンや行動傾向を理解するための強力なツールです。
                自分自身を深く知り、人間関係や仕事での可能性を広げましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/test/about"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl hover:translate-y-[-2px] transform transition-transform"
                >
                  無料診断テストを受ける
                </Link>
                <Link
                  href="/explore"
                  className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors"
                >
                  タイプ一覧を見る
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full h-[400px] animated-float">
                <Image
                  src="/hero-illustration.svg"
                  alt="MBTIタイプのイラスト"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              MBTIで広がる可能性
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Brain className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">自己理解の深化</h3>
              <p className="text-gray-600">
                あなたの思考パターンや行動傾向を理解し、より良い選択をするための洞察を得られます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">人間関係の改善</h3>
              <p className="text-gray-600">
                他者の性格タイプを理解することで、コミュニケーションや対人関係をスムーズにします。
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Medal className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">強みの発見</h3>
              <p className="text-gray-600">
                あなた固有の才能や強みを認識し、それらを最大限に活かす方法を見つけられます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">成長の機会</h3>
              <p className="text-gray-600">
                自身の課題や成長すべき分野を特定し、バランスの取れた発達を促進します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 注目のMBTIタイプ */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            注目のMBTIタイプ
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            16種類の性格タイプから、それぞれのカテゴリを代表するタイプをご紹介。
            あなたはどのタイプに近いですか？
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTypes.map((type) => (
              <Link
                key={type}
                href={`/type/${type}`}
                className="transform transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <TypeCard
                      type={type}
                      title={typeDescriptions[type].title}
                    />
                    <p className="mt-4 text-gray-600 line-clamp-3">
                      {typeDescriptions[type].description}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <span className="text-indigo-600 font-medium flex items-center">
                        詳細を見る <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              すべてのタイプを見る <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* コミュニティセクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              コミュニティに参加しよう
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              同じ性格タイプの人と交流したり、異なるタイプの人から新たな視点を学んだり。
              あなたらしさを大切にしながら、多様性に満ちたコミュニティで成長しましょう。
            </p>
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              今すぐ無料登録
            </Link>
          </div>
        </div>
      </section>

      {/* 最後のCTAセクション */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            あなたの性格タイプを発見しましょう
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            たった5分の診断テストで、あなたの思考パターンや行動傾向を理解するための
            新たな洞察が得られます。
          </p>
          <Link
            href="/test/about"
            className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            無料診断テストを始める
          </Link>
        </div>
      </section>
    </div>
  );
}
