"use client";

import { useState, useEffect } from "react";

interface DebugPanelProps {
  data: Record<string, any>;
  sections?: Array<{
    title: string;
    data: any;
  }>;
}

export function DebugPanel({ data, sections = [] }: DebugPanelProps) {
  const [isClient, setIsClient] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDevelopment(process.env.NODE_ENV === "development");
  }, []);

  if (!isClient || !isDevelopment) return null;

  return (
    <div className="bg-gray-100 border-b border-gray-200 p-2 text-xs">
      <details>
        <summary className="cursor-pointer font-bold text-gray-700">
          デバッグ情報 (クリックして展開)
        </summary>
        <div className="mt-2 p-2 bg-white rounded shadow-sm overflow-auto max-h-96">
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <div key={index} className={index > 0 ? "mt-4" : ""}>
                <h3 className="font-bold mb-1">{section.title}:</h3>
                <pre className="overflow-auto">
                  {JSON.stringify(section.data, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <pre className="overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      </details>
    </div>
  );
}
