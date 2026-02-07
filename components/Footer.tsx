"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="py-20 px-6 border-t border-emerald-500/10 text-center">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl font-bold tracking-tighter italic mb-8"
                >
                    Marianna<span className="text-emerald-500">.</span>
                </motion.h3>

                <div className="flex gap-8 mb-12">
                    <a href="#projects" className="text-emerald-100/40 hover:text-emerald-500 transition-colors text-sm uppercase tracking-widest">Работы</a>
                    <a href="#pricing" className="text-emerald-100/40 hover:text-emerald-500 transition-colors text-sm uppercase tracking-widest">Цены</a>
                    <a href="https://t.me/workvinil" className="text-emerald-100/40 hover:text-emerald-500 transition-colors text-sm uppercase tracking-widest">Telegram</a>
                </div>

                <p className="text-emerald-500/20 text-xs tracking-widest uppercase">
                    © 2026 Crafted by Marianna.
                </p>
            </div>
        </footer>
    );
}
