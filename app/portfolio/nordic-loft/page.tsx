"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, House, Ruler, LampFloor, ArrowUpRight } from "lucide-react";

const points = [
    {
        title: "Живые материалы",
        text: "Дерево, лен, камень и светлые поверхности делают интерфейс спокойным и премиальным.",
        icon: House,
    },
    {
        title: "Четкая сетка",
        text: "Блоки выстроены так, чтобы взгляд быстро проходил путь от идеи до кнопки связи.",
        icon: Ruler,
    },
    {
        title: "Атмосферная подача",
        text: "Мягкие переходы и аккуратная анимация создают эффект дорогого интерьерного журнала.",
        icon: LampFloor,
    },
];

export default function NordicLoftPage() {
    return (
        <main className="min-h-screen bg-[#F5F2EB] text-[#2D2722] selection:bg-[#BFAE92] selection:text-[#1d1915]">
            <nav className="sticky top-0 z-40 border-b border-[#BFAE92]/35 backdrop-blur-xl bg-[#F5F2EB]/75">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2D2722]/70 hover:text-[#2D2722] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Назад в портфолио
                    </Link>
                    <span className="text-xs tracking-[0.24em] uppercase text-[#6B5D4A]">Северный Лофт</span>
                </div>
            </nav>

            <section className="max-w-6xl mx-auto px-6 pt-20 pb-14">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                    <p className="text-xs tracking-[0.24em] uppercase text-[#7c6c56] mb-5">Концепт сайта студии интерьеров</p>
                    <h1 className="text-5xl md:text-7xl leading-[1.05]">
                        Пространства,
                        <span className="block italic text-[#6B5D4A]">в которые хочется возвращаться</span>
                    </h1>
                    <p className="mt-8 text-[#2D2722]/68 max-w-2xl leading-relaxed">
                        Концепт показывает, как можно продавать дизайн интерьера через атмосферу, ясную структуру и убедительные примеры работ.
                    </p>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-16">
                <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[2rem] bg-gradient-to-br from-[#EDE5D7] to-[#D9CDB8] min-h-[360px] p-8 flex flex-col justify-end"
                    >
                        <p className="text-xs tracking-[0.2em] uppercase text-[#6B5D4A]">Фокус на эмоцию</p>
                        <h2 className="text-4xl mt-3 leading-tight">Теплый минимализм и аккуратная типографика</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12 }}
                        className="rounded-[2rem] border border-[#BFAE92]/45 bg-[#F8F4EC] min-h-[360px] p-8"
                    >
                        <div className="space-y-3 mt-12">
                            <div className="h-2 rounded-full bg-[#8E7A61]/45 w-[72%]" />
                            <div className="h-2 rounded-full bg-[#8E7A61]/28 w-[54%]" />
                            <div className="h-28 rounded-2xl border border-[#BFAE92]/60 bg-[#ECE5D8]" />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-4">
                    {points.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <motion.article
                                key={point.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.4 }}
                                className="rounded-2xl border border-[#BFAE92]/45 bg-[#F8F4EC]/90 p-6"
                            >
                                <Icon className="w-7 h-7 text-[#6B5D4A] mb-4" />
                                <h3 className="text-2xl mb-3">{point.title}</h3>
                                <p className="text-sm text-[#2D2722]/65 leading-relaxed">{point.text}</p>
                            </motion.article>
                        );
                    })}
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="rounded-3xl bg-[#2D2722] text-[#F8F4EC] p-8 md:p-12">
                    <p className="text-xs tracking-[0.23em] uppercase text-[#d6c8b0] mb-4">Итог концепта</p>
                    <h2 className="text-4xl md:text-5xl leading-[1.08]">
                        Сайт передает вкус студии
                        <span className="block italic text-[#d6c8b0]">и уверенно ведет к брифу</span>
                    </h2>
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border border-[#d6c8b0]/45 text-[#F8F4EC] hover:bg-[#d6c8b0] hover:text-[#2D2722] transition-colors"
                    >
                        Вернуться к кейсам
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
