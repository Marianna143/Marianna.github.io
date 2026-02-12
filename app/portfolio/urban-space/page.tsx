"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Grid, Layers, Box } from "lucide-react";
import { useRef } from "react";

const architectureImages = {
    hero: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2600&auto=format&fit=crop", // Brutalist/Modern
    interior: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop", // Concrete interior
    detail: "https://images.unsplash.com/photo-1518005052351-e4b395d3a35a?q=80&w=2600&auto=format&fit=crop", // Architectural detail - BROKEN, need replace
    sketch: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2600&auto=format&fit=crop" // Blueprint/Tech
};

// Replacement for broken detail image
const safeDetailImage = "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2600&auto=format&fit=crop"; // Abstract concrete

export default function UrbanSpacePage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    const scrollToProjects = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main ref={containerRef} className="bg-[#121212] text-[#E0E0E0] font-sans selection:bg-white selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-8 bg-gradient-to-b from-[#121212] to-transparent mix-blend-difference">
                <Link href="/" className="group flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#E0E0E0] rounded-full flex items-center justify-center group-hover:bg-[#E0E0E0] group-hover:text-[#121212] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                </Link>
                <div className="font-mono text-xs tracking-widest uppercase">
                    Городское Пространство / 2026
                </div>
            </nav>

            {/* Hero */}
            <section className="h-screen relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src={architectureImages.hero}
                        alt="Брутализм Архитектура"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-[10vw] leading-[0.8] font-bold tracking-tighter mix-blend-overlay">
                            ГОРОДСКАЯ<br />СРЕДА
                        </h1>
                    </motion.div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end border-t border-[#E0E0E0]/20 pt-8">
                    <div className="max-w-xs font-mono text-xs opacity-60">
                        ПЕРЕОСМЫСЛЕНИЕ ЖИЗНИ ЧЕРЕЗ<br />
                        БЕТОН, СВЕТ И ПРОСТРАНСТВО.
                    </div>
                    <div className="animate-bounce">
                        <div className="w-4 h-4 border-r-2 border-b-2 border-[#E0E0E0] rotate-45"></div>
                    </div>
                </div>
            </section>

            {/* Introduction - Horizontal Scroll Vibe */}
            <section className="py-32 px-6 border-b border-[#E0E0E0]/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-tight">
                            Функция следует за <span className="text-transparent stroke-text">формой</span>.
                        </h2>
                        <p className="text-xl md:text-2xl opacity-70 leading-relaxed font-light">
                            Мы отсекаем лишнее, чтобы обнажить структурную истину.
                            Наши пространства созданы не просто для обитания, а для проживания.
                            Необработанный бетон встречается с теплым деревом в диалоге текстур.
                        </p>
                        <div className="mt-16 grid grid-cols-2 gap-8 font-mono text-xs">
                            <div className="flex items-start gap-4">
                                <Grid className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-2 uppercase">Модульность</h4>
                                    <p className="opacity-60">Адаптивные пространства под любые нужды.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Layers className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-2 uppercase">Устойчивость</h4>
                                    <p className="opacity-60">Пассивное охлаждение и местные материалы.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[60vh]">
                        <Image
                            src={architectureImages.interior}
                            alt="Интерьер"
                            fill
                            className="object-cover grayscale contrast-125"
                        />
                    </div>
                </div>
            </section>

            {/* Gallery / Project Showcase */}
            <section id="projects" className="py-32 bg-[#1A1A1A]">
                <div className="px-6 mb-16 flex justify-between items-end">
                    <h2 className="text-4xl font-bold">Избранные проекты</h2>
                    <button
                        onClick={scrollToProjects}
                        className="flex items-center gap-2 text-sm uppercase tracking-widest hover:underline"
                    >
                        Смотреть все <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex overflow-x-auto gap-8 px-6 pb-16 no-scrollbar snap-x">
                    {[
                        { title: "Монолит", loc: "Берлин", img: safeDetailImage },
                        { title: "Дом Пустоты", loc: "Токио", img: architectureImages.sketch },
                        { title: "Небесная Ось", loc: "Нью-Йорк", img: architectureImages.hero },
                    ].map((item, idx) => (
                        <div key={idx} className="min-w-[80vw] md:min-w-[45vw] snap-center group cursor-pointer relative">
                            <div className="relative aspect-[16/9] mb-6 overflow-hidden">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="flex justify-between items-start border-b border-[#E0E0E0]/20 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                                    <span className="font-mono text-xs opacity-50 uppercase">{item.loc}</span>
                                </div>
                                <span className="font-mono text-xl opacity-30">0{idx + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px #E0E0E0;
                    color: transparent;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}
