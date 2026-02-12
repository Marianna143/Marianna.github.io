"use client";

import { MapPin, Clock, Instagram, Facebook } from "lucide-react";

export default function PainDoreFooter() {
    return (
        <section className="py-24 px-6 md:px-12 bg-[#2A2320] text-[#EFEBE4]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-none">
                        Визит к нам
                    </h2>
                    <div className="space-y-6 text-lg opacity-80">
                        <div className="flex items-start gap-4">
                            <MapPin className="mt-1" />
                            <p>ул. Большая Дмитровка, 12<br />Москва, Россия</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Clock className="mt-1" />
                            <p>Вт - Вс: 07:00 - 19:00<br />Пн: Выходной</p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <Instagram className="cursor-pointer hover:text-[#D4A373] transition-colors" />
                        <Facebook className="cursor-pointer hover:text-[#D4A373] transition-colors" />
                    </div>
                </div>

                <div className="relative h-full min-h-[300px] border border-[#EFEBE4]/20 p-8 flex flex-col justify-center items-center text-center">
                    <h3 className="text-3xl font-serif mb-4">Наши мастер-классы</h3>
                    <p className="opacity-70 mb-8 max-w-sm">
                        Научитесь искусству приготовления хлеба на закваске вместе с нашим шеф-пекарем.
                        Каждое воскресное утро.
                    </p>
                    <button className="px-8 py-3 bg-[#EFEBE4] text-[#2A2320] font-bold tracking-widest uppercase hover:bg-[#D4A373] hover:text-white transition-colors">
                        Записаться
                    </button>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-[#EFEBE4]/10 text-center opacity-40 text-sm">
                © 2026 Pain Doré. Все права защищены. Концепт для портфолио.
            </div>
        </section>
    );
}
