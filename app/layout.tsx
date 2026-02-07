import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import EmeraldScene from "@/components/EmeraldScene";
import { Analytics } from '@vercel/analytics/next';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin", "latin-ext"],
    variable: "--font-plus-jakarta"
});

const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes"
});

export const metadata: Metadata = {
    title: "Марианна | Создание Сайтов (Emerald Portfolio)",
    description: "Портфолио Марианны. Создание премиальных сайтов на Tilda, WordPress и кастомном коде. Дизайн и разработка уровня Award Winning.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={`${plusJakartaSans.variable} ${greatVibes.variable}`}>
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