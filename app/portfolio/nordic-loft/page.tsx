"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Home, LampFloor, Palette, Ruler, Sofa, Sparkles } from "lucide-react";
import NordicNav from "./components/NordicNav";

const principles = [
  {
    title: "Мягкая презентация",
    text: "Сайт продает не квадратные метры, а ощущение дома: тишину, свет и тактильность материалов.",
    icon: Sofa,
  },
  {
    title: "Галерейный ритм",
    text: "Блоки собраны как журнальная верстка: чередование воздуха, крупных заголовков и деталей.",
    icon: Palette,
  },
  {
    title: "Сценарий работ",
    text: "Каждый этап раскрыт визуально и понятно, чтобы клиент без созвона понял формат взаимодействия.",
    icon: Ruler,
  },
  {
    title: "Акцент на свет",
    text: "Анимации деликатные: они добавляют ощущение жизни, но не отвлекают от кейсов.",
    icon: LampFloor,
  },
];

const quickFacts = [
  "Подача в стиле интерьерного журнала",
  "Светлая палитра + тактильные блоки",
  "Легкая анимация без визуального шума",
];

export default function NordicLoftPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe4] text-[#2d2620] selection:bg-[#d8c8ad] selection:text-[#1b1713]">
      <NordicNav />

      <section className="relative border-b border-[#ccbda4]/45">
        <motion.div
          className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-[42%_58%_55%_45%/50%_38%_62%_50%] bg-[#d9c9ac]/58 blur-[90px]"
          animate={{
            borderRadius: [
              "42% 58% 55% 45% / 50% 38% 62% 50%",
              "56% 44% 50% 50% / 44% 56% 44% 56%",
              "48% 52% 62% 38% / 58% 36% 64% 42%",
              "42% 58% 55% 45% / 50% 38% 62% 50%",
            ],
            x: [0, 20, 0],
            y: [0, 16, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bca989]/70 bg-[#f7f1e8] px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#6f604d]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Nordic Loft Concept
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-5xl leading-[1.03] md:text-7xl"
            >
              Интерьерный сайт
              <span className="block italic text-[#6a5a47]">с атмосферой тихой роскоши</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-7 max-w-2xl text-[#2d2620]/70 leading-relaxed"
            >
              Здесь акцент не на «кричащих» эффектах, а на выверенной эстетике. Структура напоминает лонгрид: крупные блоки, воздух,
              мягкие переходы и фокус на экспертности студии.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/portfolio/nordic-loft/proekty"
                className="inline-flex items-center gap-2 rounded-full bg-[#2f2821] px-6 py-3 font-medium text-[#f5efe6] transition-transform hover:-translate-y-0.5 hover:bg-[#41372d]"
              >
                Смотреть проекты
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio/nordic-loft/etapy"
                className="inline-flex items-center gap-2 rounded-full border border-[#b8a486]/70 bg-[#f8f3ea] px-6 py-3 text-[#2f2821] hover:bg-[#eee5d7] transition-colors"
              >
                Этапы реализации
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[2rem] border border-[#cbbba2]/70 bg-[#f7f2e9] p-6 shadow-[0_24px_70px_rgba(76,56,31,0.14)]"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <motion.div
                className="row-span-2 rounded-2xl border border-[#cfbea3]/70 bg-gradient-to-b from-[#ede3d2] to-[#f8f3ea] p-5"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Home className="h-6 w-6 text-[#6c5b46]" />
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#7e6f5b]">Главный экран</p>
                <p className="mt-2 text-xl leading-snug">Атмосфера, УТП, подборка кейсов и мягкая запись на консультацию.</p>
              </motion.div>

              {quickFacts.map((fact, index) => (
                <motion.div
                  key={fact}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.45 }}
                  className="rounded-2xl border border-[#cfbea3]/65 bg-[#fcf8f1] px-4 py-4 text-sm leading-relaxed text-[#4b4033]"
                >
                  {fact}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-[#c7b69d]/70 bg-[#f8f3ea] p-6"
              >
                <Icon className="mb-4 h-6 w-6 text-[#6f5f4d] transition-transform duration-300 group-hover:scale-110" />
                <h2 className="text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#2d2620]/67">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
