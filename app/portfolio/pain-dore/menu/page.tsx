"use client";

import { motion } from "framer-motion";
import PainDoreNav from "../components/PainDoreNav";
import PainDoreFooter from "../components/PainDoreFooter";

const menuItems = [
    {
        category: "Хлеб", items: [
            { name: "Деревенский Тартин", price: "450 ₽", desc: "Закваска 24ч, пшеничная мука в/с." },
            { name: "Ржаной Бородинский", price: "400 ₽", desc: "С кориандром и солодом." },
            { name: "Багет Традиционный", price: "250 ₽", desc: "Хрустящая корочка, воздушный мякиш." },
            { name: "Чиабатта с Оливками", price: "350 ₽", desc: "Итальянские травы и оливки каламата." },
        ]
    },
    {
        category: "Выпечка", items: [
            { name: "Круассан", price: "250 ₽", desc: "Классический, на сливочном масле." },
            { name: "Пан-о-шоколя", price: "320 ₽", desc: "С темным бельгийским шоколадом." },
            { name: "Улитка с Изюмом", price: "280 ₽", desc: "Заварной крем и изюм." },
            { name: "Миндальный Круассан", price: "350 ₽", desc: "Двойная выпечка, миндальный франжипан." },
        ]
    },
    {
        category: "Кофе", items: [
            { name: "Эспрессо", price: "150 ₽", desc: "Зерно Эфиопия Иргачифф." },
            { name: "Капучино", price: "250 ₽", desc: "Мягкая пена, сбалансированный вкус." },
            { name: "Флэт Уайт", price: "280 ₽", desc: "Насыщенный кофейный вкус." },
            { name: "Раф Ванильный", price: "350 ₽", desc: "Сливки, ванильный сахар." },
        ]
    }
];

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#5A4A42] font-sans selection:bg-[#D4A373] selection:text-white pt-32">
            <PainDoreNav />

            <section className="px-6 md:px-12 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Наше Меню</h1>
                    <p className="text-lg opacity-60 italic max-w-2xl mx-auto">
                        Мы выпекаем хлеб небольшими партиями в течение всего дня, чтобы он всегда был свежим.
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {menuItems.map((section, idx) => (
                        <motion.div
                            key={section.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-serif mb-10 text-[#D4A373] border-b border-[#D4A373]/20 pb-4 inline-block pr-12">
                                {section.category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {section.items.map((item) => (
                                    <div key={item.name} className="flex flex-col">
                                        <div className="flex justify-between items-baseline mb-2 border-b border-[#5A4A42]/10 border-dashed pb-1">
                                            <h3 className="text-xl font-medium">{item.name}</h3>
                                            <span className="text-lg font-bold">{item.price}</span>
                                        </div>
                                        <p className="opacity-60 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <PainDoreFooter />
        </main>
    );
}
