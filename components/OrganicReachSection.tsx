import Link from "next/link";

const niches = [
    {
        title: "Сайты для экспертов",
        text: "Лендинги для психологов, коучей, наставников и образовательных продуктов с акцентом на запись и доверие.",
    },
    {
        title: "Сайты для услуг",
        text: "Сайты для бьюти, медицины, юридических и строительных услуг с понятной структурой, которая приводит к заявке.",
    },
    {
        title: "Интернет-магазины",
        text: "Каталог, карточки товара, оплата и логика, которая помогает посетителю быстрее принять решение о покупке.",
    },
];

export default function OrganicReachSection() {
    return (
        <section id="organic-growth" className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl tracking-tight mb-4">
                        Как сайт привлекает клиентов{" "}
                        <span className="text-emerald-400">без рекламы</span>
                    </h2>
                    <p className="text-emerald-100/65 max-w-4xl leading-relaxed">
                        Чтобы сайт получал больше бесплатного трафика из поиска, важны
                        не только дизайн и анимация, но и структура, полезный контент,
                        скорость загрузки и корректная SEO-разметка. Я закладываю это в
                        архитектуру проекта сразу, чтобы сайт стабильно собирал
                        просмотры и заявки в долгую.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {niches.map((niche) => (
                        <article key={niche.title} className="glass rounded-2xl p-6">
                            <h3 className="text-2xl text-emerald-50 mb-3">{niche.title}</h3>
                            <p className="text-emerald-100/65 leading-relaxed">{niche.text}</p>
                        </article>
                    ))}
                </div>

                <div className="glass rounded-2xl p-6 md:p-8 mt-6">
                    <h3 className="text-2xl text-emerald-50 mb-3">
                        Что дает рост посещаемости на практике
                    </h3>
                    <p className="text-emerald-100/65 leading-relaxed">
                        Когда на сайте есть целевые страницы под разные услуги и
                        понятные ответы на частые вопросы, его проще индексируют
                        поисковые системы, а клиенты чаще находят вас по конкретным
                        запросам. Именно поэтому в портфолио ниже показаны не только
                        главные экраны, но и многостраничная структура.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/poleznoe"
                            className="px-6 py-3 bg-emerald-500 text-emerald-950 rounded-full font-semibold hover:bg-emerald-400 transition-colors"
                        >
                            Открыть раздел «Полезное»
                        </Link>
                        <a
                            href="#projects"
                            className="px-6 py-3 border border-emerald-500/30 text-emerald-50 rounded-full hover:bg-emerald-500/10 transition-colors"
                        >
                            Смотреть примеры работ
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
