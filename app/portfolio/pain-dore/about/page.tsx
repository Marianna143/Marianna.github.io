"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PainDoreNav from "../components/PainDoreNav";
import PainDoreFooter from "../components/PainDoreFooter";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#5A4A42] font-sans selection:bg-[#D4A373] selection:text-white pt-32">
            <PainDoreNav />

            <section className="px-6 md:px-12 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">О Нас</h1>
                    <p className="text-lg opacity-60 italic max-w-2xl mx-auto">
                        История о том, как мука, вода и время превращаются в искусство.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-serif mb-6">Наша Философия</h2>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">
                            Мы начали Pain Doré с простой идеей: хлеб должен быть честным. Без улучшителей, без ускоренной ферментации, без компромиссов.
                        </p>
                        <p className="text-lg leading-relaxed opacity-80">
                            Используя только органическую муку, воду и нашу уникальную закваску, мы даем тесту время раскрыть свой потенциал. 24 часа ферментации создают ту самую хрустящую корочку и неповторимый вкус.
                        </p>
                    </motion.div>
                    <div className="relative aspect-square">
                        <Image
                            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2000&auto=format&fit=crop"
                            alt="Процесс выпечки"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse">
                    <div className="relative aspect-square md:order-2">
                        <Image
                            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2670&auto=format&fit=crop"
                            alt="Команда пекарей"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:order-1"
                    >
                        <h2 className="text-3xl font-serif mb-6">Команда</h2>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">
                            Наши пекари — это художники своего дела. Каждый день они встают до рассвета, чтобы к вашему приходу витрина была полна свежей выпечки.
                        </p>
                        <p className="text-lg leading-relaxed opacity-80">
                            Мы ценим ручной труд и внимание к деталям. Каждый круассан скручивается вручную, каждый багет формуется с любовью.
                        </p>
                    </motion.div>
                </div>
            </section>

            <PainDoreFooter />
        </main>
    );
}
