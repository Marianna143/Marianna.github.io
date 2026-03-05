import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дневник воспоминаний",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function MemoryDiaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
