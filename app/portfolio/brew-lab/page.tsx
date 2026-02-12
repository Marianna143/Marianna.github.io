"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, MapPin, Clock } from "lucide-react";

const coffeeImages = {
    hero: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2600&auto=format&fit=crop", // Industrial Cafe
    pouring: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop", // Latte Art / Pouring
    beans: "https://images.unsplash.com/photo-1511537632536-b7a4896848a5?q=80&w=2000&auto=format&fit=crop", // Beans
    roaster: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2000&auto=format&fit=crop" // Barista/Machine
};

export default function BrewLabPage() {
    return (
        <main className="min-h-screen bg-[#1C1C1C] text-[#E5E5E5] font-sans selection:bg-[#D35400] selection:text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-[#1C1C1C]/80 backdrop-blur-md border-b border-[#E5E5E5]/10">
                <Link href="/" className="flex items-center gap-2 hover:text-[#D35400] transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-mono text-sm uppercase">Проекты</span>
                </Link>
                <div className="font-bold tracking-wider uppercase text-[#D35400]">ЛАБОРАТОРИЯ BREW</div>
                <div className="w-20"></div>
            </nav>

            {/* Hero */}
            <section className="relative h-[90vh] flex items-end pb-20 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={coffeeImages.hero}
                        alt="Industrial Coffee Shop"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent opacity-90" />
                </div>

                <div className="relative z-10 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="block font-mono text-[#D35400] mb-4">ОСН. 2024 • БРУКЛИН</span>
                        <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] mb-8">
                            Алхимия <br /> <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#D35400] to-[#E67E22]">Кофейного Зерна</span>.
                        </h1>
                        <p className="text-xl md:text-2xl opacity-70 max-w-2xl leading-relaxed">
                            Обжарка малыми партиями. Точное заваривание. Индустриальное святилище для кофеиновой души.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Process Grid */}
            <section className="py-24 px-6 bg-[#161616]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="border-l-2 border-[#D35400] pl-6"
                        >
                            <h3 className="text-2xl font-bold mb-2 text-white">Этичное Происхождение</h3>
                            <p className="opacity-60 leading-relaxed">
                                Мы работаем напрямую с фермерами в Эфиопии, Колумбии и Коста-Рике,
                                обеспечивая справедливую оплату и устойчивое земледелие.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="border-l-2 border-[#333] pl-6 hover:border-[#D35400] transition-colors"
                        >
                            <h3 className="text-2xl font-bold mb-2 text-white">Собственная Обжарка</h3>
                            <p className="opacity-60 leading-relaxed">
                                Обжариваем ежедневно небольшими партиями на нашем винтажном ростере Probat,
                                чтобы раскрыть уникальный профиль каждого сорта.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="border-l-2 border-[#333] pl-6 hover:border-[#D35400] transition-colors"
                        >
                            <h3 className="text-2xl font-bold mb-2 text-white">Точность Заваривания</h3>
                            <p className="opacity-60 leading-relaxed">
                                От V60 до Аэропресса — наши бариста обучены извлекать
                                идеальную чашку каждый раз.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src={coffeeImages.pouring} alt="Pouring Coffee" fill className="object-cover" />
                            </div>
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src={coffeeImages.beans} alt="Coffee Beans" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src={coffeeImages.roaster} alt="Barista" fill className="object-cover" />
                            </div>
                            <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#333] flex flex-col justify-center items-center text-center">
                                <Coffee className="w-10 h-10 text-[#D35400] mb-4" />
                                <h4 className="font-bold text-lg mb-2">Подписка</h4>
                                <p className="text-xs opacity-50 mb-4">Свежие зерна с доставкой.</p>
                                <button className="text-[#D35400] text-sm uppercase font-bold hover:underline">Начать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Highlight */}
            <section className="py-32 bg-[#D35400] text-[#1C1C1C]">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-16">Ежедневный Выбор</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Нитро Колд Брю", price: "450 ₽", desc: "Бархатная текстура, ноты шоколада." },
                            { name: "Овсяный Флэт Уайт", price: "380 ₽", desc: "Сливочный, ореховый, идеальный." },
                            { name: "Эспрессо-Тоник", price: "420 ₽", desc: "Цитрусовый, освежающий, сложный." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#1C1C1C] text-[#E5E5E5] p-8 rounded-xl shadow-2xl hover:-translate-y-2 transition-transform">
                                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                <div className="text-[#D35400] font-mono font-bold text-xl mb-4">{item.price}</div>
                                <p className="opacity-60 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="py-24 px-6 bg-[#1C1C1C]">
                <div className="max-w-3xl mx-auto border border-[#333] rounded-2xl p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center text-[#D35400]">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-white">Флакон</h4>
                            <p className="opacity-60">ул. Большая Новодмитровская, 36</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center text-[#D35400]">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-white">Открыты Ежедневно</h4>
                            <p className="opacity-60">08:00 - 22:00</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
