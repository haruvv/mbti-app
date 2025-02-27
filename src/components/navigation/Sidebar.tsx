import { BarChart3 } from "lucide-react";

export function Sidebar() {
  const menuItems = [
    {
      href: "/ranking",
      label: "ランキング",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];
}
