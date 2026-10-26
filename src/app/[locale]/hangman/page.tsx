import { getTranslations, setRequestLocale } from "next-intl/server";
import HangmanGame from "@/components/HangmanGame";
import AnimatedTitle from "@/components/AnimatedTitle";

export default async function HangmanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hangman");

  return (
    <div className="game-immersive relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* background scene — full image, no zoom so the chalkboard stays visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/hangman-bg.png')" }}
      />
      {/* light readability overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/20 to-background/45"
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 flex flex-col items-center text-center">
          <AnimatedTitle text="HANGMAN" />
          <p className="mx-auto mt-5 inline-block rounded-full bg-card/85 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur">
            {t("subtitle")}
          </p>
        </header>

        <HangmanGame />
      </div>
    </div>
  );
}
