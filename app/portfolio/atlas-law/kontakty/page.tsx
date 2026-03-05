import AtlasNav from "../components/AtlasNav";

const steps = [
  "Оставляете заявку с кратким описанием ситуации",
  "Юрист связывается и уточняет детали в удобном канале",
  "Получаете план действий, сроки и формат сопровождения",
];

export default function AtlasLawContactsPage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-[#efe7da] selection:bg-[#d7b37a] selection:text-[#111]">
      <AtlasNav />

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-[#d7b37a] mb-6">Страница контактов</p>
          <h1 className="text-4xl md:text-6xl leading-[1.04]">Консультация без долгого ожидания</h1>
          <p className="mt-6 text-[#efe7da]/66 leading-relaxed">
            Контактный раздел в концепте построен так, чтобы клиент оставил заявку с минимальным усилием и быстро получил ответ.
          </p>

          <div className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-xl border border-[#d7b37a]/24 bg-[#0d1119]/82 px-4 py-3 text-sm text-[#efe7da]/70">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#d7b37a]/24 bg-[#0c1018] p-7 md:p-8">
          <p className="text-xs tracking-[0.18em] uppercase text-[#d7b37a]/86 mb-5">Форма заявки · демонстрация</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#efe7da]/55 mb-2">Имя</p>
              <div className="h-11 rounded-xl border border-[#d7b37a]/22 bg-[#090d15]" />
            </div>
            <div>
              <p className="text-xs text-[#efe7da]/55 mb-2">Телеграм или телефон</p>
              <div className="h-11 rounded-xl border border-[#d7b37a]/22 bg-[#090d15]" />
            </div>
            <div>
              <p className="text-xs text-[#efe7da]/55 mb-2">Кратко о задаче</p>
              <div className="h-28 rounded-xl border border-[#d7b37a]/22 bg-[#090d15]" />
            </div>
            <button className="w-full h-11 rounded-xl bg-[#d7b37a] text-[#111] font-semibold">Отправить заявку</button>
          </div>
        </div>
      </section>
    </main>
  );
}
