// import type { Metadata } from "next";
// import { Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
// import "./globals.css";
// import SmoothScroll from "@/components/SmoothScroll";
// import CustomCursor from "@/components/CustomCursor";
// import EmeraldScene from "@/components/EmeraldScene";
// import { Analytics } from '@vercel/analytics/react';

// const plusJakartaSans = Plus_Jakarta_Sans({
//     subsets: ["latin", "latin-ext"],
//     variable: "--font-plus-jakarta"
// });

// const greatVibes = Great_Vibes({
//     weight: "400",
//     subsets: ["latin"],
//     variable: "--font-great-vibes"
// });

// export const metadata: Metadata = {
//     metadataBase: new URL('https://marianna-web.ru'),
//     title: {
//         default: "Марианна | Разработка сайтов: Tilda, Taplink, Интернет-магазины",
//         template: "%s | Marianna Web Dev"
//     },
//     description: "Частный веб-разработчик. Создание сайтов любой сложности: от Таплинка до интернет-магазинов на коде. Дизайн, верстка, интеграции с Telegram.",
//     keywords: ["разработка сайтов", "веб-дизайн", "Tilda эксперт", "создать сайт", "верстка html", "интернет-магазин под ключ", "Taplink дизайн", "портфолио"],
//     authors: [{ name: "Marianna", url: "https://marianna-web.ru" }],
//     creator: "Marianna",
//     openGraph: {
//         title: "Марианна | Сайты, которые продают",
//         description: "Разработка интернет-магазинов, лендингов и Taplink. Современный дизайн и чистый код.",
//         url: "https://marianna-web.ru",
//         siteName: "Marianna Portfolio",
//         images: [
//             {
//                 url: "/og-image.jpg",
//                 width: 1200,
//                 height: 630,
//                 alt: "Портфолио веб-разработчика",
//             },
//         ],
//         locale: "ru_RU",
//         type: "website",
//     },
//     robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//             index: true,
//             follow: true,
//             "max-video-preview": -1,
//             "max-image-preview": "large",
//             "max-snippet": -1,
//         },
//     },
// };

// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="ru" className={`${plusJakartaSans.variable} ${greatVibes.variable}`}>
//             <body className="font-sans antialiased">
//                 <EmeraldScene />
//                 <div className="noise-overlay" />
//                 <CustomCursor />
//                 <SmoothScroll>
//                     {children}
//                 </SmoothScroll>
//                 <Analytics />
//             </body>
//         </html>
//     );
// }







import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Great_Vibes, Marck_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import EmeraldScene from "@/components/EmeraldScene";
import { Analytics } from '@vercel/analytics/react';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin", "latin-ext"],
    variable: "--font-plus-jakarta"
});

const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes"
});

// Добавляем красивый шрифт с поддержкой Русского языка
const marckScript = Marck_Script({
    weight: "400",
    subsets: ["cyrillic", "latin"],
    variable: "--font-marck-script"
});

export const metadata: Metadata = {
    metadataBase: new URL('https://marianna-web.ru'),
    title: {
        default: "Марианна | Разработка сайтов: Tilda, Taplink, Интернет-магазины",
        template: "%s | Marianna Web Dev"
    },
    description: "Частный веб-разработчик...",
    // ... (твои метаданные без изменений) ...
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // Добавляем marckScript.variable в список классов
        <html lang="ru" className={`${plusJakartaSans.variable} ${greatVibes.variable} ${marckScript.variable}`}>
            <body className="font-sans antialiased">
                <EmeraldScene />
                <div className="noise-overlay" />
                <CustomCursor />
                <SmoothScroll>
                    {children}
                </SmoothScroll>
                <Analytics />
            </body>
        </html>
    );
}