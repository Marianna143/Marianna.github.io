import NordicNav from "../components/NordicNav";

const stages = [
  {
    title: "Бриф и аудит",
    text: "Собираем задачи, сроки, референсы и ограничения, чтобы сразу заложить рабочую стратегию.",
  },
  {
    title: "Планировочное решение",
    text: "Формируем функциональную основу пространства, где каждая зона решает конкретную задачу.",
  },
  {
    title: "Визуальная концепция",
    text: "Подбираем палитру, материалы, мебель и световые сценарии для цельной атмосферы.",
  },
  {
    title: "Комплектация и реализация",
    text: "Сопровождаем закупки и подрядчиков, чтобы итог совпал с согласованной визуализацией.",
  },
];

export default function NordicLoftStagesPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#2e2823] selection:bg-[#cab99b] selection:text-[#1f1b17]">
      <NordicNav />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#7d6d56] mb-6">Этапы работы</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05]">Прозрачный процесс без хаоса и сюрпризов</h1>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-4">
        {stages.map((stage, index) => (
          <article key={stage.title} className="rounded-2xl border border-[#cabba0]/58 bg-[#f9f5ee] p-6 md:p-7">
            <p className="text-xs tracking-[0.16em] uppercase text-[#7d6d56] mb-3">Этап {index + 1}</p>
            <h2 className="text-2xl mb-3">{stage.title}</h2>
            <p className="text-[#2e2823]/68 leading-relaxed">{stage.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
