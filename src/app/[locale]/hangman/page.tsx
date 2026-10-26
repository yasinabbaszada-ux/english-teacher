import { getTranslations, setRequestLocale } from "next-intl/server";
import HangmanGame from "@/components/HangmanGame";

export default async function HangmanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hangman");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* animated background scene */}
      <div
        aria-hidden
        className="animate-kenburns pointer-events-none absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-[2px]"
        style={{ backgroundImage: "url('/hangman-bg.png')" }}
      />
      {/* light readability overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/15 via-background/25 to-background/60"
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            🪢 {t("title")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted">{t("subtitle")}</p>
        </header>

        <HangmanGame />
      </div>
    </div>
  );
}
