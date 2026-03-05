import AtlasNav from "../components/AtlasNav";

const practices = [
  {
    name: "Корпоративное сопровождение",
    forWho: "Для компаний с регулярными договорами, наймом и подрядчиками",
    result: "Снижение юридических рисков и экономия времени руководителя",
  },
  {
    name: "Судебные споры",
    forWho: "Для бизнеса и частных клиентов в сложных конфликтных делах",
    result: "Четкая стратегия, календарь этапов и прозрачная тактика защиты",
  },
  {
    name: "Проверка контрагентов",
    forWho: "Для сделок, где важна безопасность платежа и исполнения",
    result: "Понимание слабых мест до подписания документов",
  },
  {
    name: "Защита интеллектуальных прав",
    forWho: "Для брендов, студий и экспертов с авторскими продуктами",
    result: "Фиксация прав, договоры и защита активов компании",
  },
];

export default function AtlasLawPracticesPage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-[#efe7da] selection:bg-[#d7b37a] selection:text-[#111]">
      <AtlasNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#d7b37a] mb-6">Раздел практик</p>
        <h1 className="text-4xl md:text-6xl leading-[1.04]">Направления, которые приносят клиенту понятный результат</h1>
        <p className="mt-6 text-[#efe7da]/66 max-w-3xl leading-relaxed">
          В живом проекте этот раздел строится на конкретных кейсах и цифрах. Здесь показан формат подачи: кому подходит услуга и что клиент
          получает на выходе.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-4">
        {practices.map((practice) => (
          <article key={practice.name} className="rounded-2xl border border-[#d7b37a]/22 bg-[#0d111a]/86 p-6">
            <h2 className="text-2xl mb-4">{practice.name}</h2>
            <p className="text-sm uppercase tracking-[0.15em] text-[#d7b37a]/86 mb-2">Для кого</p>
            <p className="text-[#efe7da]/64 mb-5 leading-relaxed">{practice.forWho}</p>
            <p className="text-sm uppercase tracking-[0.15em] text-[#d7b37a]/86 mb-2">Результат</p>
            <p className="text-[#efe7da]/64 leading-relaxed">{practice.result}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
