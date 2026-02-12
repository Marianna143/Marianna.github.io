"use client";

import { motion } from "framer-motion";
import PainDoreNav from "../components/PainDoreNav";
import PainDoreFooter from "../components/PainDoreFooter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#5A4A42] font-sans selection:bg-[#D4A373] selection:text-white pt-32">
            <PainDoreNav />

            <section className="px-6 md:px-12 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Контакты</h1>
                    <p className="text-lg opacity-60 italic max-w-2xl mx-auto">
                        Мы всегда рады видеть вас и ответить на ваши вопросы.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-[#D4A373]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Адрес</h3>
                                <p className="opacity-70 text-lg">ул. Большая Дмитровка, 12<br />Москва, Россия, 125009</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="w-6 h-6 text-[#D4A373]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Телефон</h3>
                                <p className="opacity-70 text-lg">+7 (495) 123-45-67</p>
                                <p className="opacity-60 text-sm mt-1">Ежедневно с 9:00 до 21:00</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-[#D4A373]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Почта</h3>
                                <p className="opacity-70 text-lg">hello@paindore.ru</p>
                                <p className="opacity-60 text-sm mt-1">Для сотрудничества и заказов</p>
                            </div>
                        </div>
                    </div>

                    <form className="bg-white p-8 rounded-3xl shadow-lg border border-[#D4A373]/10">
                        <h3 className="text-2xl font-serif mb-6">Напишите нам</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-70">Имя</label>
                                <input type="text" className="w-full bg-[#EFEBE4]/30 border border-[#D4A373]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-70">Email</label>
                                <input type="email" className="w-full bg-[#EFEBE4]/30 border border-[#D4A373]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-70">Сообщение</label>
                                <textarea rows={4} className="w-full bg-[#EFEBE4]/30 border border-[#D4A373]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors resize-none"></textarea>
                            </div>
                            <button className="w-full py-4 bg-[#D4A373] text-white font-bold tracking-widest uppercase rounded-xl hover:bg-[#C29365] transition-colors">
                                Отправить
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <PainDoreFooter />
        </main>
    );
}
