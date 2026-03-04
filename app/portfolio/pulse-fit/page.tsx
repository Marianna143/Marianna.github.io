"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Timer, Target, ArrowUpRight } from "lucide-react";

const metrics = [
    { label: "Первый экран", value: "2.4с", note: "до заявки" },
    { label: "Конверсия брифа", value: "+38%", note: "в концепте" },
    { label: "Запись на пробный", value: "1 клик", note: "без лишних шагов" },
];

const strengths = [
    {
        title: "Энергичный ритм",
        text: "Контрастная типографика и четкие блоки создают ощущение движения и силы.",
        icon: Flame,
    },
    {
        title: "Скорость выбора",
        text: "Тарифы и расписание собраны в понятную структуру без перегрузки.",
        icon: Timer,
    },
    {
        title: "Фокус на действие",
        text: "Каждый экран подводит к целевому шагу: запись на пробное занятие.",
        icon: Target,
    },
];

export default function PulseFitPage() {
    return (
        <main className="min-h-screen bg-[#05070b] text-[#F2F4F8] selection:bg-[#33E1B2] selection:text-[#03110d]">
            <nav className="sticky top-0 z-40 border-b border-[#33E1B2]/20 backdrop-blur-xl bg-[#05070b]/78">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#F2F4F8]/74 hover:text-[#F2F4F8] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Назад в портфолио
                    </Link>
                    <span className="text-xs tracking-[0.23em] uppercase text-[#33E1B2]">Пульс Фит</span>
                </div>
            </nav>

            <section className="relative overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[#33E1B2]/16 blur-[130px]" />
                <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
                    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
                        <p className="text-xs tracking-[0.25em] uppercase text-[#33E1B2] mb-5">Концепт сайта фитнес-студии</p>
                        <h1 className="text-5xl md:text-7xl leading-[1.02]">
                            Сайт с характером,
                            <span className="block italic text-[#33E1B2]">который продает абонементы</span>
                        </h1>
                        <p className="mt-8 text-[#F2F4F8]/68 max-w-2xl leading-relaxed">
                            Концепт построен вокруг быстрых решений: посетитель сразу видит преимущества, формат занятий и кнопку записи.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-4 mt-12">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.42 }}
                                className="rounded-2xl border border-[#33E1B2]/24 bg-[#0b1118]/80 p-6"
                            >
                                <p className="text-xs tracking-[0.18em] uppercase text-[#F2F4F8]/46">{metric.label}</p>
                                <p className="text-4xl mt-3 text-[#33E1B2]">{metric.value}</p>
                                <p className="text-sm text-[#F2F4F8]/55 mt-1">{metric.note}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-4">
                    {strengths.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.article
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.42 }}
                                className="rounded-2xl border border-[#33E1B2]/20 bg-[#0a0f16]/85 p-6"
                            >
                                <Icon className="w-7 h-7 text-[#33E1B2] mb-4" />
                                <h2 className="text-2xl mb-3">{item.title}</h2>
                                <p className="text-sm text-[#F2F4F8]/62 leading-relaxed">{item.text}</p>
                            </motion.article>
                        );
                    })}
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="rounded-3xl border border-[#33E1B2]/30 bg-gradient-to-br from-[#0a1418] to-[#0b0f18] p-8 md:p-12">
                    <p className="text-xs tracking-[0.22em] uppercase text-[#33E1B2]/90 mb-4">Финальная подача</p>
                    <h2 className="text-4xl md:text-5xl leading-[1.06]">
                        Энергия бренда
                        <span className="italic text-[#33E1B2]"> чувствуется в каждом экране</span>
                    </h2>
                    <p className="text-[#F2F4F8]/65 max-w-2xl mt-5">
                        Этот шаблон показывает, как спортивный сайт может одновременно выглядеть выразительно и вести пользователя к покупке.
                    </p>
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border border-[#33E1B2]/45 text-[#F2F4F8] hover:bg-[#33E1B2] hover:text-[#02110d] transition-colors"
                    >
                        Вернуться к кейсам
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
