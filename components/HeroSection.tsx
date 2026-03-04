"use client";

import { useEffect } from "react";
import GlassText from "@/components/GlassText";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Clock3, ShieldCheck, TrendingUp } from "lucide-react";

const proofBadges = [
    {
        icon: Clock3,
        title: "Быстрый старт",
        text: "Первый прототип за 3-5 дней",
    },
    {
        icon: TrendingUp,
        title: "Фокус на продажи",
        text: "Структура, которая ведет к заявке",
    },
    {
        icon: ShieldCheck,
        title: "Поддержка после запуска",
        text: "Не пропадаю после сдачи проекта",
    },
];

export default function HeroSection() {
    const orbOffsetX = useMotionValue(0);
    const orbOffsetY = useMotionValue(0);
    const orbX = useSpring(orbOffsetX, { stiffness: 92, damping: 17, mass: 0.3 });
    const orbY = useSpring(orbOffsetY, { stiffness: 86, damping: 16, mass: 0.32 });

    useEffect(() => {
        const handleMove = (event: MouseEvent) => {
            const normalizedX = event.clientX / window.innerWidth - 0.5;
            const normalizedY = event.clientY / window.innerHeight - 0.5;

            orbOffsetX.set(normalizedX * 210);
            orbOffsetY.set(normalizedY * 170);
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMove);
    }, [orbOffsetX, orbOffsetY]);

    return (
        <section className="relative min-h-screen flex items-start justify-center overflow-hidden px-6 pt-4 md:pt-8 text-center">
            <motion.div
                className="absolute left-1/2 top-[47%] md:top-[45%] -translate-x-1/2 -translate-y-1/2 w-[31rem] h-[31rem] md:w-[38rem] md:h-[38rem] pointer-events-none will-change-transform"
                style={{
                    x: orbX,
                    y: orbY,
                    background:
                        "radial-gradient(circle at 42% 38%, rgba(126, 253, 206, 0.44) 0%, rgba(16, 185, 129, 0.36) 42%, rgba(5, 150, 105, 0.24) 72%, rgba(4, 120, 87, 0.16) 100%)",
                    boxShadow: "0 0 92px rgba(16,185,129,0.32)",
                    filter: "blur(0.5px)",
                }}
                animate={{
                    scale: [1, 1.05, 0.96, 1.03, 0.98, 1],
                    rotate: [0, 2.4, -1.8, 1.2, -0.8, 0],
                    borderRadius: [
                        "54% 46% 58% 42% / 40% 63% 37% 60%",
                        "43% 57% 38% 62% / 62% 42% 58% 38%",
                        "59% 41% 52% 48% / 36% 66% 34% 64%",
                        "47% 53% 63% 37% / 58% 39% 61% 42%",
                        "61% 39% 44% 56% / 42% 61% 39% 58%",
                        "54% 46% 58% 42% / 40% 63% 37% 60%",
                    ],
                }}
                transition={{ duration: 9.5, repeat: Infinity, ease: [0.42, 0, 0.18, 1] }}
            />

            <div className="max-w-6xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold mb-6 backdrop-blur-md tracking-[0.35em] uppercase">
                        Сайты под ключ
                    </span>

                    <div className="mb-4">
                        <GlassText />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.7 }}
                        className="text-emerald-500/90 font-medium text-sm md:text-base mb-8 tracking-[0.3em] uppercase"
                    >
                        Меня зовут <span className="text-white font-bold">Марианна</span>
                    </motion.p>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-emerald-100/80 max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                    Делаю сайты, которые не просто красиво выглядят, а приводят обращения,
                    продажи и доверие к вашему бренду.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.35, ease: "easeOut" }}
                    className="text-sm md:text-base text-emerald-100/60 max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    Выпускница Лицея НИУ ВШЭ «Дизайн», студентка МГТУ им. Баумана.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
                >
                    {proofBadges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.7 + index * 0.16, duration: 0.5 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="glass rounded-2xl px-5 py-4 text-left"
                        >
                            <badge.icon className="w-5 h-5 text-emerald-400 mb-2" />
                            <p className="text-emerald-50 font-semibold text-sm mb-1">{badge.title}</p>
                            <p className="text-emerald-100/60 text-xs">{badge.text}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.0 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="https://t.me/workvinil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                    >
                        Получить разбор в Телеграм
                    </a>
                    <a
                        href="#projects"
                        className="px-10 py-4 bg-transparent border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-50 font-medium rounded-full transition-all"
                    >
                        Смотреть кейсы
                    </a>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.35, duration: 0.6 }}
                    className="mt-6 text-xs tracking-[0.2em] uppercase text-emerald-100/40"
                >
                    Обычно отвечаю в течение 15 минут
                </motion.p>
            </div>
        </section>
    );
}
