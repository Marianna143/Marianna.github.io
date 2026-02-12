"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowDown, X } from "lucide-react";
import { useState } from "react";

const fashionImages = {
    hero: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop", // Moody fashion
    look1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop", // BW Fashion
    look2: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2000&auto=format&fit=crop", // Accessory/Jewelry
    look3: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=2000&auto=format&fit=crop", // Texture
    runway: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=2000&auto=format&fit=crop" // Runway/Vibe
};

export default function NoirModePage() {
    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference flex justify-between items-start">
                <Link href="/" className="hover:line-through decoration-white cursor-pointer">
                    <ArrowLeft className="w-6 h-6 mb-1" />
                    <span className="text-[10px] tracking-widest uppercase block">Выход</span>
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-[-0.05em] leading-none">НУАР<br />МОД</h1>
                </div>
                <div className="text-[10px] tracking-widest uppercase text-right">
                    <span className="block">ОЗ</span>
                    <span className="block">2026</span>
                </div>
            </nav>

            {/* Hero / Glitch effect vibe */}
            <section className="h-screen relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grayscale contrast-125 brightness-50">
                    <Image
                        src={fashionImages.hero}
                        alt="Noir Mode Campaign"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Floating Elements */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-1/4 left-10 md:left-20 mix-blend-difference z-10"
                >
                    <p className="text-[10rem] md:text-[20rem] font-bold leading-none opacity-20 select-none">
                        V
                    </p>
                </motion.div>

                <div className="relative z-20 text-center max-w-2xl px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-8xl font-bold tracking-tighter mb-6">
                            СИЛУЭТ
                        </h2>
                        <p className="text-lg md:text-xl font-mono opacity-70 mb-12 uppercase tracking-wide">
                            Утончая пустоту.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse"
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </section>

            {/* Lookbook Grid */}
            <section className="py-20 px-4 md:px-12 bg-neutral-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="aspect-[3/4] relative group overflow-hidden bg-black">
                        <Image
                            src={fashionImages.look1}
                            alt="Look 01"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute bottom-4 left-4 font-mono text-xs z-10">
                            <span className="block">ОБРАЗ_01</span>
                            <span className="block text-neutral-400">СТРУКТУРНАЯ ШЕРСТЬ</span>
                        </div>
                    </div>
                    <div className="aspect-[3/4] relative group overflow-hidden bg-black lg:translate-y-16">
                        <Image
                            src={fashionImages.look2}
                            alt="Look 02"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute bottom-4 left-4 font-mono text-xs z-10">
                            <span className="block">ОБРАЗ_02</span>
                            <span className="block text-neutral-400">ОБСИДИАНОВЫЙ ШЕЛК</span>
                        </div>
                    </div>
                    <div className="aspect-[3/4] relative group overflow-hidden bg-black">
                        <Image
                            src={fashionImages.look3}
                            alt="Look 03"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute bottom-4 left-4 font-mono text-xs z-10">
                            <span className="block">ОБРАЗ_03</span>
                            <span className="block text-neutral-400">ЖИДКИЙ МЕТАЛЛ</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manifesto */}
            <section className="py-32 px-6 bg-black text-center">
                <div className="max-w-4xl mx-auto border border-white/20 p-12 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white"></div>

                    <h3 className="text-sm font-mono uppercase tracking-widest mb-8 text-neutral-500">
                        / Манифест
                    </h3>
                    <p className="text-2xl md:text-5xl font-bold leading-tight uppercase tracking-tight">
                        "Мы не создаем одежду. <br />
                        Мы куем <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-700">броню</span> для современной души."
                    </p>
                </div>
            </section>

            {/* Runway Tape Effect */}
            <div className="bg-white text-black py-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-yellow-400 mix-blend-multiply opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="whitespace-nowrap flex gap-10 font-black text-4xl uppercase tracking-tighter"
                >
                    <span>Предзаказ Открыт</span>
                    <span>•</span>
                    <span>Лимитированная Коллекция</span>
                    <span>•</span>
                    <span>Доставка по Миру</span>
                    <span>•</span>
                    <span>Предзаказ Открыт</span>
                    <span>•</span>
                    <span>Лимитированная Коллекция</span>
                    <span>•</span>
                    <span>Доставка по Миру</span>
                    <span>•</span>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="py-24 px-6 flex flex-col md:flex-row justify-between items-end border-t border-white/10">
                <div>
                    <h4 className="font-bold text-xl mb-4">НУАР МОД</h4>
                    <ul className="space-y-2 text-sm text-neutral-500 font-mono">
                        <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
                        <li className="hover:text-white cursor-pointer transition-colors">TikTok</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Press</li>
                    </ul>
                </div>
                <div className="mt-8 md:mt-0 text-right">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-600">
                        © 2026 Noir Mode Inc.
                    </p>
                </div>
            </footer>
        </main>
    );
}
