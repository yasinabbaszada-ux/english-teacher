"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !body.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, body, website }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("ok");
      setName("");
      setContact("");
      setBody("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 font-semibold text-green-700 dark:text-green-400">
          {t("success")}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-muted underline hover:text-primary"
        >
          {t("send")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      </div>

      {/* honeypot (hidden from users) */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name")}
          required
          className={inputCls}
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t("contact")}
          required
          className={inputCls}
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t("message")}
        required
        rows={5}
        maxLength={2000}
        className={inputCls}
      />

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {status === "loading" ? t("sending") : t("send")}
      </button>
    </form>
  );
}
