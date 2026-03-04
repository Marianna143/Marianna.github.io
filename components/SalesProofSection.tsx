"use client";

import { motion } from "framer-motion";
import { CheckCheck, Gauge, MessageCircleMore, Shield } from "lucide-react";

const points = [
    {
        icon: Gauge,
        title: "Сценарий под заявку",
        text: "Строю путь клиента: от первого экрана до нажатия кнопки связи.",
    },
    {
        icon: MessageCircleMore,
        title: "Тексты, которые продают",
        text: "Упаковываю ценность так, чтобы клиент понял выгоду за первые секунды.",
    },
    {
        icon: Shield,
        title: "Четкие сроки",
        text: "Согласовываем этапы заранее, чтобы проект вышел в запуск без задержек.",
    },
    {
        icon: CheckCheck,
        title: "Передача без стресса",
        text: "Показываю, как управлять сайтом самостоятельно, и остаюсь на связи.",
    },
];

export default function SalesProofSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-8 w-[34rem] h-28 bg-emerald-500/10 blur-[80px]"
                animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.96, 1.04, 0.96] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic mb-5">
                        Почему сайт <span className="text-emerald-500">начинает продавать</span>
                    </h2>
                    <p className="text-emerald-100/60 max-w-3xl mx-auto">
                        Я соединяю дизайн, структуру и смысл, чтобы клиенту было легко принять решение
                        и оставить заявку уже на первом посещении.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {points.map((point, index) => (
                        <motion.article
                            key={point.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.12, duration: 0.55 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="glass rounded-3xl p-7 md:p-8 relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl"
                                animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.8, 0.35] }}
                                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                            />
                            <point.icon className="w-6 h-6 text-emerald-400 mb-4" />
                            <h3 className="text-2xl font-bold text-emerald-50 mb-3">{point.title}</h3>
                            <p className="text-emerald-100/65 leading-relaxed">{point.text}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
