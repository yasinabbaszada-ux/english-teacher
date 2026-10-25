import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSettings } from "@/lib/data";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const settings = await getSettings();

  const cards = [
    settings.phone && {
      label: t("contact.phone"),
      value: settings.phone,
      href: `tel:${settings.phone}`,
      icon: "📞",
    },
    settings.whatsapp && {
      label: t("contact.whatsapp"),
      value: t("contact.cta"),
      href: `https://wa.me/${settings.whatsapp}`,
      icon: "💬",
      external: true,
    },
    settings.email && {
      label: t("contact.email"),
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: "✉️",
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    icon: string;
    external?: boolean;
  }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Reveal>
        <h1 className="text-4xl font-extrabold tracking-tight">
          {t("contact.title")}
        </h1>
        <p className="mt-2 text-lg text-muted">{t("contact.subtitle")}</p>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="mt-4 text-xs uppercase tracking-wide text-muted">
                {c.label}
              </span>
              <span className="mt-1 font-semibold break-words group-hover:text-primary">
                {c.value}
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {(settings.instagram || settings.telegram) && (
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                Instagram
              </a>
            )}
            {settings.telegram && (
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                Telegram
              </a>
            )}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.25}>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}
