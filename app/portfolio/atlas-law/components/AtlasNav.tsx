import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const atlasLinks = [
  { href: "/portfolio/atlas-law", label: "Главная" },
  { href: "/portfolio/atlas-law/praktika", label: "Практики" },
  { href: "/portfolio/atlas-law/komanda", label: "Команда" },
  { href: "/portfolio/atlas-law/kontakty", label: "Контакты" },
];

export default function AtlasNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d7b37a]/25 bg-[#090b11]/86 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#f0e5d2]/75 hover:text-[#f0e5d2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в портфолио
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {atlasLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full border border-[#d7b37a]/35 text-xs tracking-[0.18em] uppercase text-[#f0e5d2]/88 hover:bg-[#d7b37a] hover:text-[#151515] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
