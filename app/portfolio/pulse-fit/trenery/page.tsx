import PulseNav from "../components/PulseNav";

const trainers = [
  {
    name: "Анна Вершинина",
    role: "Функциональный тренер",
    text: "Специализируется на безопасном снижении веса и развитии силы для начинающих.",
  },
  {
    name: "Роман Деев",
    role: "Силовая подготовка",
    text: "Работает с набором мышечной массы, техникой базовых упражнений и прогрессией нагрузок.",
  },
  {
    name: "Ксения Лебедева",
    role: "Мобилити и восстановление",
    text: "Помогает улучшить подвижность, убрать боли в спине и выстроить грамотное восстановление.",
  },
];

export default function PulseFitTrainersPage() {
  return (
    <main className="min-h-screen bg-[#04070c] text-[#e8f2ee] selection:bg-[#2ce1b0] selection:text-[#03110d]">
      <PulseNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#2ce1b0] mb-6">Раздел тренеров</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05]">Команда, которой доверяют свой результат</h1>
        <p className="mt-6 text-[#e8f2ee]/66 max-w-3xl leading-relaxed">
          В реальном сайте в карточках показываются фото, специализация, сертификаты и удобная запись к конкретному тренеру.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-4">
        {trainers.map((trainer) => (
          <article key={trainer.name} className="rounded-2xl border border-[#2ce1b0]/22 bg-[#0b131b]/86 p-6">
            <div className="h-36 rounded-xl bg-gradient-to-br from-[#143c38] to-[#0f1f24] border border-[#2ce1b0]/20 mb-5" />
            <p className="text-xs tracking-[0.16em] uppercase text-[#2ce1b0]/86 mb-2">{trainer.role}</p>
            <h2 className="text-2xl mb-3">{trainer.name}</h2>
            <p className="text-sm text-[#e8f2ee]/68 leading-relaxed">{trainer.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
