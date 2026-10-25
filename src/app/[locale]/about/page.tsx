import { getTranslations, setRequestLocale } from "next-intl/server";
import ProfilePhoto from "@/components/ProfilePhoto";
import Certificates from "@/components/Certificates";
import Reveal from "@/components/Reveal";
import { getCertificates, getSettings, mediaUrl } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

// Content is managed from the admin panel, so always render fresh.
export const dynamic = "force-dynamic";

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
  const certificates = await getCertificates();
  const aboutBody = loc(settings, "about", l) || t("about.body");

  const photoSrc = mediaUrl(settings.photo_path);
  const certItems = certificates
    .map((c) => ({ url: mediaUrl(c.image_path), title: c.title }))
    .filter((c): c is { url: string; title: string | null } => Boolean(c.url));

  const highlights = [
    t("about.h1"),
    t("about.h2"),
    t("about.h3"),
    t("about.h4"),
  ];

  const az = l === "az";
  const location = az ? "Bakı, Azərbaycan" : "Baku, Azerbaijan";

  const experience: {
    role: string;
    company: string;
    period: string;
    place?: string;
  }[] = [
    {
      role: az ? "İngilis dili müəllimi" : "English Teacher",
      company: az ? "Xəzər Universiteti" : "Khazar University",
      period: az ? "Mart 2026 – indi" : "Mar 2026 – Present",
    },
    {
      role: az ? "İngilis dili müəllimi" : "English Teacher",
      company: "iTTi – International TEFL Training Institute",
      period: az ? "Sentyabr 2025 – indi" : "Sep 2025 – Present",
    },
    {
      role: az
        ? "İngilis dili və incəsənət müəllimi"
        : "English Language Art Teacher",
      company: az
        ? "Azərbaycan Dillər Universiteti"
        : "Azerbaijan University of Languages",
      period: az ? "Fevral 2025 – May 2025" : "Feb 2025 – May 2025",
    },
    {
      role: az ? "İngilis dili müəllimi" : "General English Teacher",
      company: "VIP Academy",
      period: az ? "Sentyabr 2023 – Avqust 2026" : "Sep 2023 – Aug 2026",
    },
    {
      role: az ? "Onlayn İngilis dili müəllimi" : "Online English Instructor",
      company: az ? "Fərdi / onlayn dərslər" : "Private / online lessons",
      period: az ? "2020 – indi" : "2020 – Present",
      place: az ? "Onlayn" : "Online",
    },
  ];

  const education = [
    {
      degree: az
        ? "Magistr — Dilçilik (ingilis dilində)"
        : "Master's degree — Linguistics (in English)",
      school: az
        ? "Azərbaycan Dillər Universiteti"
        : "Azerbaijan State University of Languages",
      period: "2021 – 2023",
    },
    {
      degree: az
        ? "Bakalavr — İngilis dilinin tədrisi (ESL)"
        : "Bachelor's degree — Teaching English as a Second/Foreign Language (ESL)",
      school: az
        ? "Azərbaycan Dillər Universiteti"
        : "Azerbaijan State University of Languages",
      period: "2017 – 2021",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* Intro: photo + info */}
      <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr]">
        <Reveal>
          <ProfilePhoto src={photoSrc} alt={t("about.photoAlt")} />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {t("about.role")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("about.title")}
          </h1>
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted">
            {aboutBody}
          </p>

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

      {/* Experience */}
      <section className="mt-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t("about.expTitle")}
          </h2>
        </Reveal>
        <div className="mt-8 max-w-2xl">
          {experience.map((e, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="relative border-l-2 border-border pb-8 pl-6 last:pb-0">
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <h3 className="font-bold">{e.role}</h3>
                <p className="text-sm font-medium text-primary">{e.company}</p>
                <p className="mt-1 text-xs text-muted">
                  {e.period} · {e.place ?? location}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-16">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t("about.eduTitle")}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xl">🎓</span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {e.period}
                  </span>
                </div>
                <h3 className="mt-2 font-bold leading-snug">{e.degree}</h3>
                <p className="mt-1 text-sm text-muted">{e.school}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

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
            <Certificates
              items={certItems}
              placeholder={t("about.certPlaceholder")}
            />
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
