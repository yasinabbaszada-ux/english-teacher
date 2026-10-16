import type { Locale } from "@/i18n/routing";

/**
 * Picks a localized field from a record, e.g. loc(material, "title", "az")
 * returns material.title_az. Falls back to the other locale if empty.
 */
export function loc<T extends Record<string, unknown>>(
  obj: T,
  base: string,
  locale: Locale,
): string {
  const primary = obj[`${base}_${locale}`] as string | null | undefined;
  if (primary) return primary;
  const other = locale === "az" ? "en" : "az";
  const fallback = obj[`${base}_${other}`] as string | null | undefined;
  return fallback ?? "";
}
