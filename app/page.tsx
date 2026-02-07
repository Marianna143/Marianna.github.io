import HeroSection from "@/components/HeroSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <PortfolioGrid />
            <PricingSection />
            <ContactForm />
            <Footer />
        </main>
    );
}
