import NordicNav from "../components/NordicNav";

export default function NordicLoftContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#2e2823] selection:bg-[#cab99b] selection:text-[#1f1b17]">
      <NordicNav />
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-[#7d6d56] mb-6">Контактный раздел</p>
          <h1 className="text-4xl md:text-6xl leading-[1.05]">Обсудим интерьер вашего пространства</h1>
          <p className="mt-6 text-[#2e2823]/68 max-w-xl leading-relaxed">
            В многостраничном сайте эта страница принимает теплый целевой трафик с кейсов и этапов, превращая интерес в заявку.
          </p>
        </div>

        <div className="rounded-3xl border border-[#cabba0]/58 bg-[#f9f5ee] p-7 md:p-8">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6d5e4a] mb-5">Форма брифа · демонстрация</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#2e2823]/58 mb-2">Имя</p>
              <div className="h-11 rounded-xl border border-[#c7b79e]/66 bg-[#f0e8dc]" />
            </div>
            <div>
              <p className="text-xs text-[#2e2823]/58 mb-2">Контакт</p>
              <div className="h-11 rounded-xl border border-[#c7b79e]/66 bg-[#f0e8dc]" />
            </div>
            <div>
              <p className="text-xs text-[#2e2823]/58 mb-2">Тип объекта</p>
              <div className="h-11 rounded-xl border border-[#c7b79e]/66 bg-[#f0e8dc]" />
            </div>
            <div>
              <p className="text-xs text-[#2e2823]/58 mb-2">Комментарий</p>
              <div className="h-28 rounded-xl border border-[#c7b79e]/66 bg-[#f0e8dc]" />
            </div>
            <button className="w-full h-11 rounded-xl bg-[#2e2823] text-[#f5f1e8] font-semibold">Отправить бриф</button>
          </div>
        </div>
      </section>
    </main>
  );
}
