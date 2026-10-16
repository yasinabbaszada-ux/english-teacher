import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import MaterialCard from "@/components/MaterialCard";
import { getMaterials, getSettings } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

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
  const aboutBody = loc(settings, "about", l) || t("about.body");

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

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t("about.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{aboutBody}</p>
        </Reveal>
      </section>

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

      {/* Contact CTA */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 text-center sm:p-14">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("contact.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              {t("contact.subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
                >
                  {t("contact.cta")}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary"
                >
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
