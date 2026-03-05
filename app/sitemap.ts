import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://marianna-web.ru";
    const now = new Date();
    const routes = [
        { path: "/", priority: 1, changeFrequency: "weekly" as const },
        { path: "/poleznoe", priority: 0.9, changeFrequency: "weekly" as const },
        { path: "/portfolio/atlas-law", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/portfolio/atlas-law/praktika", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/atlas-law/komanda", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/atlas-law/kontakty", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/nordic-loft", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/portfolio/nordic-loft/proekty", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/nordic-loft/etapy", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/nordic-loft/kontakt", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/pulse-fit", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/portfolio/pulse-fit/raspisanie", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/pulse-fit/abonementy", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/pulse-fit/trenery", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/portfolio/pain-dore", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/pain-dore/about", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/pain-dore/menu", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/pain-dore/contact", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/ethereal-glow", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/urban-space", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/noir-mode", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/brew-lab", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/zen-move", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/portfolio/lumina-art", priority: 0.7, changeFrequency: "monthly" as const },
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
