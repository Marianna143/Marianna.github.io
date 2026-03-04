"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendToTelegram } from "@/app/actions";
import { AlertCircle, CheckCircle, Handshake, Send, ShieldCheck, Timer } from "lucide-react";

const benefits = [
    { icon: Timer, title: "Ответ в день обращения" },
    { icon: ShieldCheck, title: "Прозрачные этапы и сроки" },
    { icon: Handshake, title: "Сопровождение после запуска" },
];

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    async function handleSubmit(formData: FormData) {
        setStatus("sending");
        const result = await sendToTelegram(formData);
        if (result.success) {
            setStatus("success");
            setTimeout(() => setStatus("idle"), 5000);
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    }

    return (
        <section id="contact" className="py-32 px-6 relative overflow-hidden">
            <motion.div
                className="absolute -right-20 top-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.65, 0.25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 italic">
                        Обсудим <span className="text-emerald-500">ваш проект?</span>
                    </h2>
                    <p className="text-emerald-100/60">
                        Оставьте заявку, и я напишу вам в Телеграм, чтобы обсудить задачу и предложить лучшее решение.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.35 }}
                            className="glass rounded-2xl p-4 flex items-center gap-3"
                        >
                            <benefit.icon className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-100/80 text-sm">{benefit.title}</span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.form
                    action={handleSubmit}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass p-10 rounded-[2rem] space-y-6 relative overflow-hidden"
                >
                    <div className="absolute -top-12 -left-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-500/70 ml-2">Как вас зовут?</label>
                            <input
                                required
                                name="name"
                                placeholder="Иван"
                                className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-emerald-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-500/70 ml-2">Ваш ник в Телеграм</label>
                            <input
                                required
                                name="telegram"
                                placeholder="@username"
                                className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-emerald-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-500/70 ml-2">Какой сайт вам нужен?</label>
                        <select
                            name="type"
                            className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-emerald-50 appearance-none"
                        >
                            <option value="tilda">Сайт на Тильде</option>
                            <option value="code">Кодовый сайт</option>
                            <option value="taplink">Таплинк / Визитка</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-500/70 ml-2">Пожелания к проекту</label>
                        <textarea
                            name="wishes"
                            rows={4}
                            placeholder="Расскажите о вашей задаче и целях..."
                            className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-emerald-50 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group"
                    >
                        {status === "idle" && (
                            <>
                                Отправить заявку
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                        {status === "sending" && <span className="animate-pulse">Отправка...</span>}
                        {status === "success" && (
                            <>
                                Успешно отправлено
                                <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                        {status === "error" && (
                            <>
                                Ошибка отправки
                                <AlertCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20"
                            >
                                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                                <h3 className="text-2xl font-bold text-emerald-50">Заявка принята!</h3>
                                <p className="text-emerald-100/60 mt-2">Я напишу вам в Телеграм в ближайшее время.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.form>
            </div>
        </section>
    );
}
