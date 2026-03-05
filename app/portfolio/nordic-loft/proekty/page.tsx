import NordicNav from "../components/NordicNav";

const projects = [
  {
    name: "Квартира на Патриарших",
    area: "124 м²",
    style: "Мягкий минимализм",
    text: "Светлая база, натуральный дуб и текстильные акценты для спокойного премиального ритма.",
  },
  {
    name: "Дом у соснового леса",
    area: "210 м²",
    style: "Скандинавский модерн",
    text: "Открытые зоны, много воздуха и теплый световой сценарий для семейного отдыха.",
  },
  {
    name: "Городской пентхаус",
    area: "168 м²",
    style: "Современная классика",
    text: "Контраст камня и дерева, строгая геометрия и выразительная зона гостиной.",
  },
];

export default function NordicLoftProjectsPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#2e2823] selection:bg-[#cab99b] selection:text-[#1f1b17]">
      <NordicNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#7d6d56] mb-6">Раздел проектов</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05]">Портфолио, которое показывает уровень студии</h1>
        <p className="mt-6 text-[#2e2823]/68 max-w-3xl leading-relaxed">
          В рабочем сайте сюда добавляются фото, планы, бюджетные ориентиры и отзывы. Ниже — демонстрация структуры подачи.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <article key={project.name} className="rounded-2xl border border-[#cabba0]/58 bg-[#f9f5ee] p-6">
            <p className="text-xs tracking-[0.16em] uppercase text-[#6d5e4a] mb-3">{project.area} · {project.style}</p>
            <h2 className="text-2xl mb-4">{project.name}</h2>
            <p className="text-sm text-[#2e2823]/68 leading-relaxed">{project.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
