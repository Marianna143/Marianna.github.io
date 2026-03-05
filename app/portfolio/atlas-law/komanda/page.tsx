import AtlasNav from "../components/AtlasNav";

const team = [
  {
    role: "Управляющий партнер",
    name: "Марта Климова",
    text: "Выстраивает судебную стратегию и контролирует качество ключевых решений по делам.",
  },
  {
    role: "Руководитель корпоративной практики",
    name: "Лев Молчанов",
    text: "Сопровождает сделки, структуру договоров и риски для малого и среднего бизнеса.",
  },
  {
    role: "Юрист по интеллектуальному праву",
    name: "Дарья Туманова",
    text: "Отвечает за регистрацию, защиту брендов и юридическую упаковку цифровых продуктов.",
  },
];

export default function AtlasLawTeamPage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-[#efe7da] selection:bg-[#d7b37a] selection:text-[#111]">
      <AtlasNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs tracking-[0.24em] uppercase text-[#d7b37a] mb-6">Раздел команды</p>
        <h1 className="text-4xl md:text-6xl leading-[1.04]">Эксперты, которым доверяют сложные задачи</h1>
        <p className="mt-6 text-[#efe7da]/66 max-w-3xl leading-relaxed">
          Многостраничный формат дает пространство для личного бренда специалистов и усиливает доверие к компании.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {team.map((member) => (
          <article key={member.name} className="rounded-2xl border border-[#d7b37a]/20 bg-[#0d111a]/84 p-6">
            <p className="text-xs tracking-[0.16em] uppercase text-[#d7b37a]/88 mb-3">{member.role}</p>
            <h2 className="text-2xl mb-4">{member.name}</h2>
            <p className="text-[#efe7da]/65 leading-relaxed text-sm">{member.text}</p>
          </article>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-[#d7b37a]/24 bg-[#0c0f17] p-8 md:p-10">
          <h3 className="text-3xl md:text-4xl leading-[1.1]">Как этот блок работает на продажи</h3>
          <p className="mt-4 text-[#efe7da]/66 max-w-3xl leading-relaxed">
            В реальном проекте сюда добавляются фото, опыт, кейсы специалистов и ссылки на публикации. Это закрывает страх клиента и помогает
            быстрее принять решение о консультации.
          </p>
        </div>
      </section>
    </main>
  );
}
