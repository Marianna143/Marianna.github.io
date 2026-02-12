"use client";

import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PainDoreNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: "/portfolio/pain-dore", label: "Главная" },
        { href: "/portfolio/pain-dore/menu", label: "Меню" },
        { href: "/portfolio/pain-dore/about", label: "О нас" },
        { href: "/portfolio/pain-dore/contact", label: "Контакты" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-[#FDFBF7]">
                <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-sm tracking-widest uppercase hidden md:inline">Портфолио</span>
                </Link>

                <div className="text-xl font-bold tracking-tighter font-serif absolute left-1/2 -translate-x-1/2">
                    ПЭН ДОРЕ
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-6 text-sm tracking-widest uppercase">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:opacity-70 transition-opacity ${pathname === link.href ? "opacity-100 underline decoration-1 underline-offset-4" : "opacity-70"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => setIsOpen(true)} className="md:hidden">
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-[#2A2320] text-[#FDFBF7] flex flex-col justify-center items-center"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6">
                            <X className="w-8 h-8" />
                        </button>
                        <div className="flex flex-col gap-8 text-center text-3xl font-serif">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-[#D4A373] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
