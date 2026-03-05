import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dnewnik-cork-7g4m", "/dnewnik-cork-7g4m/*"],
      },
    ],
    host: "https://marianna-web.ru",
    sitemap: "https://marianna-web.ru/sitemap.xml",
  };
}
