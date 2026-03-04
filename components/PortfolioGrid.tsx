"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const projects = [
    {
        title: "Ювелирный бренд «ДженСильвер»",
        description: "Интернет-магазин украшений с акцентом на премиальную подачу и удобный путь к покупке.",
        link: "https://jensilver.tilda.ws/",
        tags: ["Интернет-магазин", "Тильда", "Каталог"],
    },
    {
        title: "Пэн Доре",
        description: "Концепт сайта ремесленной пекарни. Теплая атмосфера, вкусная визуальная подача и эмоция бренда.",
        link: "/portfolio/pain-dore",
        tags: ["Концепт", "Сайт на коде", "Анимация"],
    },
    {
        title: "Эфирное Сияние",
        description: "Минималистичный лендинг для косметического бренда с мягкой подачей и фокусом на доверие.",
        link: "/portfolio/ethereal-glow",
        tags: ["Концепт", "Минимализм", "Красота"],
    },
    {
        title: "Городская Среда",
        description: "Брутальный архитектурный стиль, контрастная типографика и уверенная визуальная структура.",
        link: "/portfolio/urban-space",
        tags: ["Концепт", "Архитектура", "Брутализм"],
    },
    {
        title: "Нуар Мод",
        description: "Модный бренд с сильным характером: резкая графика, ритм и дерзкая подача коллекции.",
        link: "/portfolio/noir-mode",
        tags: ["Концепт", "Мода", "Глитч"],
    },
    {
        title: "Брю Лаб",
        description: "Сайт для кофейни с индустриальной эстетикой и акцентом на продукт, атмосферу и меню.",
        link: "/portfolio/brew-lab",
        tags: ["Концепт", "Кофейня", "Индустрия"],
    },
    {
        title: "Дзен Движение",
        description: "Спокойная визуальная среда для студии йоги: мягкий ритм, воздух и продуманная навигация.",
        link: "/portfolio/zen-move",
        tags: ["Концепт", "Студия йоги", "Баланс"],
    },
    {
        title: "Галерея Люмина",
        description: "Иммерсивная цифровая галерея с визуальными эффектами, глубиной и современным арт-настроением.",
        link: "/portfolio/lumina-art",
        tags: ["Цифровое искусство", "Галерея", "Неон"],
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
                        Кейсы и <span className="text-emerald-500">концепты</span>
                    </h2>
                    <p className="text-emerald-100/50 text-lg uppercase tracking-widest">
                        Работы в разных нишах: от личного бренда до интернет-магазина.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {projects.map((project, index) => {
                        const isExternal = project.link.startsWith("http");

                        const cardContent = (
                            <>
                                <motion.div
                                    className="absolute -inset-x-24 -top-12 h-24 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent blur-2xl opacity-0 group-hover:opacity-100"
                                    animate={{ x: ["-20%", "18%", "-20%"] }}
                                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        {isExternal && <ExternalLink className="w-5 h-5 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />}
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 text-emerald-50 italic group-hover:translate-x-2 transition-transform">
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

                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
                            </>
                        );

                        const itemClasses = "group glass p-8 rounded-3xl block relative overflow-hidden transition-all hover:scale-[1.02] hover:border-emerald-500/50 w-full h-full text-left";

                        return (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -6 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.12, duration: 0.55 }}
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
