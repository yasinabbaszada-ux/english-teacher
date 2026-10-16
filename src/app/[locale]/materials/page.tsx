import { getTranslations, setRequestLocale } from "next-intl/server";
import MaterialsBrowser from "@/components/MaterialsBrowser";
import { getCategories, getMaterials, thumbnailUrl } from "@/lib/data";
import { loc } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("materials");
  const [materials, categories] = await Promise.all([
    getMaterials(),
    getCategories(),
  ]);

  const items = materials.map((m) => {
    const title = loc(m, "title", l);
    return {
      id: m.id,
      title,
      description: loc(m, "description", l),
      is_paid: m.is_paid,
      price: m.price,
      category_id: m.category_id,
      thumb: thumbnailUrl(m.thumbnail_path),
      initial: title.charAt(0).toUpperCase(),
    };
  });

  const cats = categories.map((c) => ({ id: c.id, name: loc(c, "name", l) }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </header>
      <MaterialsBrowser items={items} categories={cats} />
    </div>
  );
}
