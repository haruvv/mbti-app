import { typeDescriptions } from "@/app/data/mbtiTypes";

type Props = {
  type: string;
  className?: string;
};

export default function MBTITypeDisplay({ type, className = "" }: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-3">
        {type.split("").map((letter, index) => (
          <div
            key={index}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold"
          >
            {letter}
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">
          {typeDescriptions[type as keyof typeof typeDescriptions].title}
        </h3>
        <p className="mt-2 text-gray-600">
          {typeDescriptions[type as keyof typeof typeDescriptions].description}
        </p>
      </div>
    </div>
  );
}
