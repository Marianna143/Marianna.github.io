"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type Project = {
    title: string;
    description: string;
    link: string;
    tags: string[];
    accent: string;
    glow: string;
};

const projects: Project[] = [
    {
        title: "Ювелирный бренд «ДженСильвер»",
        description: "Интернет-магазин украшений с акцентом на премиальную подачу и удобный путь к покупке.",
        link: "https://jensilver.tilda.ws/",
        tags: ["Интернет-магазин", "Тильда", "Каталог"],
        accent: "from-emerald-300/45 via-cyan-300/20 to-transparent",
        glow: "rgba(110, 231, 183, 0.42)",
    },
    {
        title: "Пэн Доре",
        description: "Концепт сайта ремесленной пекарни. Теплая атмосфера, вкусная визуальная подача и эмоция бренда.",
        link: "/portfolio/pain-dore",
        tags: ["Концепт", "Сайт на коде", "Анимация"],
        accent: "from-amber-200/45 via-orange-200/20 to-transparent",
        glow: "rgba(251, 191, 36, 0.3)",
    },
    {
        title: "Эфирное Сияние",
        description: "Минималистичный лендинг для косметического бренда с мягкой подачей и фокусом на доверие.",
        link: "/portfolio/ethereal-glow",
        tags: ["Концепт", "Минимализм", "Красота"],
        accent: "from-lime-200/40 via-emerald-100/20 to-transparent",
        glow: "rgba(190, 242, 100, 0.24)",
    },
    {
        title: "Городская Среда",
        description: "Брутальный архитектурный стиль, контрастная типографика и уверенная визуальная структура.",
        link: "/portfolio/urban-space",
        tags: ["Концепт", "Архитектура", "Брутализм"],
        accent: "from-zinc-300/35 via-slate-300/10 to-transparent",
        glow: "rgba(161, 161, 170, 0.24)",
    },
    {
        title: "Нуар Мод",
        description: "Модный бренд с сильным характером: резкая графика, ритм и дерзкая подача коллекции.",
        link: "/portfolio/noir-mode",
        tags: ["Концепт", "Мода", "Глитч"],
        accent: "from-fuchsia-300/35 via-pink-300/15 to-transparent",
        glow: "rgba(244, 114, 182, 0.3)",
    },
    {
        title: "Брю Лаб",
        description: "Сайт для кофейни с индустриальной эстетикой и акцентом на продукт, атмосферу и меню.",
        link: "/portfolio/brew-lab",
        tags: ["Концепт", "Кофейня", "Индустрия"],
        accent: "from-orange-300/35 via-amber-300/10 to-transparent",
        glow: "rgba(251, 146, 60, 0.25)",
    },
    {
        title: "Дзен Движение",
        description: "Спокойная визуальная среда для студии йоги: мягкий ритм, воздух и продуманная навигация.",
        link: "/portfolio/zen-move",
        tags: ["Концепт", "Студия йоги", "Баланс"],
        accent: "from-sky-200/40 via-teal-200/10 to-transparent",
        glow: "rgba(56, 189, 248, 0.22)",
    },
    {
        title: "Галерея Люмина",
        description: "Иммерсивная цифровая галерея с визуальными эффектами, глубиной и современным арт-настроением.",
        link: "/portfolio/lumina-art",
        tags: ["Цифровое искусство", "Галерея", "Неон"],
        accent: "from-violet-300/35 via-cyan-300/15 to-transparent",
        glow: "rgba(129, 140, 248, 0.3)",
    },
    {
        title: "Атлас Права",
        description: "Новый концепт: юридический сайт с упором на доверие, деловую подачу и высокую конверсию заявки.",
        link: "/portfolio/atlas-law",
        tags: ["Новый концепт", "Юридические услуги", "Премиум"],
        accent: "from-yellow-200/40 via-amber-200/10 to-transparent",
        glow: "rgba(250, 204, 21, 0.28)",
    },
    {
        title: "Северный Лофт",
        description: "Новый концепт: студия интерьеров с атмосферными сценами, акцентом на экспертность и кейсы.",
        link: "/portfolio/nordic-loft",
        tags: ["Новый концепт", "Интерьеры", "Портфолио"],
        accent: "from-stone-200/40 via-emerald-100/10 to-transparent",
        glow: "rgba(214, 211, 209, 0.26)",
    },
    {
        title: "Пульс Фит",
        description: "Новый концепт: фитнес-студия с энергичной подачей, абонементами и понятной структурой продаж.",
        link: "/portfolio/pulse-fit",
        tags: ["Новый концепт", "Фитнес", "Абонементы"],
        accent: "from-rose-300/40 via-red-300/15 to-transparent",
        glow: "rgba(251, 113, 133, 0.25)",
    },
];

