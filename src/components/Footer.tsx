import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/data";

export default async function Footer() {
  const t = await getTranslations();
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-fg">
              E
            </span>
            English Teacher
          </div>
          <p className="mt-3 text-sm text-muted">{t("footer.madeWith")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("contact.title")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone}`} className="hover:text-primary">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-primary"
                >
                  {settings.email}
                </a>
              </li>
            )}
            {settings.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-start gap-3 sm:justify-end">
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              Instagram
            </a>
          )}
          {settings.telegram && (
            <a
              href={settings.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              Telegram
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {year} English Teacher. {t("footer.rights")}
      </div>
    </footer>
  );
}
