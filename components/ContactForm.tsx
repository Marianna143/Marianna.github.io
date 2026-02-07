"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendToTelegram } from "@/app/actions";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

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
        <section id="contact" className="py-32 px-6 relative">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 italic">
                        Обсудим <span className="text-emerald-500">ваш проект?</span>
                    </h2>
                    <p className="text-emerald-100/50">
                        Оставьте заявку, и я свяжусь с вами в Telegram в ближайшее время.
                    </p>
                </motion.div>

                <motion.form
                    action={handleSubmit}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass p-10 rounded-[2rem] space-y-6 relative overflow-hidden"
                >
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
                            <label className="text-sm font-medium text-emerald-500/70 ml-2">Ваш Telegram ник</label>
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
                            <option value="tilda">Сайт на Tilda</option>
                            <option value="code">Кодовый сайт (Next.js)</option>
                            <option value="taplink">Taplink / Визитка</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-500/70 ml-2">Пожелания к проекту</label>
                        <textarea
                            name="wishes"
                            rows={4}
                            placeholder="Расскажите о вашей идее..."
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

                    {/* Status Overlay */}
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
                                <p className="text-emerald-100/60 mt-2">Я напишу вам в Telegram в ближайшее время.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.form>
            </div>
        </section>
    );
}
