"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import PainDoreNav from "./components/PainDoreNav";
import PainDoreFooter from "./components/PainDoreFooter";
import { useRef } from "react";

const bakeryImages = {
    hero: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=2670&auto=format&fit=crop", // Warm atmosphere
    baker: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop", // Baker hands kneading
    croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2626&auto=format&fit=crop", // Croissants
    sourdough: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=2000&auto=format&fit=crop", // Sourdough loaf
};

export default function PainDorePage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#5A4A42] font-sans selection:bg-[#D4A373] selection:text-white">
            <PainDoreNav />

            {/* Hero Section */}
            <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    <Image
                        src={bakeryImages.hero}
                        alt="Интерьер пекарни"
                        fill
                        className="object-cover brightness-[0.70]"
                        priority
                        sizes="100vw"
                    />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-[#FDFBF7]">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-sm md:text-base tracking-[0.3em] uppercase mb-4"
                    >
                        Осн. 1924 • Москва
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-9xl font-serif font-medium mb-6 leading-tight"
                    >
                        Пэн Доре
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-2xl font-light opacity-90 italic max-w-2xl mx-auto"
                    >
                        Где традиции встречают золотое тепло утра.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#FDFBF7] text-xs tracking-widest uppercase flex flex-col items-center gap-2"
                >
                    <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        Листайте вниз
                    </motion.span>
                    <div className="w-[1px] h-12 bg-[#FDFBF7]/50"></div>
                </motion.div>
            </section>

            {/* Introduction */}
            <section className="py-32 px-6 md:px-12 bg-[#FDFBF7]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
                            Искусство <span className="italic text-[#D4A373]">медленной</span> выпечки
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">
                            В Пэн Доре мы верим, что время — самый важный ингредиент.
                            Наша закваска бережно поддерживается поколениями, создавая
                            сложный вкус и глубокий, деревенский аромат, который невозможно повторить
                            с помощью промышленных дрожжей.
                        </p>
                        <p className="text-lg leading-relaxed opacity-80">
                            Каждая буханка формуется вручную, выпекается на камне и создается из 100% органической
                            муки местного производства. Это не просто хлеб; это ежедневный ритуал.
                        </p>
                        <div className="mt-10 flex gap-8 font-serif italic text-xl">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col cursor-default"
                            >
                                <span className="text-4xl not-italic font-bold text-[#D4A373]">24ч</span>
                                <span>Ферментация</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col cursor-default"
                            >
                                <span className="text-4xl not-italic font-bold text-[#D4A373]">100%</span>
                                <span>Органика</span>
                            </motion.div>
                        </div>
                    </motion.div>
                    <div className="relative aspect-[4/5] rounded-t-full overflow-hidden group">
                        <div className="absolute inset-0 bg-[#D4A373]/10 z-10 group-hover:bg-[#D4A373]/0 transition-colors duration-500" />
                        <Image
                            src={bakeryImages.baker}
                            alt="Пекарь замешивает тесто"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                        />
                    </div>
                </div>
            </section>

            {/* Menu Preview */}
            <section className="py-32 bg-[#EFEBE4] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Наши шедевры</h2>
                        <p className="tracking-widest uppercase text-xs opacity-60">Свежие из печи ежедневно</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Item 1 */}
                        <motion.div
                            variants={itemVariant}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-square mb-6 overflow-hidden rounded-sm">
                                <Image
                                    src={bakeryImages.croissant}
                                    alt="Классический круассан"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>
                            <h3 className="text-2xl font-serif mb-2 group-hover:text-[#D4A373] transition-colors">Классический Круассан</h3>
                            <p className="opacity-70 mb-4">Натуральное масло, 27 слоев, бесконечный хруст.</p>
                            <span className="text-[#D4A373] text-lg font-bold">350 ₽</span>
                        </motion.div>

                        {/* Item 2 */}
                        <motion.div
                            variants={itemVariant}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer md:mt-16"
                        >
                            <div className="relative aspect-square mb-6 overflow-hidden rounded-sm">
                                <Image
                                    src={bakeryImages.sourdough}
                                    alt="Деревенский хлеб"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>
                            <h3 className="text-2xl font-serif mb-2 group-hover:text-[#D4A373] transition-colors">Деревенский Хлеб</h3>
                            <p className="opacity-70 mb-4">Смесь цельнозерновой и ржаной муки, толстая корочка.</p>
                            <span className="text-[#D4A373] text-lg font-bold">600 ₽</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <PainDoreFooter />
        </main>
    );
}
