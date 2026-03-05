import Link from "next/link";
import { ArrowUpRight, Flame, Activity, Goal, TimerReset } from "lucide-react";
import PulseNav from "./components/PulseNav";

const blocks = [
  {
    title: "Ритм и энергия",
    text: "Визуал и темп страницы передают динамику бренда и быстро вовлекают посетителя.",
    icon: Flame,
  },
  {
    title: "Конверсия в запись",
    text: "Логика блоков построена вокруг одного целевого действия — записи на пробную тренировку.",
    icon: Goal,
  },
  {
    title: "Понятный выбор",
    text: "Абонементы и расписание показываются без перегруза, чтобы человек принял решение за минуты.",
    icon: Activity,
  },
  {
    title: "Быстрый запуск",
    text: "Шаблон легко адаптируется под конкретный клуб и актуальные программы.",
    icon: TimerReset,
  },
];

export default function PulseFitPage() {
  return (
    <main className="min-h-screen bg-[#04070c] text-[#e8f2ee] selection:bg-[#2ce1b0] selection:text-[#03110d]">
      <PulseNav />

      <section className="relative overflow-hidden">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full bg-[#2ce1b0]/14 blur-[120px]" />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-xs tracking-[0.24em] uppercase text-[#2ce1b0] mb-6">Пульс Фит · Концепт многостраничного сайта</p>
          <h1 className="text-5xl md:text-7xl leading-[1.02]">
            Фитнес-сайт,
            <span className="block italic text-[#2ce1b0]">который продает абонементы</span>
          </h1>
          <p className="mt-8 text-[#e8f2ee]/68 max-w-2xl leading-relaxed">
            В этом концепте развернута полноценная структура: отдельные страницы расписания, тарифов и тренеров. Такой формат помогает
            прогревать посетителя и вести его до покупки.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/portfolio/pulse-fit/abonementy" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2ce1b0] text-[#03110d] font-semibold hover:bg-[#45eac0] transition-colors">
              Открыть тарифы
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/portfolio/pulse-fit/raspisanie" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#2ce1b0]/45 text-[#e8f2ee] hover:bg-[#2ce1b0]/12 transition-colors">
              Смотреть расписание
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-4">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <article key={block.title} className="rounded-2xl border border-[#2ce1b0]/24 bg-[#0a1118]/84 p-6">
              <Icon className="w-6 h-6 text-[#2ce1b0] mb-4" />
              <h2 className="text-2xl mb-3">{block.title}</h2>
              <p className="text-sm text-[#e8f2ee]/66 leading-relaxed">{block.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
