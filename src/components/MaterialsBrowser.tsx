"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Item = {
  id: string;
  title: string;
  description: string;
  is_paid: boolean;
  price: number | null;
  category_id: string | null;
  thumb: string | null;
  initial: string;
};

type Cat = { id: string; name: string };

export default function MaterialsBrowser({
  items,
  categories,
}: {
  items: Item[];
  categories: Cat[];
}) {
  const t = useTranslations("materials");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (cat !== "all" && m.category_id !== cat) return false;
      if (price === "free" && m.is_paid) return false;
      if (price === "paid" && !m.is_paid) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !m.title.toLowerCase().includes(q) &&
          !m.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, cat, price, query]);

  const priceTabs: { key: "all" | "free" | "paid"; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "free", label: t("free") },
    { key: "paid", label: t("paid") },
  ];

  return (
    <div>
      {/* controls */}
      <div className="mb-8 flex flex-col gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            {priceTabs.map((p) => (
              <button
                key={p.key}
                onClick={() => setPrice(p.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  price === p.key
                    ? "bg-primary text-primary-fg"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCat("all")}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  cat === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t("all")}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    cat === c.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/materials/${m.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-gradient-to-br from-primary/20 via-ring/15 to-accent/20">
                {m.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.thumb}
                    alt={m.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-5xl font-black text-primary/40">
                    {m.initial}
                  </span>
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    m.is_paid ? "bg-accent text-black" : "bg-primary text-primary-fg"
                  }`}
                >
                  {m.is_paid ? t("paid") : t("free_label")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold leading-snug group-hover:text-primary">
                  {m.title}
                </h3>
                {m.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {m.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-primary">
                    {m.is_paid ? `${m.price ?? ""} ₼`.trim() : t("free_label")}
                  </span>
                  <span className="text-sm text-muted group-hover:text-primary">
                    {m.is_paid ? t("buy") : t("readMore")} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
