import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PaidUnlock from "@/components/PaidUnlock";
import {
  createSignedUrl,
  getMaterial,
  getSettings,
  thumbnailUrl,
} from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const material = await getMaterial(id);
  if (!material) notFound();

  const t = await getTranslations("detail");
  const settings = await getSettings();

  const title = loc(material, "title", l);
  const description = loc(material, "description", l);
  const preview = loc(material, "preview_text", l);
  const thumb = thumbnailUrl(material.thumbnail_path);
  const freeUrl = !material.is_paid
    ? await createSignedUrl(material.file_path)
    : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/materials"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        ← {t("back")}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-ring/15 to-accent/20">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-7xl font-black text-primary/40">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-3 leading-relaxed text-muted">{description}</p>
          )}
          {material.is_paid && preview && (
            <p className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted">
              {preview}
            </p>
          )}

          <div className="mt-6">
            {material.is_paid ? (
              <PaidUnlock
                materialId={material.id}
                title={title}
                price={material.price}
                whatsapp={settings.whatsapp}
              />
            ) : freeUrl ? (
              <a
                href={freeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
              >
                ↓ {t("freeDownload")}
              </a>
            ) : (
              <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
                {t("freeDownload")} — {material.file_path ? "…" : "(demo)"}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
