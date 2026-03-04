import HeroSection from "@/components/HeroSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import SalesProofSection from "@/components/SalesProofSection";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Марианна",
                        "url": "https://marianna-web.ru",
                        "jobTitle": "Веб-разработчик и дизайнер интерфейсов",
                        "knowsAbout": [
                            "Разработка сайтов",
                            "Создание интернет-магазинов",
                            "Дизайн интерфейсов",
                            "Адаптивная верстка",
                            "Интеграции с Телеграм"
                        ],
                        "image": "https://marianna-web.ru/og-image.jpg",
                        "sameAs": [
                            "https://t.me/workvinil"
                        ]
                    })
                }}
            />

            <HeroSection />
            <PortfolioGrid />
            <SalesProofSection />
            <PricingSection />
            <ContactForm />
            <Footer />
        </main>
    );
}
