import PulseNav from "../components/PulseNav";

const schedule = [
  { day: "Понедельник", classes: ["07:30 Функциональная тренировка", "13:00 Здоровая спина", "19:30 Силовой микс"] },
  { day: "Среда", classes: ["08:00 Кардио интенсив", "12:30 Pilates Core", "20:00 Тренировка с тренером"] },
  { day: "Пятница", classes: ["07:00 Утренний тонус", "18:30 TRX + баланс", "20:30 Стретч и восстановление"] },
];

export default function PulseFitSchedulePage() {
  return (
    <main className="min-h-screen bg-[#04070c] text-[#e8f2ee] selection:bg-[#2ce1b0] selection:text-[#03110d]">
      <PulseNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#2ce1b0] mb-6">Раздел расписания</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05]">Понятная сетка занятий на неделю</h1>
        <p className="mt-6 text-[#e8f2ee]/66 max-w-3xl leading-relaxed">
          В реальном проекте сюда добавляется фильтр по направлению, уровню подготовки и тренеру.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-4">
        {schedule.map((day) => (
          <article key={day.day} className="rounded-2xl border border-[#2ce1b0]/22 bg-[#0b131b]/86 p-6">
            <h2 className="text-2xl mb-4">{day.day}</h2>
            <ul className="space-y-3 text-sm text-[#e8f2ee]/72">
              {day.classes.map((line) => (
                <li key={line} className="rounded-lg border border-[#2ce1b0]/18 bg-[#091018] px-3 py-2">{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
