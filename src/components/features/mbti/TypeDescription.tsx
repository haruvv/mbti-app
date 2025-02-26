import React from "react";
import { MBTITypeKey, typeDescriptions } from "@/app/data/mbtiTypes";
import { MBTITypeDescription } from "@/app/data/mbtiTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TypeDescriptionProps {
  type: MBTITypeKey;
  typeData: MBTITypeDescription;
  mbtiType: string;
}

export function TypeDescription({
  type,
  typeData,
  mbtiType,
}: TypeDescriptionProps) {
  if (!typeData) {
    return <div>タイプ情報が見つかりません</div>;
  }

  return (
    <Card className="bg-white border-none shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="font-bold text-indigo-600">{mbtiType}</span>
          <span className="text-gray-800">{typeData.title}</span>
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          {typeData.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-5">
          <section>
            <h3 className="font-semibold text-gray-800 mb-2">特徴</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {typeData.traits.map((trait, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-600">{trait}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">長所</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {typeData.strengths.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">{strength}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">課題</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {typeData.weaknesses.map((weakness, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-amber-500 mr-2">!</span>
                  <span className="text-gray-600">{weakness}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">アドバイス</h3>
            <p className="text-gray-600">{typeData.advice}</p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">向いている職業</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {typeData.careers.map((career, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-500 mr-2">⚙️</span>
                  <span className="text-gray-600">{career}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">
              同じタイプの有名人
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {typeData.famousPeople.map((person, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-500 mr-2">★</span>
                  <span className="text-gray-600">{person}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
