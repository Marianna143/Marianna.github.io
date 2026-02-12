"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Droplet, Leaf, Calendar } from "lucide-react";

// Minimalist, high-end spa images
const beautyImages = {
    hero: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop", // Soft spa interior
    product: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2000&auto=format&fit=crop", // Serum
    facial: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000&auto=format&fit=crop", // Clean skin
    interior: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" // Plants/White
};

export default function EtherealGlowPage() {
    return (
        <main className="min-h-screen bg-white text-[#4A4A4A] font-sans selection:bg-[#E8F3E8] selection:text-black">
            {/* Custom Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
                    <ArrowLeft className="w-5 h-5 font-light" />
                    <span className="text-xs tracking-[0.2em] uppercase">Назад</span>
                </Link>
                <div className="text-lg tracking-[0.3em] font-light uppercase">Эфирное Сияние</div>
                <button className="text-xs tracking-[0.2em] uppercase border border-[#4A4A4A]/20 px-6 py-2 rounded-full hover:bg-[#4A4A4A] hover:text-white transition-all">
                    Записаться
                </button>
            </nav>

            {/* Split Hero */}
            <section className="h-screen flex flex-col md:flex-row pt-20">
                <div className="w-full md:w-1/2 flex items-center justify-center p-12">
                    <div className="max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <span className="block text-xs uppercase tracking-[0.3em] text-[#8BA88E] mb-6">
                                Холистический уход
                            </span>
                            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-[1.1]">
                                Раскройте своё <br />
                                <span className="italic font-serif">естественное</span> сияние.
                            </h1>
                            <p className="text-sm leading-8 opacity-60 mb-10 max-w-xs">
                                Научный подход в сочетании с древними ритуалами.
                                Устойчивое развитие, органика и только вы.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-[#4A4A4A] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-[#8BA88E] transition-colors">
                                    Магазин
                                </button>
                                <button className="px-8 py-4 rounded-full text-xs uppercase tracking-widest border border-[#4A4A4A]/20 hover:border-[#4A4A4A] transition-colors">
                                    О нас
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative bg-[#F4F6F4]">
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-x-8 inset-y-8 md:inset-16 overflow-hidden rounded-t-[100px] md:rounded-t-[200px]"
                    >
                        <Image
                            src={beautyImages.hero}
                            alt="Spa Interior"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Grid */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-[#FAFAFA] rounded-2xl"
                        >
                            <Sparkles className="w-8 h-8 text-[#8BA88E] mb-6 mx-auto md:mx-0" />
                            <h3 className="text-xl font-medium mb-4">Чистый состав</h3>
                            <p className="text-sm opacity-60 leading-relaxed">
                                100% растительные ингредиенты, не тестируется на животных.
                                Без парабенов, сульфатов и синтетических отдушек.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-[#FAFAFA] rounded-2xl"
                        >
                            <Droplet className="w-8 h-8 text-[#8BA88E] mb-6 mx-auto md:mx-0" />
                            <h3 className="text-xl font-medium mb-4">Глубокое увлажнение</h3>
                            <p className="text-sm opacity-60 leading-relaxed">
                                Восстановление водного баланса и защита барьерных функций.
                                Забота о естественном микробиоме вашей кожи.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-[#FAFAFA] rounded-2xl"
                        >
                            <Leaf className="w-8 h-8 text-[#8BA88E] mb-6 mx-auto md:mx-0" />
                            <h3 className="text-xl font-medium mb-4">Экологичность</h3>
                            <p className="text-sm opacity-60 leading-relaxed">
                                Стеклянная упаковка, рефилы и углеродно-нейтральная
                                доставка по всему миру.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Highlight */}
            <section className="py-20 bg-[#F9F9F9]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 px-6">
                    <div className="w-full md:w-1/2 relative aspect-square">
                        <div className="absolute inset-0 bg-[#E8F3E8] rounded-full blur-3xl opacity-50 -z-10" />
                        <Image
                            src={beautyImages.product}
                            alt="Signature Serum"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <span className="text-[#8BA88E] uppercase tracking-widest text-xs font-bold mb-4 block">
                            Бестселлер
                        </span>
                        <h2 className="text-4xl font-light mb-6">Ночная сыворотка Luminous</h2>
                        <p className="text-lg opacity-60 mb-8 leading-relaxed">
                            Мощная смесь гиалуроновой кислоты, витамина С и редких растительных экстрактов.
                            Восстанавливает кожу пока вы спите, даря заметное сияние утром.
                        </p>
                        <ul className="space-y-4 mb-10 text-sm opacity-70">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#8BA88E]" />
                                Стимулирует выработку коллагена
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#8BA88E]" />
                                Разглаживает мелкие морщинки
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#8BA88E]" />
                                Глубокое клеточное увлажнение
                            </li>
                        </ul>
                        <button className="bg-[#4A4A4A] text-white px-10 py-4 rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                            В корзину — 8 500 ₽
                        </button>
                    </div>
                </div>
            </section>

            {/* Booking / CTA */}
            <section className="py-32 px-6 flex justify-center items-center relative overflow-hidden">
                <Image
                    src={beautyImages.interior}
                    alt="Spa background"
                    fill
                    className="object-cover opacity-10"
                />
                <div className="relative z-10 text-center max-w-2xl bg-white/80 backdrop-blur-xl p-16 rounded-3xl border border-white/50 shadow-sm">
                    <Calendar className="w-10 h-10 mx-auto text-[#4A4A4A] mb-6" />
                    <h2 className="text-3xl md:text-4xl font-light mb-6">Ощутите гармонию</h2>
                    <p className="opacity-60 mb-10">
                        Посетите наш флагманский центр в Москве или Санкт-Петербурге для
                        персональной консультации и ухода.
                    </p>
                    <button className="text-[#4A4A4A] border-b border-[#4A4A4A] pb-1 uppercase tracking-[0.2em] text-xs hover:opacity-50 transition-opacity">
                        Смотреть меню процедур
                    </button>
                </div>
            </section>
        </main>
    );
}
