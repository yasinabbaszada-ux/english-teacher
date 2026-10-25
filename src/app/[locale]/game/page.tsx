import { getTranslations, setRequestLocale } from "next-intl/server";
import WordScramble from "@/components/WordScramble";
import GameTitle from "@/components/GameTitle";

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("game");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* animated background scene */}
      <div
        aria-hidden
        className="animate-kenburns pointer-events-none absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: "url('/game-bg.png')" }}
      />
      {/* readability overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/55 to-background/85"
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 text-center">
          <GameTitle />
          <p className="mx-auto mt-5 max-w-md rounded-full bg-card/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
            {t("subtitle")}
          </p>
        </header>

        <WordScramble />
      </div>
    </div>
  );
}
