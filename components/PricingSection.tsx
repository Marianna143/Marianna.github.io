"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";

const pricingData = [
    {
        title: "Сайт на Тильде",
        subtitle: "Быстрый запуск для услуг и экспертов",
        items: [
            { name: "Лендинг на Тильде (до 7 блоков)", price: "ОТ 10 000 ₽" },
            { name: "Многостраничный сайт на Тильде", price: "ОТ 22 000 ₽" },
            { name: "Интернет-магазин на Тильде", price: "ОТ 30 000 ₽" },
            { name: "Подключение онлайн-оплаты", price: "ОТ 2 500 ₽" },
            { name: "Интеграции (CRM, Telegram, формы)", price: "ОТ 2 000 ₽" },
            { name: "Поддержка и обновления после запуска", price: "ОТ 1 500 ₽ / мес" },
        ],
        note: "Подходит, если нужен быстрый запуск и понятная админка без сложной разработки.",
    },
    {
        title: "Кодовый сайт",
        subtitle: "Индивидуальные решения с расширенной анимацией",
        items: [
            { name: "Продающий кодовый лендинг", price: "ОТ 15 000 ₽" },
            { name: "Многостраничный кодовый сайт", price: "ОТ 39 000 ₽" },
            { name: "Интернет-магазин или сервис на коде", price: "ОТ 55 000 ₽" },
            { name: "Нестандартные функции и личные кабинеты", price: "ОТ 80 000 ₽" },
        ],
        note: "Подходит, если важны масштабируемость, уникальный дизайн и гибкая логика.",
    },
];

export default function PricingSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="pricing" className="py-32 px-6 bg-emerald-950/20 relative overflow-hidden">
            <motion.div
                className="absolute -left-20 top-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 italic">
                        Стоимость <span className="text-emerald-500">услуг</span>
                    </h2>
                    <p className="text-emerald-100/55 max-w-2xl mx-auto">
                        Четкая смета без скрытых платежей. Подбираем формат под ваш бизнес и цели продаж.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {pricingData.map((category, idx) => (
                        <div key={category.title} className="glass rounded-3xl overflow-hidden relative">
                            {openIndex === idx && (
                                <motion.div
                                    className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 text-left transition-colors hover:bg-emerald-500/5 relative z-10"
                            >
                                <div>
                                    <h3 className="text-[1.72rem] font-sans font-semibold tracking-tight text-emerald-50 mb-2">
                                        {category.title}
                                    </h3>
                                    <p className="text-emerald-100/55 text-[0.95rem] font-sans">{category.subtitle}</p>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-emerald-500 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                    >
                                        <div className="p-8 pt-0 border-t border-emerald-500/10">
                                            <ul className="space-y-4 pt-6">
                                                {category.items.map((item, itemIndex) => (
                                                    <motion.li
                                                        key={item.name}
                                                        initial={{ opacity: 0, x: -12 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: itemIndex * 0.08, duration: 0.25 }}
                                                        className="flex items-center justify-between gap-4"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                            <span className="text-emerald-100/80">{item.name}</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-mono font-bold shrink-0">
                                                            {item.price}
                                                        </span>
                                                    </motion.li>
                                                ))}
                                            </ul>

                                            <p className="mt-8 p-4 rounded-xl bg-emerald-500/5 text-emerald-400/75 text-sm border border-emerald-500/10">
                                                {category.note}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl p-8 mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                    <div>
                        <p className="text-emerald-300 text-sm uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Рекомендация
                        </p>
                        <h3 className="text-2xl font-bold text-emerald-50">Не знаете, что выбрать?</h3>
                        <p className="text-emerald-100/60 mt-2">Напишите в Телеграм, помогу выбрать формат под ваш бюджет и цель.</p>
                    </div>
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                        Подобрать формат
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
