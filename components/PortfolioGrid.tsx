"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const projects = [
    {
        title: "JenSilver Jewelry",
        description: "Интернет-магазин ювелирных изделий на Tilda. Изысканный дизайн и удобная навигация.",
        link: "https://jensilver.tilda.ws/",
        tags: ["Tilda", "E-commerce", "Design"],
    },
    {
        title: "Пэн Доре",
        description: "Концепт сайта ремесленной пекарни. Теплый дизайн, анимации и атмосфера уюта.",
        link: "/portfolio/pain-dore",
        tags: ["Concept", "Next.js", "Animation"],
    },
    {
        title: "Эфирное Сияние",
        description: "Минималистичный лендинг для бренда косметики. Чистота, воздух и мягкая анимация.",
        link: "/portfolio/ethereal-glow",
        tags: ["Concept", "Minimalism", "Beauty"],
    },
    {
        title: "Городская Среда",
        description: "Брутализм и архитектура. Строгие линии, горизонтальный скролл и монохром.",
        link: "/portfolio/urban-space",
        tags: ["Concept", "Brutalism", "Architecture"],
    },
    {
        title: "Нуар Мод",
        description: "Fashion-бренд. Агрессивный стиль, типографика и глитч-эффекты.",
        link: "/portfolio/noir-mode",
        tags: ["Concept", "Fashion", "Dark Mode"],
    },
    {
        title: "Брю Лаб",
        description: "Кофейня с характером. Индустриальный стиль, теплая палитра и акценты.",
        link: "/portfolio/brew-lab",
        tags: ["Concept", "Cafe", "Industrial"],
    },
    {
        title: "Дзен Движение",
        description: "Студия йоги. Природа, спокойствие и плавные переходы.",
        link: "/portfolio/zen-move",
        tags: ["Concept", "Health", "Zen"],
    },
    {
        title: "Галерея Lumina",
        description: "Иммерсивная цифровая галерея. WebGL эффекты, неоновая эстетика и будущее искусства.",
        link: "/portfolio/lumina-art",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2600&auto=format&fit=crop",
        tags: ["Digital Art", "WebGL", "Gallery"],
    },
];

export default function PortfolioGrid() {
    return (
        <section id="projects" className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 italic">
                        Избранные <span className="text-emerald-500">работы</span>
                    </h2>
                    <p className="text-emerald-100/50 text-lg uppercase tracking-widest">
                        Это основные, но скоро будут еще
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {projects.map((project, index) => {
                        const isExternal = project.link.startsWith("http");

                        // Common content for both link types
                        const cardContent = (
                            <>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-2">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        {isExternal && <ExternalLink className="w-5 h-5 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />}
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 text-emerald-50 italic group-hover:translate-x-2 transition-transform capitalize">
                                        {project.title}
                                    </h3>
                                    <p className="text-emerald-100/60 leading-relaxed mb-8">
                                        {project.description}
                                    </p>

                                    <div className="pt-6 border-t border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                                        <span className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
                                            Посмотреть проект
                                            <motion.span
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                →
                                            </motion.span>
                                        </span>
                                    </div>
                                </div>

                                {/* Decorative accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
                            </>
                        );

                        const itemClasses = "group glass p-8 rounded-3xl block relative overflow-hidden transition-all hover:scale-[1.02] hover:border-emerald-500/50 w-full h-full text-left";

                        return (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                {isExternal ? (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={itemClasses}
                                    >
                                        {cardContent}
                                    </a>
                                ) : (
                                    <Link href={project.link} className={itemClasses}>
                                        {cardContent}
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
