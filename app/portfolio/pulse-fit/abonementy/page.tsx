import PulseNav from "../components/PulseNav";

const plans = [
  {
    name: "Старт",
    price: "5 900 ₽",
    period: "в месяц",
    items: ["8 групповых тренировок", "Доступ к мобильному расписанию", "1 вводная консультация"],
  },
  {
    name: "Баланс",
    price: "8 900 ₽",
    period: "в месяц",
    items: ["12 групповых тренировок", "2 персональные сессии", "Замер прогресса каждые 2 недели"],
  },
  {
    name: "Максимум",
    price: "14 500 ₽",
    period: "в месяц",
    items: ["Безлимит групповых тренировок", "4 персональные сессии", "Питание + сопровождение тренера"],
  },
];

export default function PulseFitPlansPage() {
  return (
    <main className="min-h-screen bg-[#04070c] text-[#e8f2ee] selection:bg-[#2ce1b0] selection:text-[#03110d]">
      <PulseNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#2ce1b0] mb-6">Раздел абонементов</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05]">Тарифы, которые легко сравнить и выбрать</h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={[
              "rounded-2xl border p-6",
              index === 1
                ? "border-[#2ce1b0]/55 bg-gradient-to-b from-[#0e1c1f] to-[#0b131b]"
                : "border-[#2ce1b0]/24 bg-[#0b131b]/86",
            ].join(" ")}
          >
            <p className="text-xs tracking-[0.16em] uppercase text-[#2ce1b0]/86 mb-3">{plan.name}</p>
            <p className="text-4xl">{plan.price}</p>
            <p className="text-sm text-[#e8f2ee]/62 mt-1">{plan.period}</p>
            <ul className="mt-6 space-y-3 text-sm text-[#e8f2ee]/72">
              {plan.items.map((item) => (
                <li key={item} className="rounded-lg border border-[#2ce1b0]/16 bg-[#091018] px-3 py-2">{item}</li>
              ))}
            </ul>
            <button className="mt-6 h-10 w-full rounded-lg bg-[#2ce1b0] text-[#03110d] font-semibold">Выбрать тариф</button>
          </article>
        ))}
      </section>
    </main>
  );
}
