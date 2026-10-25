import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import MaterialCard from "@/components/MaterialCard";
import { getMaterials, getSettings } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations();
  const settings = await getSettings();
  const materials = await getMaterials();
  const featured = materials.slice(0, 3);

  const heroTitle = loc(settings, "hero_title", l) || t("hero.title");
  const heroSubtitle = loc(settings, "hero_subtitle", l) || t("hero.subtitle");

  return (
    <>
      <Hero
        badge={t("hero.badge")}
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaMaterials={t("hero.ctaMaterials")}
        ctaContact={t("hero.ctaContact")}
        whatsapp={settings.whatsapp}
        stats={[
          { value: `${settings.years_experience ?? 5}+`, label: t("hero.stat1") },
          { value: `${settings.students_count ?? 100}+`, label: t("hero.stat2") },
          { value: `${materials.length}+`, label: t("hero.stat3") },
        ]}
      />

      {/* Featured materials */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("materials.title")}
            </h2>
            <p className="mt-1 text-muted">{t("materials.subtitle")}</p>
          </div>
          <Link
            href="/materials"
            className="hidden rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary sm:inline-block"
          >
            {t("materials.all")} →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-muted">{t("materials.empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.08}>
                <MaterialCard material={m} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/materials"
            className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            {t("materials.all")} →
          </Link>
        </div>
      </section>
    </>
  );
}
