import HeroSection from "@/components/HeroSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";


export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Скрытый блок для Google (SEO) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Marianna",
                        "url": "https://marianna-web.ru",
                        "jobTitle": "Web Developer & UI/UX Designer",
                        "knowsAbout": ["Web Development", "Tilda Publishing", "Taplink", "Next.js", "E-commerce"],
                        "image": "https://marianna-web.ru/og-image.jpg",
                        "sameAs": [
                            "https://t.me/workvinil", // Твой рабочий контакт
                        ]
                    })
                }}
            />

            <HeroSection />
            <PortfolioGrid />
            <PricingSection />
            <ContactForm />
            <Footer />
        </main>
    );
}