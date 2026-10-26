"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const tm = useTranslations("menu");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const topLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/materials", label: t("materials") },
  ] as const;

  const gameLinks = [
    { href: "/game", label: t("game") },
    { href: "/hangman", label: t("hangman") },
  ] as const;

  const isGamePath = pathname === "/game" || pathname === "/hangman";
  const [gamesOpen, setGamesOpen] = useState(isGamePath);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkCls = (active: boolean) =>
    `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-card"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            aria-label={tm("open")}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card transition-colors hover:border-primary"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-0.5 w-5 rounded-full bg-foreground" />
              <span className="block h-0.5 w-5 rounded-full bg-foreground" />
              <span className="block h-0.5 w-5 rounded-full bg-foreground" />
            </span>
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg shadow-sm">
              E
            </span>
            <span className="text-lg tracking-tight">English Teacher</span>
          </Link>
        </div>

        <LangSwitcher />
      </div>
      </header>

      {/* Left drawer — rendered OUTSIDE <header> so the header's
          backdrop-blur does not trap its fixed positioning */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[61] flex w-72 max-w-[82vw] flex-col border-r border-border bg-background p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
                    E
                  </span>
                  <span className="tracking-tight">English Teacher</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={tm("close")}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-lg hover:border-primary"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-1">
                {topLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={linkCls(isActive(l.href))}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Games group */}
                <button
                  onClick={() => setGamesOpen((v) => !v)}
                  className={`flex items-center justify-between ${linkCls(
                    isGamePath,
                  )}`}
                >
                  <span>🎮 {t("games")}</span>
                  <span
                    className={`transition-transform ${
                      gamesOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {gamesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 flex flex-col gap-1 border-l border-border pl-2">
                        {gameLinks.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActive(l.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted hover:bg-card hover:text-foreground"
                            }`}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={linkCls(isActive("/contact"))}
                >
                  {t("contact")}
                </Link>
              </nav>

              <div className="mt-auto border-t border-border pt-4">
                <LangSwitcher />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
