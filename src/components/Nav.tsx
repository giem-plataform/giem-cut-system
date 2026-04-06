"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/track", label: "Track", icon: "📝" },
  { href: "/meals", label: "Meals", icon: "🍽" },
  { href: "/guide", label: "Guía", icon: "📖" },
  { href: "/weekly", label: "Stats", icon: "📊" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {links.map((l) => {
          const active = path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                active ? "text-brand-500" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="text-lg">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
