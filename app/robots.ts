import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        host: "https://marianna-web.ru",
        sitemap: "https://marianna-web.ru/sitemap.xml",
    };
}
