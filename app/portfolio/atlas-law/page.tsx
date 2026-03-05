import Link from "next/link";
import { ArrowUpRight, Scale, ShieldCheck, BriefcaseBusiness, Landmark } from "lucide-react";
import AtlasNav from "./components/AtlasNav";

const valuePoints = [
  {
    title: "Сценарий под заявку",
    text: "Путь посетителя собран так, чтобы он за 40-60 секунд понимал вашу специализацию и оставлял контакт.",
    icon: Landmark,
  },
  {
    title: "Язык уверенности",
    text: "Заголовки и структура подчеркивают статус и формируют доверие еще до первого звонка.",
    icon: Scale,
  },
  {
    title: "Фокус на рисках",
    text: "Показываем клиенту не общие фразы, а конкретную выгоду и снятие его юридических рисков.",
    icon: ShieldCheck,
  },
  {
    title: "Продуманная презентация",
    text: "Блоки кейсов, практик и команды поданы как аргументы, ведущие к консультации.",
    icon: BriefcaseBusiness,
  },
];

export default function AtlasLawPage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-[#efe7da] selection:bg-[#d7b37a] selection:text-[#111]">
      <AtlasNav />

      <section className="relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-[42rem] h-[42rem] rounded-full bg-[#d7b37a]/14 blur-[130px]" />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-[#d7b37a] mb-6">Атлас Права · Концепт многостраничного сайта</p>
            <h1 className="text-5xl md:text-7xl leading-[1.02]">
              Юридический сайт,
              <span className="block italic text-[#d7b37a]">который продает экспертизу</span>
            </h1>
            <p className="mt-8 text-[#efe7da]/68 max-w-xl leading-relaxed">
              Этот шаблон показывает, как юридическая студия может презентовать услуги дорого, понятно и убедительно. В концепте собрана
              многостраничная структура: практики, команда и контакты.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/portfolio/atlas-law/praktika"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d7b37a] text-[#131313] font-semibold hover:bg-[#e5c592] transition-colors"
              >
                Открыть практики
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio/atlas-law/kontakty"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d7b37a]/45 text-[#efe7da] hover:bg-[#d7b37a]/12 transition-colors"
              >
                Страница контактов
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#d7b37a]/30 bg-gradient-to-b from-[#151a25] to-[#0b0f18] p-7">
            <p className="text-xs tracking-[0.18em] uppercase text-[#d7b37a]/85 mb-4">Архитектура сайта</p>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-[#d7b37a]/25 px-4 py-3 bg-[#0a0e16]">Главная: ценность + практики + кейсы + заявка</div>
              <div className="rounded-xl border border-[#d7b37a]/25 px-4 py-3 bg-[#0a0e16]">Практики: направления, результаты, стоимость форматов</div>
              <div className="rounded-xl border border-[#d7b37a]/25 px-4 py-3 bg-[#0a0e16]">Команда: роли, опыт, подход к проектам</div>
              <div className="rounded-xl border border-[#d7b37a]/25 px-4 py-3 bg-[#0a0e16]">Контакты: форма консультации и быстрые каналы связи</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-4">
          {valuePoints.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-[#d7b37a]/22 bg-[#0d111a]/82 p-6">
                <Icon className="w-6 h-6 text-[#d7b37a] mb-4" />
                <h2 className="text-2xl mb-3">{item.title}</h2>
                <p className="text-[#efe7da]/64 leading-relaxed text-sm">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
