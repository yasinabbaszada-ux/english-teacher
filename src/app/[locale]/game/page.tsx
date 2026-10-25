import { getTranslations, setRequestLocale } from "next-intl/server";
import WordScramble from "@/components/WordScramble";

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("game");

  return (
    <div className="relative overflow-hidden">
      {/* background image (drop /public/game-bg.jpg to use it) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/game-bg.jpg')" }}
      />
      {/* decorative blobs + overlay to keep text readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/60 to-background"
      />
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slower pointer-events-none absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
            🎮 {t("title")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted">{t("subtitle")}</p>
        </header>

        <WordScramble />
      </div>
    </div>
  );
}
