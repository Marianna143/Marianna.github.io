import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const nordicLinks = [
  { href: "/portfolio/nordic-loft", label: "Главная" },
  { href: "/portfolio/nordic-loft/proekty", label: "Проекты" },
  { href: "/portfolio/nordic-loft/etapy", label: "Этапы" },
  { href: "/portfolio/nordic-loft/kontakt", label: "Контакт" },
];

export default function NordicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#c0b29a]/45 bg-[#f5f1e8]/86 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#2e2823]/68 hover:text-[#2e2823] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в портфолио
        </Link>
        <nav className="flex flex-wrap gap-2">
          {nordicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full border border-[#b9a98f]/55 text-xs tracking-[0.18em] uppercase text-[#5f523f] hover:bg-[#2e2823] hover:text-[#f5f1e8] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
