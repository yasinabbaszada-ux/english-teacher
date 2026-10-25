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
    <div className="mx-auto max-w-5xl px-4 py-14">
      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
          🎮 {t("title")}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </header>

      <WordScramble />
    </div>
  );
}
