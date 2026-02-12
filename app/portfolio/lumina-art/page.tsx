"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Maximize2, PlayCircle, Share2, Info } from "lucide-react";
import { useRef } from "react";

const artImages = {
    hero: "https://images.unsplash.com/photo-1620641788421-7f1c33b74305?q=80&w=2600&auto=format&fit=crop", // Abstract Digital Wave
    gallery: "https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=2600&auto=format&fit=crop", // Gallery Space
    item1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop", // Abstract Blue/Orange
    item2: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2000&auto=format&fit=crop", // Abstract 3D Shapes
    item3: "https://images.unsplash.com/photo-1614850523060-8da1d56e37fc?q=80&w=2000&auto=format&fit=crop" // Neon Fluid
};

export default function LuminaArtPage() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#7000FF] selection:text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-[#050505]/50 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 hover:text-[#7000FF] transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest">Портфолио</span>
                </Link>
                <div className="font-bold tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#7000FF] to-[#00FFFF]">
                    Галерея Lumina
                </div>
                <div className="w-20"></div>
            </nav>

            {/* Hero */}
            <section className="h-screen relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={artImages.hero}
                        alt="Digital Art Installation"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 text-center px-4 mix-blend-screen">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E0E0] to-[#7000FF]">
                            LUMINA
                        </h1>
                        <p className="text-xl md:text-3xl font-light tracking-[0.5em] uppercase opacity-80 pl-2">
                            Искусство Света
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-12 flex gap-8 text-xs font-mono uppercase tracking-widest opacity-50"
                >
                    <span>Иммерсивность</span>
                    <span>•</span>
                    <span>Цифра</span>
                    <span>•</span>
                    <span>Будущее</span>
                </motion.div>
            </section>

            {/* Exhibition Intro */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="w-12 h-1 bg-[#7000FF]"></div>
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Где пиксели обретают <span className="italic text-[#00FFFF]">душу</span>.
                        </h2>
                        <p className="text-lg opacity-60 leading-relaxed font-light">
                            Lumina — это пространство без границ. Мы стираем черту между физическим и цифровым,
                            создавая полотна, которые живут, дышат и реагируют на ваше присутствие.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-8 font-mono text-sm opacity-80">
                            <div>
                                <span className="block text-[#7000FF] font-bold text-2xl mb-2">12+</span>
                                Экспозиций
                            </div>
                            <div>
                                <span className="block text-[#00FFFF] font-bold text-2xl mb-2">8K</span>
                                Разрешение
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 relative aspect-square rounded-full overflow-hidden border border-white/10">
                        <Image
                            src={artImages.gallery}
                            alt="Gallery Interior"
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-1000"
                        />
                    </div>
                </div>
            </section>

            {/* Horizontal Scroll Gallery */}
            <section ref={targetRef} className="h-[300vh] relative bg-[#0A0A0A]">
                <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                    <motion.div style={{ x }} className="flex gap-20 px-20">
                        <div className="w-[80vw] md:w-[60vw] flex-shrink-0 flex flex-col justify-center">
                            <h2 className="text-8xl font-black mb-8 opacity-20">КОЛЛЕКЦИЯ</h2>
                            <p className="text-2xl font-light max-w-xl">
                                Исследуйте нашу текущую экспозицию "Грани Реальности".
                            </p>
                        </div>
                        {[
                            { img: artImages.item1, title: "Нейронный Шторм", artist: "AI Collective" },
                            { img: artImages.item2, title: "Геометрия Снов", artist: "M. Kolar" },
                            { img: artImages.item3, title: "Жидкий Неон", artist: "S. Vane" }
                        ].map((item, i) => (
                            <div key={i} className="w-[80vw] md:w-[40vw] flex-shrink-0 group relative">
                                <div className="aspect-[4/5] relative overflow-hidden mb-8 bg-[#111]">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-[#7000FF]/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                                    <button className="absolute bottom-6 right-6 p-4 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <Maximize2 className="w-6 h-6" />
                                    </button>
                                </div>
                                <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                                <p className="font-mono text-[#00FFFF] text-sm">{item.artist}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Visit CTA */}
            <section className="py-40 text-center px-6">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#7000FF] via-[#00FFFF] to-[#7000FF] mb-12">
                    <div className="bg-[#050505] rounded-full px-8 py-3">
                        <span className="font-mono uppercase tracking-widest text-[#E0E0E0]">Билеты в продаже</span>
                    </div>
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">
                    ПОГРУЗИСЬ<br /><span className="text-[#00FFFF] stroke-text">В ЦВЕТ</span>
                </h2>
                <button className="px-12 py-6 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-[#7000FF] hover:text-white transition-colors duration-300 text-lg">
                    Купить Билет
                </button>
            </section>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px #00FFFF;
                    color: transparent;
                }
             `}</style>
        </main>
    );
}
