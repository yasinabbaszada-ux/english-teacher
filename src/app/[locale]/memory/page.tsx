import { getTranslations, setRequestLocale } from "next-intl/server";
import MemoryGame from "@/components/MemoryGame";

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("memory");

  return (
    <div className="game-immersive relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10"
      />
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute -left-20 top-16 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slower pointer-events-none absolute -right-16 bottom-10 -z-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            🃏 {t("title")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted">{t("subtitle")}</p>
        </header>

        <MemoryGame />
      </div>
    </div>
  );
}
