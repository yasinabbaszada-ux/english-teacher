"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";

type Stat = { value: string; label: string };

export default function Hero({
  badge,
  title,
  subtitle,
  ctaMaterials,
  ctaContact,
  whatsapp,
  stats,
}: {
  badge: string;
  title: string;
  subtitle: string;
  ctaMaterials: string;
  ctaContact: string;
  whatsapp: string | null;
  stats: Stat[];
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-slow absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="animate-float-slower absolute -right-16 top-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="animate-float-slow absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-ring/20 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:py-32"
      >
        <motion.span
          variants={item}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          {badge}
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-lg text-muted"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/materials"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
          >
            {ctaMaterials}
          </Link>
          <a
            href={whatsapp ? `https://wa.me/${whatsapp}` : "#contact"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            {ctaContact}
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 grid w-full max-w-lg grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur"
            >
              <div className="text-2xl font-extrabold text-primary sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
