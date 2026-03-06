const faqItems = [
    {
        question: "Сколько стоит сайт под ключ?",
        answer:
            "Стоимость зависит от структуры и задач. Для сайта на Тильде старт обычно ОТ 10 000 ₽, для индивидуального кодового решения — ОТ 15 000 ₽. Точную смету даю после короткого брифа.",
    },
    {
        question: "За сколько можно запустить сайт?",
        answer:
            "Первый прототип обычно показываю за 3-5 дней. Полноценный запуск занимает от 7 дней для простых проектов и от 3-5 недель для многостраничных сайтов с интеграциями.",
    },
    {
        question: "Вы делаете сайт только по шаблону или с нуля?",
        answer:
            "Делаю оба формата. Можно собрать быстрый сайт на Тильде, а можно реализовать полностью индивидуальный кодовый проект с уникальной анимацией и логикой под ваш бизнес.",
    },
    {
        question: "Что нужно подготовить перед стартом проекта?",
        answer:
            "Нужно кратко описать ваш продукт, целевую аудиторию, желаемый формат сайта и примеры визуального стиля. Остальное помогу структурировать на этапе брифа.",
    },
    {
        question: "Поможете после запуска сайта?",
        answer:
            "Да. Показываю, как вносить изменения самостоятельно, и остаюсь на связи по вопросам поддержки, доработок и роста конверсии.",
    },
];

export function getFaqItems() {
    return faqItems;
}

export default function FaqSection() {
    return (
        <section id="faq" className="py-24 px-6 relative">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl md:text-5xl tracking-tight mb-4">
                        Частые вопросы о{" "}
                        <span className="text-emerald-400">создании сайта</span>
                    </h2>
                    <p className="text-emerald-100/60 max-w-3xl mx-auto">
                        Этот блок помогает быстро сравнить форматы и понять, какой сайт
                        подойдет под вашу задачу и бюджет.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqItems.map((item) => (
                        <details
                            key={item.question}
                            className="glass rounded-2xl px-6 py-5 group"
                        >
                            <summary className="list-none cursor-pointer text-emerald-50 font-semibold text-lg">
                                {item.question}
                            </summary>
                            <p className="mt-3 text-emerald-100/70 leading-relaxed">
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
