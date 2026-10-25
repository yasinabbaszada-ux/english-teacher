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

      <Reveal delay={0.2}>
        <div className="mt-10">
          <p className="text-sm font-semibold text-muted">{t("contact.social")}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/aytan-abbasova-366453372"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-transparent hover:bg-[#0A66C2] hover:text-white hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/englishwith.ayten"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.47 1.38.9.43.42.69.82.9 1.38.17.43.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.21.56-.47.96-.9 1.38-.42.43-.82.69-1.38.9-.43.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.43-.37-1.06-.42-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.21-.56.47-.96.9-1.38.42-.43.82-.69 1.38-.9.43-.17 1.06-.37 2.23-.42C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.93 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.38 2.13.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
                <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
                <circle cx="18.41" cy="5.59" r="1.44" />
              </svg>
            </a>

            {/* Threads */}
            <a
              href="https://www.threads.com/@englishwith.ayten"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
              className="group grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-transparent hover:bg-black hover:text-white hover:shadow-lg"
            >
              <svg viewBox="0 0 192 192" fill="currentColor" className="h-7 w-7">
                <path d="M141.5 90.4c-.7-.3-1.4-.6-2.1-.9-1.2-22.7-13.6-35.7-34.5-35.9h-.3c-12.5 0-22.9 5.3-29.3 15l11.5 7.9c4.8-7.2 12.3-8.8 17.8-8.8h.2c6.8 0 12 2 15.3 5.9 2.4 2.8 4 6.7 4.8 11.6-6-1-12.5-1.3-19.4-.9-19.5 1.1-32 12.5-31.2 28.3.4 8 4.4 14.9 11.2 19.4 5.8 3.8 13.2 5.7 20.9 5.3 10.2-.6 18.2-4.5 23.8-11.6 4.2-5.4 6.9-12.4 8.1-21.2 4.9 3 8.5 6.9 10.5 11.6 3.4 8 3.6 21.1-7.1 31.8-9.4 9.4-20.7 13.5-37.7 13.6-18.9-.1-33.2-6.2-42.5-18-8.7-11.1-13.2-27.1-13.4-47.6.2-20.5 4.7-36.5 13.4-47.6 9.3-11.8 23.6-17.9 42.5-18 19 .1 33.5 6.2 43.1 18.2 4.7 5.9 8.3 13.3 10.6 21.9l13.5-3.6c-2.8-10.6-7.3-19.7-13.4-27.4C154.1 15.5 136.3 7.2 112.9 7h-.1c-23.3.2-41 8.5-52.5 24.8C49.6 46.2 44.1 66.2 44 91.9v.2c.1 25.7 5.6 45.7 16.3 60.1 11.5 16.3 29.2 24.6 52.5 24.8h.1c20.7-.1 35.3-5.5 47.3-17.5 15.7-15.7 15.2-35.4 10-47.5-3.7-8.7-10.8-15.8-20.7-20.6zm-35.8 35.8c-8.5.5-17.4-3.3-17.8-11.6-.3-6.2 4.4-13.1 18.3-13.9 1.6-.1 3.1-.1 4.6-.1 5 0 9.7.5 14 1.4-1.6 20-11 24.1-19.1 24.6z" />
              </svg>
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}
