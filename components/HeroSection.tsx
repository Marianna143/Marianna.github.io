"use client";
import GlassText from "@/components/GlassText";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 text-center">
            <div className="max-w-5xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold mb-6 backdrop-blur-md tracking-[0.5em] uppercase">
                        Product Design & Dev
                    </span>

                    {/* Заголовок */}
                    <div className="mb-4">
                        <GlassText />
                    </div>

                    {/* Имя Марианна - задержка уменьшена до 1.5 сек */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-emerald-500/80 font-medium text-sm md:text-base mb-16 tracking-[0.4em] uppercase"
                    >
                        Меня зовут <span className="text-white font-bold">Марианна</span>
                    </motion.div>
                </motion.div>

                {/* Описание */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                    className="text-lg md:text-xl text-emerald-100/70 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Выпускница Лицея НИУ ВШЭ "Дизайн", студентка МГТУ им. Баумана.
                    Создаю эстетичные цифровые продукты более 4 лет.
                </motion.p>

                {/* Кнопки */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.0 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="https://t.me/workvinil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        Связаться в ТГ
                    </a>
                    <a
                        href="#projects"
                        className="px-10 py-4 bg-transparent border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-50 font-medium rounded-full transition-all"
                    >
                        Смотреть работы
                    </a>
                </motion.div>
            </div>
        </section>
    );
}