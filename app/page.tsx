import HeroSection from "@/components/HeroSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import SalesProofSection from "@/components/SalesProofSection";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import OrganicReachSection from "@/components/OrganicReachSection";
import FaqSection, { getFaqItems } from "@/components/FaqSection";

export default function Home() {
    const faqItems = getFaqItems();
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "name": "Марианна",
                "url": "https://marianna-web.ru",
                "jobTitle": "Веб-разработчик и дизайнер интерфейсов",
                "knowsAbout": [
                    "Разработка сайтов",
                    "Создание интернет-магазинов",
                    "Дизайн интерфейсов",
                    "Адаптивная верстка",
                    "Интеграции с Телеграм",
                ],
                "image": "https://marianna-web.ru/og-image.jpg",
                "sameAs": ["https://t.me/workvinil"],
            },
            {
                "@type": "ProfessionalService",
                "name": "Марианна — создание сайтов под ключ",
                "url": "https://marianna-web.ru",
                "description":
                    "Разработка продающих сайтов для экспертов и бизнеса: лендинги, многостраничные сайты, интернет-магазины, сайты на Тильде и кодовые решения.",
                "areaServed": "RU",
                "serviceType": [
                    "Разработка сайта под ключ",
                    "Создание сайта на Тильде",
                    "Создание интернет-магазина",
                    "Разработка многостраничного сайта",
                ],
                "sameAs": ["https://t.me/workvinil"],
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqItems.map((item) => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer,
                    },
                })),
            },
            {
                "@type": "ItemList",
                "name": "Примеры работ и концептов",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "url": "https://marianna-web.ru/portfolio/atlas-law",
                        "name": "Атлас Права",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "url": "https://marianna-web.ru/portfolio/nordic-loft",
                        "name": "Северный Лофт",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "url": "https://marianna-web.ru/portfolio/pulse-fit",
                        "name": "Пульс Фит",
                    },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <HeroSection />
            <PortfolioGrid />
            <SalesProofSection />
            <OrganicReachSection />
            <PricingSection />
            <FaqSection />
            <ContactForm />
            <Footer />
        </main>
    );
}
