import type { Metadata } from "next";
import { Great_Vibes, Marck_Script, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import BackgroundScene from "@/components/BackgroundScene";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin", "latin-ext"],
    variable: "--font-plus-jakarta",
});

const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes",
});

const marckScript = Marck_Script({
    weight: "400",
    subsets: ["cyrillic", "latin"],
    variable: "--font-marck-script",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://marianna-web.ru"),
    title: {
        default: "Марианна | Разработка сайтов: Тильда, Таплинк, интернет-магазины",
        template: "%s | Марианна — разработка сайтов",
    },
    description:
        "Частный веб-разработчик. Создаю продающие сайты для экспертов и бизнеса: от одностраничников до интернет-магазинов. Дизайн, верстка, интеграции с Телеграм.",
    keywords: [
        "разработка сайтов",
        "веб-дизайн",
        "создать сайт",
        "интернет-магазин под ключ",
        "тильда",
        "таплинк",
        "дизайн сайта",
        "портфолио веб-разработчика",
    ],
    authors: [{ name: "Марианна", url: "https://marianna-web.ru" }],
    creator: "Марианна",
    openGraph: {
        title: "Марианна | Сайты, которые продают",
        description:
            "Разработка интернет-магазинов, лендингов и сайтов на коде с акцентом на продажи, удобство и сильную визуальную подачу.",
        url: "https://marianna-web.ru",
        siteName: "Портфолио Марианны",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Портфолио веб-разработчика Марианны",
            },
        ],
        locale: "ru_RU",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={`${plusJakartaSans.variable} ${greatVibes.variable} ${marckScript.variable}`}>
            <body className="font-sans antialiased">
                <BackgroundScene />
                <div className="noise-overlay" />
                <CustomCursor />
                <SmoothScroll>{children}</SmoothScroll>
                <Analytics />
            </body>
        </html>
    );
}
