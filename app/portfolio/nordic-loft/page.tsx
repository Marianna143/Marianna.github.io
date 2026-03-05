import Link from "next/link";
import { ArrowUpRight, Sofa, Home, LampFloor, Ruler } from "lucide-react";
import NordicNav from "./components/NordicNav";

const cards = [
  { title: "Живой интерьер", text: "Визуализация, которая передает атмосферу и помогает клиенту представить будущий дом.", icon: Home },
  { title: "Сценарий пространства", text: "Подача не только про красоту, но и про удобство каждого шага в быту.", icon: Sofa },
  { title: "Свет и материалы", text: "Комбинация оттенков, фактур и света формирует ощущение дорогого спокойствия.", icon: LampFloor },
  { title: "Архитектура блоков", text: "Каждый раздел отвечает на вопрос клиента и ведет к заявке на консультацию.", icon: Ruler },
];

export default function NordicLoftPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#2e2823] selection:bg-[#cab99b] selection:text-[#1f1b17]">
      <NordicNav />

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <p className="text-xs tracking-[0.24em] uppercase text-[#7d6d56] mb-6">Северный Лофт · Концепт многостраничного сайта</p>
        <h1 className="text-5xl md:text-7xl leading-[1.03]">
          Интерьерный сайт,
          <span className="block italic text-[#6d5e4a]">который продает стиль жизни</span>
        </h1>
        <p className="mt-8 text-[#2e2823]/66 max-w-3xl leading-relaxed">
          В этом концепте собрана структура студийного сайта с несколькими страницами: проекты, этапы работы и контакт. Подача деликатная,
          дорогая и ориентированная на доверие.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/portfolio/nordic-loft/proekty" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2e2823] text-[#f5f1e8] hover:bg-[#463d34] transition-colors">
            Смотреть проекты
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link href="/portfolio/nordic-loft/etapy" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#b9a98f]/60 text-[#2e2823] hover:bg-[#ebe3d4] transition-colors">
            Этапы реализации
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-2xl border border-[#cabba0]/58 bg-[#f9f5ee] p-6">
              <Icon className="w-6 h-6 text-[#6d5e4a] mb-4" />
              <h2 className="text-2xl mb-3">{card.title}</h2>
              <p className="text-sm leading-relaxed text-[#2e2823]/68">{card.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
