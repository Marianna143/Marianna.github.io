"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Sun, Wind, Heart } from "lucide-react";
import { useRef } from "react";

const yogaImages = {
    hero: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2600&auto=format&fit=crop", // Yoga Nature/Studio
    pose: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=2000&auto=format&fit=crop", // Yoga silhouette sunset
    meditation: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop", // Meditation
    studio: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2000&auto=format&fit=crop" // Plants/Space
};

export default function ZenMovePage() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <main className="min-h-screen bg-[#F0F4F3] text-[#2C3E50] font-sans selection:bg-[#A8D8B9] selection:text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center text-[#2C3E50] bg-[#F0F4F3]/80 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2 hover:text-[#A8D8B9] transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Домой</span>
                </Link>
                <div className="font-medium tracking-widest uppercase">Дзен Движение</div>
                <button className="bg-[#2C3E50] text-white px-6 py-2 rounded-full text-sm hover:bg-[#A8D8B9] transition-colors">
                    Расписание
                </button>
            </nav>

            {/* Hero */}
            <section className="h-screen relative flex items-center justify-center overflow-hidden px-6">
                <motion.div
                    style={{ scale }}
                    className="absolute inset-4 md:inset-10 rounded-3xl overflow-hidden"
                >
                    <Image
                        src={yogaImages.hero}
                        alt="Yoga Session"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>

                <div className="relative z-10 text-center text-white p-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-6xl md:text-9xl font-light mb-6 tracking-tight"
                    >
                        Дыши.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-xl md:text-3xl font-light opacity-90 max-w-xl mx-auto"
                    >
                        Движение, которое исцеляет. Тишина, которая наполняет силой.
                    </motion.p>
                </div>
            </section>

            {/* Features */}
            <section ref={targetRef} className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <h2 className="text-4xl md:text-6xl max-w-2xl leading-tight">
                            Воссоединись со своим <span className="text-[#A8D8B9]">естественным ритмом</span>.
                        </h2>
                        <p className="mt-8 md:mt-0 max-w-sm opacity-60 leading-relaxed">
                            Наша студия — это пространство, созданное чтобы помочь вам найти баланс в хаотичном мире.
                            Через дыхание, движение и общество единомышленников.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
                            <div className="w-12 h-12 bg-[#F0F4F3] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#A8D8B9] transition-colors">
                                <Sun className="w-6 h-6 text-[#2C3E50] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Утренний Поток</h3>
                            <p className="opacity-60 text-sm leading-relaxed">
                                Пробудите тело динамичными последовательностями, которые разогревают и развивают гибкость.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
                            <div className="w-12 h-12 bg-[#F0F4F3] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#A8D8B9] transition-colors">
                                <Wind className="w-6 h-6 text-[#2C3E50] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Дыхание</h3>
                            <p className="opacity-60 text-sm leading-relaxed">
                                Практики пранаямы для снижения стресса и повышения ясности ума.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
                            <div className="w-12 h-12 bg-[#F0F4F3] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#A8D8B9] transition-colors">
                                <Heart className="w-6 h-6 text-[#2C3E50] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Восстановление</h3>
                            <p className="opacity-60 text-sm leading-relaxed">
                                Глубокое расслабление в позах, удерживаемых длительное время для снятия напряжения.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Break */}
            <section className="py-20 px-6 overflow-hidden">
                <div className="flex gap-4 md:gap-8">
                    <motion.div
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.5 }}
                        className="w-1/3 aspect-[3/4] relative rounded-2xl overflow-hidden mt-20"
                    >
                        <Image src={yogaImages.pose} alt="Pose" fill className="object-cover" />
                    </motion.div>
                    <motion.div
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="w-1/3 aspect-[3/4] relative rounded-2xl overflow-hidden"
                    >
                        <Image src={yogaImages.studio} alt="Studio" fill className="object-cover" />
                    </motion.div>
                    <motion.div
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                        className="w-1/3 aspect-[3/4] relative rounded-2xl overflow-hidden mt-40"
                    >
                        <Image src={yogaImages.meditation} alt="Meditation" fill className="object-cover" />
                    </motion.div>
                </div>
            </section>

            {/* Video / Membership CTA */}
            <section className="py-32 px-6 bg-[#2C3E50] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 cursor-pointer hover:scale-110 transition-transform backdrop-blur-md">
                        <Play className="w-8 h-8 ml-1 fill-white" />
                    </div>
                    <h2 className="text-4xl md:text-6xl mb-8">Начните свой путь сегодня.</h2>
                    <p className="text-xl opacity-70 mb-12 max-w-2xl mx-auto">
                        Неограниченный доступ ко всем классам, семинарам и нашей онлайн-библиотеке по единой цене.
                    </p>
                    <button className="bg-[#A8D8B9] text-[#2C3E50] px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors">
                        Оформить подписку — 4 900 ₽/мес
                    </button>
                    <div className="mt-8 text-sm opacity-50">Первое занятие бесплатно. Без обязательств.</div>
                </div>
            </section>
        </main>
    );
}
