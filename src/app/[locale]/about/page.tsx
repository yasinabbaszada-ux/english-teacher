import { getTranslations, setRequestLocale } from "next-intl/server";
import ProfilePhoto from "@/components/ProfilePhoto";
import Certificates from "@/components/Certificates";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations();
  const settings = await getSettings();
  const aboutBody = loc(settings, "about", l) || t("about.body");

  const highlights = [
    t("about.h1"),
    t("about.h2"),
    t("about.h3"),
    t("about.h4"),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* Intro: photo + info */}
      <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr]">
        <Reveal>
          <ProfilePhoto alt={t("about.photoAlt")} />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {t("about.role")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("about.title")}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{aboutBody}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-xs text-primary">
                  ✓
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
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
        </Reveal>
      </div>

      {/* Certificates */}
      <section className="mt-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t("about.certsTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("about.certsSubtitle")}</p>
        </Reveal>
        <div className="mt-8">
          <Reveal delay={0.05}>
            <Certificates count={4} placeholder={t("about.certPlaceholder")} />
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-20">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
            <h2 className="text-2xl font-bold">{t("contact.title")}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {settings.phone && (
                <li className="rounded-2xl border border-border bg-background p-4">
                  <span className="text-xs uppercase text-muted">
                    {t("contact.phone")}
                  </span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="mt-1 block font-semibold hover:text-primary"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="rounded-2xl border border-border bg-background p-4">
                  <span className="text-xs uppercase text-muted">
                    {t("contact.email")}
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block font-semibold hover:text-primary"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="rounded-2xl border border-border bg-background p-4">
                  <span className="text-xs uppercase text-muted">
                    {t("contact.whatsapp")}
                  </span>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block font-semibold hover:text-primary"
                  >
                    {t("contact.cta")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
