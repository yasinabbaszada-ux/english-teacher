"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Stored = { url: string; exp: number };

export default function PaidUnlock({
  materialId,
  title,
  price,
  whatsapp,
}: {
  materialId: string;
  title: string;
  price: number | null;
  whatsapp: string | null;
}) {
  const t = useTranslations("detail");
  const storageKey = `unlock:${materialId}`;

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Restore a still-valid unlock from a previous visit.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (parsed.exp > Date.now()) setFileUrl(parsed.url);
        else localStorage.removeItem(storageKey);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  async function redeem() {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), materialId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setStatus("error");
        return;
      }
      setFileUrl(data.url);
      setStatus("idle");
      try {
        const exp = Date.now() + (data.expiresIn ?? 3600) * 1000;
        localStorage.setItem(storageKey, JSON.stringify({ url: data.url, exp }));
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
    }
  }

  const waMessage = encodeURIComponent(
    `Salam! "${title}" materialını almaq istəyirəm.`,
  );
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${waMessage}`
    : null;

  if (fileUrl) {
    return (
      <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6">
        <p className="font-semibold text-green-700 dark:text-green-400">
          ✓ {t("unlocked")}
        </p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
        >
          {t("openFile")} →
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">
          {t("premiumTitle")}
        </span>
        {price != null && (
          <span className="text-lg font-extrabold text-primary">
            {price} ₼
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted">{t("premiumInfo")}</p>

      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
        >
          {t("buyNow")}
        </a>
      )}

      <div className="mt-6 border-t border-border pt-5">
        <label className="text-sm font-semibold">{t("haveCode")}</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && redeem()}
            placeholder={t("enterCode")}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm uppercase outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
          <button
            onClick={redeem}
            disabled={status === "loading"}
            className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? t("unlocking") : t("unlock")}
          </button>
        </div>
        {status === "error" && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {t("invalidCode")}
          </p>
        )}
      </div>
    </div>
  );
}
