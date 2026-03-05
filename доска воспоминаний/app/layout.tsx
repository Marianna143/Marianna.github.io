import type { Metadata } from "next";
import { Marck_Script, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
});

const marckScript = Marck_Script({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--font-marck-script",
});

export const metadata: Metadata = {
  title: "Дневник воспоминаний",
  description: "Секретная пробковая стена воспоминаний",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${plusJakarta.variable} ${marckScript.variable}`}>
      <body>{children}</body>
    </html>
  );
}
