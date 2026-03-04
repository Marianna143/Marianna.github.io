"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const EmeraldSceneNoSSR = dynamic(() => import("@/components/EmeraldScene"), {
    ssr: false,
});

export default function BackgroundScene() {
    const pathname = usePathname();

    // Не показываем глобальный звездный фон внутри шаблонов портфолио.
    if (pathname.startsWith("/portfolio/")) {
        return null;
    }

    return <EmeraldSceneNoSSR />;
}
