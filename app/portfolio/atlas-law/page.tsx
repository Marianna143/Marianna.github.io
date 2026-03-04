"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, ShieldCheck, BriefcaseBusiness, ArrowUpRight } from "lucide-react";

const services = [
    {
        title: "Корпоративное сопровождение",
        text: "Контракты, споры, регламенты и полная юридическая защита бизнеса на ежедневной основе.",
        icon: BriefcaseBusiness,
    },
    {
        title: "Судебная стратегия",
        text: "Анализ рисков, подготовка доказательной базы и уверенное ведение дела на всех этапах.",
        icon: Scale,
    },
    {
        title: "Комплаенс и безопасность",
        text: "Проверка процессов компании, защита персональных данных и снижение регуляторных рисков.",
        icon: ShieldCheck,
    },
];

export default function AtlasLawPage() {
    return (
        <main className="min-h-screen bg-[#090a10] text-[#EDE8DC] selection:bg-[#D0B47D] selection:text-[#111]">
            <nav className="sticky top-0 z-40 border-b border-[#d0b47d]/20 backdrop-blur-xl bg-[#090a10]/75">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#EDE8DC]/80 hover:text-[#EDE8DC] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Назад в портфолио
                    </Link>
                    <span className="text-xs tracking-[0.26em] uppercase text-[#D0B47D]">Атлас Права</span>
                </div>
            </nav>

            <section className="relative overflow-hidden">
                <div className="absolute -top-28 -right-12 w-80 h-80 rounded-full bg-[#D0B47D]/18 blur-[90px]" />
                <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-[1fr_0.9fr] gap-14 items-center">
                    <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-xs tracking-[0.24em] uppercase text-[#D0B47D] mb-5">Концепт юридического сайта</p>
                        <h1 className="text-5xl md:text-7xl leading-[1.03]">
                            Право, которое
                            <span className="block italic text-[#D0B47D]">работает на результат</span>
                        </h1>
                        <p className="text-[#EDE8DC]/68 mt-8 max-w-xl leading-relaxed">
                            Структура первого экрана сразу объясняет ценность, а дальше ведет посетителя к заявке через факты, опыт и понятные шаги работы.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-8">
                            <span className="px-3 py-1.5 border border-[#D0B47D]/40 rounded-full text-xs text-[#EDE8DC]/80">Премиум стиль</span>
                            <span className="px-3 py-1.5 border border-[#D0B47D]/40 rounded-full text-xs text-[#EDE8DC]/80">Высокая конверсия</span>
                            <span className="px-3 py-1.5 border border-[#D0B47D]/40 rounded-full text-xs text-[#EDE8DC]/80">Доверие и экспертность</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                        className="rounded-3xl border border-[#D0B47D]/25 bg-gradient-to-b from-[#151721] to-[#0d1018] p-7"
                    >
                        <p className="text-xs tracking-[0.2em] uppercase text-[#D0B47D]/80 mb-4">Подача в первом экране</p>
                        <div className="space-y-3">
                            <div className="h-2 rounded-full bg-[#EDE8DC]/50 w-[74%]" />
                            <div className="h-2 rounded-full bg-[#EDE8DC]/28 w-[58%]" />
                            <div className="h-28 rounded-2xl border border-[#D0B47D]/20 bg-[#0a0c13] p-4">
                                <div className="h-2 rounded-full bg-[#D0B47D]/45 w-[42%] mb-3" />
                                <div className="h-2 rounded-full bg-[#EDE8DC]/20 w-[68%]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-4">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.article
                                key={service.title}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.45 }}
                                className="rounded-2xl border border-[#D0B47D]/20 bg-[#11141d]/70 p-6"
                            >
                                <Icon className="w-7 h-7 text-[#D0B47D] mb-4" />
                                <h2 className="text-2xl mb-3">{service.title}</h2>
                                <p className="text-[#EDE8DC]/62 text-sm leading-relaxed">{service.text}</p>
                            </motion.article>
                        );
                    })}
                </div>
            </section>

            <section className="pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="rounded-3xl border border-[#D0B47D]/24 p-8 md:p-12 bg-[#0d1018]">
                        <p className="text-xs tracking-[0.24em] uppercase text-[#D0B47D]/90 mb-4">Финальный экран</p>
                        <h2 className="text-4xl md:text-5xl leading-[1.08]">
                            Делаем сложное
                            <span className="italic text-[#D0B47D]"> понятным для клиента</span>
                        </h2>
                        <p className="text-[#EDE8DC]/65 max-w-2xl mt-5">
                            Этот концепт показывает, как юридический сайт может выглядеть дорого и современно, оставаясь ориентированным на заявки и доверие.
                        </p>
                        <Link
                            href="/#projects"
                            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border border-[#D0B47D]/40 text-[#EDE8DC] hover:bg-[#D0B47D] hover:text-[#0b0b0b] transition-colors"
                        >
                            Вернуться к кейсам
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
