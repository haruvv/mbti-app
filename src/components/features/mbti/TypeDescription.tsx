import React from "react";
import { MBTITypeKey, typeDescriptions } from "@/app/data/mbtiTypes";

interface TypeDescriptionProps {
  type: MBTITypeKey;
}

export function TypeDescription({ type }: TypeDescriptionProps) {
  const typeData = typeDescriptions[type];

  if (!typeData) {
    return <div>タイプ情報が見つかりません</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">{typeData.title}</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">特徴</h3>
        <p className="text-gray-700 leading-relaxed">{typeData.description}</p>
      </div>

      {typeData.strengths && typeData.strengths.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">強み</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {typeData.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {typeData.weaknesses && typeData.weaknesses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">弱み</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {typeData.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      )}

      {typeData.careers && typeData.careers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">
            キャリアの適性
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {typeData.careers.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
      )}

      {typeData.famousPeople && typeData.famousPeople.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">
            有名人・キャラクター
          </h3>
          <p className="text-gray-700">{typeData.famousPeople.join("、")}</p>
        </div>
      )}
    </div>
  );
}
