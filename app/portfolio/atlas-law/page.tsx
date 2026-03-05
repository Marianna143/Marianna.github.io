"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Landmark, Scale, ShieldCheck } from "lucide-react";
import AtlasNav from "./components/AtlasNav";

const metrics = [
  { label: "Договоров в потоке", value: "120+" },
  { label: "Время до первой заявки", value: "3 дня" },
  { label: "Конверсия в консультацию", value: "+41%" },
];

const pillars = [
  {
    title: "Сценарий доверия",
    text: "Первый экран, аргументы и кейсы построены как последовательная защита позиции юриста.",
    icon: Scale,
  },
  {
    title: "Язык конкретики",
    text: "Фразы без воды: клиент сразу видит предмет спора, риски и возможный результат.",
    icon: ShieldCheck,
  },
  {
    title: "Формат для дорогих услуг",
    text: "Подача усиливает статус практики и помогает объяснить стоимость сопровождения.",
    icon: Landmark,
  },
  {
    title: "Продажа экспертности",
    text: "Блоки команды, подхода и кейсов оформлены как доказательная база.",
    icon: BriefcaseBusiness,
  },
];

const practiceLines = [
  "Корпоративные споры и арбитраж",
  "M&A и договорная архитектура",
  "Налоговые риски и защита активов",
  "Комплаенс и превентивный аудит",
];

export default function AtlasLawPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-[#efe5d5] selection:bg-[#cfa96d] selection:text-[#101010]">
      <AtlasNav />

      <section className="relative isolate border-b border-[#cfa96d]/20">
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 h-[34rem] w-[34rem] rounded-full bg-[#cfa96d]/20 blur-[120px]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute left-[-10rem] top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full bg-[#7c5a2c]/28 blur-[130px]"
          animate={{ x: [0, 20, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfa96d]/35 bg-[#111621]/60 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#d8b987]"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Atlas Law Concept
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="text-5xl leading-[1.02] md:text-7xl"
            >
              Юридический сайт
              <span className="block text-[#cfa96d] italic">в формате дорогой редакционной подачи</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-7 max-w-xl leading-relaxed text-[#efe5d5]/72"
            >
              Концепт имитирует сайт юридической практики уровня boutique firm: строгая типографика, выразительные акценты,
              аргументация через структуру и сильный путь к консультации.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/portfolio/atlas-law/praktika"
                className="inline-flex items-center gap-2 rounded-full bg-[#cfa96d] px-6 py-3 font-semibold text-[#111] transition-transform hover:-translate-y-0.5 hover:bg-[#dfbc86]"
              >
                Смотреть практики
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio/atlas-law/kontakty"
                className="inline-flex items-center gap-2 rounded-full border border-[#cfa96d]/45 bg-[#101621]/70 px-6 py-3 text-[#efe5d5] transition-colors hover:bg-[#cfa96d]/14"
              >
                Контактный блок
              </Link>
            </motion.div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.45 }}
                  className="rounded-2xl border border-[#cfa96d]/25 bg-[#0e131d]/70 p-4"
                >
                  <p className="text-2xl font-semibold text-[#e8c992]">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#efe5d5]/58">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#cfa96d]/28 bg-gradient-to-b from-[#111722] to-[#0a0e16] p-7"
          >
            <motion.div
              className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#cfa96d]/20 blur-3xl"
              animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#d5b47f]">Архитектура экрана</p>
            <div className="space-y-3">
              {practiceLines.map((line) => (
                <div key={line} className="rounded-xl border border-[#cfa96d]/24 bg-[#0d121c]/88 px-4 py-3 text-sm text-[#efe5d5]/84">
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-[#cfa96d]/25 bg-[#101723]/80 p-4 text-sm text-[#efe5d5]/70">
              <p className="font-semibold text-[#e9cb98]">Фокус концепта</p>
              <p className="mt-2 leading-relaxed">Переход от «просто услуг» к ощущению сильной юридической позиции и уверенного сопровождения.</p>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-[#cfa96d]/22 bg-[#0d121b]/85 p-6"
              >
                <Icon className="mb-4 h-6 w-6 text-[#d7b57f] transition-transform duration-300 group-hover:rotate-6" />
                <h2 className="text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#efe5d5]/66">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
