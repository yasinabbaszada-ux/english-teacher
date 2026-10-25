import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { deleteMessage, toggleMessageRead } from "../actions";
import type { Message } from "@/lib/types";

export default async function AdminMessages() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let messages: Message[] = [];
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    messages = (data as Message[]) ?? [];
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <AdminShell email={user.email ?? ""}>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold">Mesajlar</h1>
        {unread > 0 && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-fg">
            {unread} yeni
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Saytdakı əlaqə formundan gələn mesajlar.
      </p>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Supabase konfiqurasiya edilməyib.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">Hələ mesaj yoxdur.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-5 ${
              m.is_read
                ? "border-border bg-card"
                : "border-primary/40 bg-primary/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  {m.name ?? "—"}
                  {!m.is_read && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-fg align-middle">
                      YENİ
                    </span>
                  )}
                </p>
                <p className="text-sm text-primary">{m.contact}</p>
              </div>
              <span className="text-xs text-muted">
                {new Date(m.created_at).toLocaleString("az-AZ")}
              </span>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
              {m.body}
            </p>

            <div className="mt-4 flex gap-2">
              <form action={toggleMessageRead}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="is_read" value={String(m.is_read)} />
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
                  {m.is_read ? "Oxunmamış et" : "Oxundu"}
                </button>
              </form>
              {m.contact && (
                <a
                  href={
                    m.contact.includes("@")
                      ? `mailto:${m.contact}`
                      : `https://wa.me/${m.contact.replace(/[^0-9]/g, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                >
                  Cavab ver
                </a>
              )}
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
