"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Flame, Gauge, Goal, TimerReset, Zap } from "lucide-react";
import PulseNav from "./components/PulseNav";

const statRows = [
  { label: "Запись с первого экрана", value: "+52%" },
  { label: "Среднее время выбора тарифа", value: "2:18" },
  { label: "Повторные визиты", value: "68%" },
];

const focusCards = [
  {
    title: "Быстрый вход в действие",
    text: "Пользователь за секунды понимает: где расписание, какой формат, как записаться на пробную.",
    icon: Zap,
  },
  {
    title: "Продажа абонементов",
    text: "Тарифы вынесены в отдельный поток с четким сравнением и визуальной иерархией выгод.",
    icon: Goal,
  },
  {
    title: "Ритм и мотив",
    text: "Анимация усиливает динамику бренда и поддерживает ощущение движения на каждом экране.",
    icon: Flame,
  },
  {
    title: "Готовность к масштабированию",
    text: "Концепт легко расширяется под франшизу, новые направления и сезонные офферы.",
    icon: TimerReset,
  },
];

const pulseBars = [
  { title: "Функционал", value: 92 },
  { title: "Силовые", value: 78 },
  { title: "Кардио", value: 86 },
];

export default function PulseFitPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#03060c] text-[#e8f7f2] selection:bg-[#31e8b7] selection:text-[#04100c]">
      <PulseNav />

      <section className="relative isolate border-b border-[#31e8b7]/24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(49,232,183,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(49,232,183,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />

        <motion.div
          className="pointer-events-none absolute -left-20 top-0 h-[26rem] w-[26rem] rounded-full bg-[#31e8b7]/24 blur-[120px]"
          animate={{ x: [0, 24, 0], y: [0, 16, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-20 top-20 h-[28rem] w-[28rem] rounded-full bg-[#1a78ff]/20 blur-[120px]"
          animate={{ x: [0, -20, 0], y: [0, -14, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#31e8b7]/45 bg-[#0a131f]/80 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#74ffd4]"
            >
              <Activity className="h-3.5 w-3.5" />
              Pulse Fit Concept
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-5xl leading-[0.98] md:text-7xl"
            >
              Фитнес-сайт
              <span className="block text-[#31e8b7] uppercase tracking-[0.08em]">с энергией живого зала</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.16 }}
              className="mt-7 max-w-2xl leading-relaxed text-[#e8f7f2]/72"
            >
              Концепт заточен под быстрый выбор абонемента: агрессивная подача, мощная визуальная динамика и маршрут до оплаты
              без лишних шагов.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/portfolio/pulse-fit/abonementy"
                className="inline-flex items-center gap-2 rounded-full bg-[#31e8b7] px-6 py-3 font-semibold text-[#03110d] transition-transform hover:-translate-y-0.5 hover:bg-[#5df0c9]"
              >
                Открыть абонементы
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio/pulse-fit/raspisanie"
                className="inline-flex items-center gap-2 rounded-full border border-[#31e8b7]/45 bg-[#06111a]/70 px-6 py-3 text-[#e8f7f2] hover:bg-[#31e8b7]/14 transition-colors"
              >
                Смотреть расписание
              </Link>
            </motion.div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {statRows.map((row, index) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.45 }}
                  className="rounded-2xl border border-[#31e8b7]/28 bg-[#08131d]/82 p-4"
                >
                  <p className="text-2xl font-semibold text-[#8fffe0]">{row.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#e8f7f2]/60">{row.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#31e8b7]/30 bg-[#07111b]/88 p-7"
          >
            <motion.div
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#31e8b7]/20 blur-3xl"
              animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#8dffe0]">Пульсовая аналитика</p>
            <div className="space-y-4">
              {pulseBars.map((bar, index) => (
                <div key={bar.title}>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#dffcf2]/78">
                    <span>{bar.title}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#0c1d2a]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 0.9, delay: 0.35 + index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2effc0] to-[#2ba0ff]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-[#31e8b7]/28 bg-[#081723]/80 p-4 text-sm text-[#e8f7f2]/72">
              <p className="inline-flex items-center gap-2 font-semibold text-[#8cffe0]">
                <Gauge className="h-4 w-4" />
                Фокус концепта
              </p>
              <p className="mt-2 leading-relaxed">Снизить путь до покупки абонемента: меньше сомнений, больше импульса и понятный call-to-action.</p>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {focusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group rounded-2xl border border-[#31e8b7]/24 bg-[#08131d]/84 p-6"
              >
                <Icon className="mb-4 h-6 w-6 text-[#63ffd2] transition-transform duration-300 group-hover:rotate-6" />
                <h2 className="text-2xl text-[#f2fffb]">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#e8f7f2]/66">{card.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