function ProjectLink({
    href,
    className,
    children,
    onMouseEnter,
    onFocus,
}: {
    href: string;
    className: string;
    children: React.ReactNode;
    onMouseEnter?: () => void;
    onFocus?: () => void;
}) {
    if (href.startsWith("http")) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onMouseEnter={onMouseEnter}
                onFocus={onFocus}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className} onMouseEnter={onMouseEnter} onFocus={onFocus}>
            {children}
        </Link>
    );
}

export default function PortfolioGrid() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeProject = useMemo(() => projects[activeIndex] ?? projects[0], [activeIndex]);

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
                    <p className="text-emerald-100/45 text-sm mt-4 max-w-3xl">
                        Важно: примеры ниже — это шаблоны и демонстрация внешнего вида. Часть ссылок и кнопок в концептах может быть неактивной.
                    </p>
                </motion.div>

                <div className="hidden lg:grid lg:grid-cols-[1.08fr_0.92fr] gap-8 items-start">
                    <div className="space-y-3">
                        {projects.map((project, index) => {
                            const isActive = index === activeIndex;
                            const isExternal = project.link.startsWith("http");

                            return (
                                <motion.div
                                    key={project.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.04, duration: 0.38 }}
                                >
                                    <ProjectLink
                                        href={project.link}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onFocus={() => setActiveIndex(index)}
                                        className={[
                                            "group relative block rounded-2xl border px-5 py-4 transition-all duration-300",
                                            isActive
                                                ? "bg-emerald-500/10 border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.16)]"
                                                : "bg-emerald-950/25 border-emerald-500/15 hover:border-emerald-400/28 hover:bg-emerald-500/6",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-emerald-100/40 text-xs tracking-[0.28em] uppercase mb-1">
                                                    {String(index + 1).padStart(2, "0")}
                                                </p>
                                                <h3 className="text-2xl font-sans font-semibold tracking-tight text-emerald-50">
                                                    {project.title}
                                                </h3>
                                                <p className="text-emerald-100/60 text-sm mt-2 leading-relaxed max-w-[52ch]">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <div className="mt-1">
                                                {isExternal ? (
                                                    <ExternalLink className="w-5 h-5 text-emerald-300/45 group-hover:text-emerald-300 transition-colors" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5 text-emerald-300/45 group-hover:text-emerald-300 transition-colors" />
                                                )}
                                            </div>
                                        </div>
                                    </ProjectLink>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="sticky top-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.title}
                                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                transition={{ duration: 0.33, ease: "easeOut" }}
                                className="glass rounded-3xl overflow-hidden relative border border-emerald-400/25"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${activeProject.accent}`} />
                                <motion.div
                                    className="absolute -top-28 -right-10 w-56 h-56 rounded-full blur-3xl"
                                    style={{ background: activeProject.glow }}
                                    animate={{ x: [0, -10, 0], y: [0, 12, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <div className="relative z-10 p-8">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {activeProject.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-4xl font-sans font-semibold tracking-tight text-emerald-50 mb-4">
                                        {activeProject.title}
                                    </h3>
                                    <p className="text-emerald-100/70 leading-relaxed mb-7">
                                        {activeProject.description}
                                    </p>

                                    <div className="rounded-2xl border border-emerald-400/20 bg-black/20 backdrop-blur-sm p-5 mb-7">
                                        <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-100/45 mb-3">
                                            Структура экрана
                                        </p>
                                        <div className="space-y-2">
                                            <div className="h-2 rounded-full bg-emerald-100/35 w-[76%]" />
                                            <div className="h-2 rounded-full bg-emerald-100/25 w-[58%]" />
                                            <div className="h-14 rounded-xl bg-emerald-500/14 border border-emerald-400/25" />
                                        </div>
                                    </div>

                                    <ProjectLink
                                        href={activeProject.link}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-emerald-100 transition-colors"
                                    >
                                        Открыть проект
                                        <ArrowUpRight className="w-4 h-4" />
                                    </ProjectLink>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="lg:hidden grid grid-cols-1 gap-4">
                    {projects.map((project, index) => {
                        const isExternal = project.link.startsWith("http");
                        return (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06, duration: 0.45 }}
                            >
                                <ProjectLink
                                    href={project.link}
                                    className="group glass rounded-2xl p-6 border border-emerald-500/20 block"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-emerald-100/40 text-xs tracking-[0.25em] uppercase">
                                            {String(index + 1).padStart(2, "0")}
                                        </p>
                                        {isExternal ? (
                                            <ExternalLink className="w-5 h-5 text-emerald-300/40 group-hover:text-emerald-300 transition-colors" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5 text-emerald-300/40 group-hover:text-emerald-300 transition-colors" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-sans font-semibold tracking-tight text-emerald-50 mb-3">
                                        {project.title}
                                    </h3>
                                    <p className="text-emerald-100/65 text-sm leading-relaxed mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </ProjectLink>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
