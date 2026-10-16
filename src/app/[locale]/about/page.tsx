import { getTranslations, setRequestLocale } from "next-intl/server";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">
        {t("about.title")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{aboutBody}</p>

      <div className="mt-12 rounded-3xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold">{t("contact.title")}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {settings.phone && (
            <li className="flex justify-between border-b border-border pb-3">
              <span className="text-muted">{t("contact.phone")}</span>
              <a href={`tel:${settings.phone}`} className="font-medium hover:text-primary">
                {settings.phone}
              </a>
            </li>
          )}
          {settings.email && (
            <li className="flex justify-between border-b border-border pb-3">
              <span className="text-muted">{t("contact.email")}</span>
              <a href={`mailto:${settings.email}`} className="font-medium hover:text-primary">
                {settings.email}
              </a>
            </li>
          )}
          {settings.whatsapp && (
            <li className="flex justify-between">
              <span className="text-muted">{t("contact.whatsapp")}</span>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary"
              >
                {t("contact.cta")}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
