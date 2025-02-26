import Link from "next/link";

type Tab = {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
};

export function Tabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              tab.isActive
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
