import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { thumbnailUrl } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import type { Material } from "@/lib/types";

export default async function MaterialCard({
  material,
}: {
  material: Material;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("materials");
  const title = loc(material, "title", locale);
  const description = loc(material, "description", locale);
  const thumb = thumbnailUrl(material.thumbnail_path);

  return (
    <Link
      href={`/materials/${material.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 via-ring/15 to-accent/20">
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="text-5xl font-black text-primary/40">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            material.is_paid
              ? "bg-accent text-black"
              : "bg-primary text-primary-fg"
          }`}
        >
          {material.is_paid ? t("paid") : t("free_label")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug group-hover:text-primary">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">{description}</p>
        )}
        <div className="mt-4 flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-primary">
            {material.is_paid
              ? `${material.price ?? ""} ₼`.trim()
              : t("free_label")}
          </span>
          <span className="text-sm text-muted group-hover:text-primary">
            {material.is_paid ? t("buy") : t("readMore")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
