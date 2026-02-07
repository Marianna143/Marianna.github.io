"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
    {
        title: "JenSilver Jewelry",
        description: "Интернет-магазин ювелирных изделий на Tilda. Изысканный дизайн и удобная навигация.",
        link: "https://jensilver.tilda.ws/",
        tags: ["Tilda", "E-commerce", "Design"],
    },
    {
        title: "Faith Psychology",
        description: "Страница психолога на Taplink. Лаконичность, доверие и функциональность.",
        link: "https://taplink.cc/faithpsy",
        tags: ["Taplink", "Psychology", "Minimalism"],
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
                    {projects.map((project, index) => (
                        <motion.a
                            key={project.title}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group glass p-8 rounded-3xl block relative overflow-hidden transition-all hover:scale-[1.02] hover:border-emerald-500/50"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
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
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
