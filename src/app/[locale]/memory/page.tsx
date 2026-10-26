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
      {/* background scene — full image, no zoom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/memory-bg.png')" }}
      />
      {/* light readability overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/20 via-background/30 to-background/70"
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-6 py-3 text-2xl font-extrabold tracking-tight text-primary shadow-sm backdrop-blur sm:text-3xl">
            🃏 {t("title")}
          </span>
          <p className="mx-auto mt-4 inline-block rounded-full bg-card/85 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur">
            {t("subtitle")}
          </p>
        </header>

        <MemoryGame />
      </div>
    </div>
  );
}
