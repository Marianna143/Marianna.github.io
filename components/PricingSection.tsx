"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";

const pricingData = [
    {
        title: "Сайт на Tilda",
        items: [
            { name: "Основа сайта (настройки, шапка/подвал, ссылки)", price: "1200 ₽ / стр" },
            { name: "Интернет-магазин (каталог, корзина, обучение)", price: "от 3000 ₽" },
            { name: "Подключение оплаты (договор с банком)", price: "1400 ₽" },
            { name: "Подключение доставки (договор с СДЭК/ТК)", price: "1400 ₽" },
            { name: "Подключение CRM", price: "900 ₽" },
            { name: "Отзывы (скрины, текст)", price: "от 700 ₽" },
        ],
        note: "Скидка при большом количестве товаров в магазине."
    },
    {
        title: "Кодовый сайт (Next.js / React)",
        items: [
            { name: "Landing Page (Премиальные анимации, 3D)", price: "от 60 000 ₽" },
            { name: "Корпоративный сайт", price: "от 120 000 ₽" },
            { name: "Сложные веб-сервисы", price: "по запросу" },
        ],
        note: "Используются передовые технологии: Three.js, Framer Motion, GSAP."
    }
];

export default function PricingSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="pricing" className="py-32 px-6 bg-emerald-950/20">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 italic">
                        Стоимость <span className="text-emerald-500">услуг</span>
                    </h2>
                    <p className="text-emerald-100/50 max-w-xl mx-auto">
                        Прозрачное ценообразование. Каждый блок продуман до мелочей в зависимости от ваших целей.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {pricingData.map((category, idx) => (
                        <div key={category.title} className="glass rounded-3xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 text-left transition-colors hover:bg-emerald-500/5"
                            >
                                <h3 className="text-2xl font-bold text-emerald-50">{category.title}</h3>
                                <ChevronDown
                                    className={`w-6 h-6 text-emerald-500 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-8 pt-0 border-t border-emerald-500/10">
                                            <ul className="space-y-4 pt-6">
                                                {category.items.map((item) => (
                                                    <li key={item.name} className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                            <span className="text-emerald-100/80">{item.name}</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-mono font-bold shrink-0">
                                                            {item.price}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {category.note && (
                                                <p className="mt-8 p-4 rounded-xl bg-emerald-500/5 text-emerald-400/70 text-sm border border-emerald-500/10">
                                                    {category.note}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
