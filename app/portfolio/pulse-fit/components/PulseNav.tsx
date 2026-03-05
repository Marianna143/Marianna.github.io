import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const pulseLinks = [
  { href: "/portfolio/pulse-fit", label: "Главная" },
  { href: "/portfolio/pulse-fit/raspisanie", label: "Расписание" },
  { href: "/portfolio/pulse-fit/abonementy", label: "Абонементы" },
  { href: "/portfolio/pulse-fit/trenery", label: "Тренеры" },
];

export default function PulseNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#2ce1b0]/24 bg-[#04070c]/84 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#e8f2ee]/74 hover:text-[#e8f2ee] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в портфолио
        </Link>
        <nav className="flex flex-wrap gap-2">
          {pulseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full border border-[#2ce1b0]/40 text-xs tracking-[0.18em] uppercase text-[#dff8ef] hover:bg-[#2ce1b0] hover:text-[#03110d] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
