import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Полезное: как сайт получает клиентов без рекламы",
    description:
        "Практический гид по созданию продающего сайта: структура, сроки, стоимость, SEO и шаги, которые дают рост посещаемости без платной рекламы.",
    keywords: [
        "как продвигать сайт бесплатно",
        "как сайт приводит клиентов",
        "создание сайта под ключ",
        "стоимость разработки сайта",
        "сроки создания сайта",
        "SEO сайта",
    ],
    alternates: {
        canonical: "/poleznoe",
    },
};

const checklist = [
    "Четкий оффер и понятный первый экран",
    "Структура страницы под путь клиента к заявке",
    "Отдельные страницы под услуги и ниши",
    "FAQ с реальными вопросами клиентов",
    "Быстрая загрузка и удобная мобильная версия",
    "Микроразметка Schema.org и корректный sitemap",
    "Внутренние ссылки между кейсами и услугами",
];

export default function UsefulPage() {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Как сделать сайт, который стабильно приводит клиентов без рекламы",
        "author": {
            "@type": "Person",
            "name": "Марианна",
        },
        "publisher": {
            "@type": "Organization",
            "name": "Марианна — разработка сайтов",
            "logo": {
                "@type": "ImageObject",
                "url": "https://marianna-web.ru/og-image.jpg",
            },
        },
        "datePublished": "2026-03-05",
        "dateModified": "2026-03-05",
        "mainEntityOfPage": "https://marianna-web.ru/poleznoe",
    };

    return (
        <main className="min-h-screen px-6 py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <div className="max-w-4xl mx-auto">
                <p className="text-emerald-300 uppercase tracking-[0.2em] text-xs mb-4">
                    Полезные материалы
                </p>
                <h1 className="text-4xl md:text-6xl tracking-tight mb-6">
                    Как сделать сайт, который приводит клиентов без рекламы
                </h1>
                <p className="text-emerald-100/70 text-lg leading-relaxed">
                    Если вы хотите максимум просмотров и заявок без расходов на рекламу,
                    сайт должен быть не просто красивым, а стратегически собранным:
                    под поисковые запросы, под логику пользователя и под быструю
                    конверсию в обращение.
                </p>

                <section className="glass rounded-3xl p-8 mt-10">
                    <h2 className="text-3xl mb-4">Что реально работает для роста посещаемости</h2>
                    <ul className="space-y-3">
                        {checklist.map((item) => (
                            <li key={item} className="text-emerald-100/75 leading-relaxed">
                                • {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-10 space-y-6 text-emerald-100/75 leading-relaxed">
                    <h2 className="text-3xl text-emerald-50">Почему это дает клиентов</h2>
                    <p>
                        Поисковые системы продвигают страницы, которые отвечают на
                        конкретные вопросы пользователя: сколько стоит сайт, какие сроки
                        разработки, какой формат выбрать, чем отличается Тильда от кодового
                        проекта. Когда эти ответы есть на сайте в понятной структуре,
                        он получает больше органических показов и переходов.
                    </p>
                    <p>
                        Следующий уровень — доверие. Портфолио, кейсы и отзывы снижают
                        сомнения, а понятный сценарий страницы доводит посетителя до
                        заявки. В результате сайт работает как воронка, а не просто как
                        визитка.
                    </p>
                </section>

                <section className="mt-10 space-y-4">
                    <h2 className="text-3xl text-emerald-50">С чего начать прямо сейчас</h2>
                    <div className="glass rounded-2xl p-6">
                        <p className="text-emerald-100/75 leading-relaxed">
                            1) Определить 3-5 ключевых услуг. 2) Сделать под них отдельные
                            блоки или страницы. 3) Добавить FAQ и кейсы из вашей ниши.
                            4) Закрыть техническое SEO (мета-теги, sitemap, robots,
                            микроразметка). 5) Регулярно обновлять сайт новыми кейсами.
                        </p>
                    </div>
                </section>

                <div className="mt-12 flex flex-wrap gap-3">
                    <Link
                        href="/#projects"
                        className="px-6 py-3 rounded-full bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400 transition-colors"
                    >
                        Перейти к кейсам
                    </Link>
                    <Link
                        href="/#contact"
                        className="px-6 py-3 rounded-full border border-emerald-500/30 text-emerald-50 hover:bg-emerald-500/10 transition-colors"
                    >
                        Обсудить сайт в Телеграм
                    </Link>
                </div>
            </div>
        </main>
    );
}
