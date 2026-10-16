import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { mediaUrl } from "@/lib/data";
import { createCertificate, deleteCertificate } from "../actions";
import type { Certificate } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

export default async function AdminCertificates() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let certs: Certificate[] = [];
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order");
    certs = (data as Certificate[]) ?? [];
  }

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-2xl font-extrabold">Sertifikatlar</h1>
      <p className="mt-1 text-sm text-muted">
        Haqqımda səhifəsində göstərilən sertifikatlar.
      </p>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Supabase konfiqurasiya edilməyib.
        </p>
      )}

      {/* upload form */}
      <form
        action={createCertificate}
        className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
      >
        <div>
          <label className="text-sm font-medium">Başlıq (istəyə bağlı)</label>
          <input name="title" placeholder="məs. TESOL 120-saat" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Şəkil</label>
          <input name="image" type="file" accept="image/*" required className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={certs.length + 1}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-fg">
          Əlavə et
        </button>
      </form>

      {/* grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certs.length === 0 && (
          <p className="text-sm text-muted">Hələ sertifikat yoxdur.</p>
        )}
        {certs.map((c) => {
          const url = mediaUrl(c.image_path);
          return (
            <div
              key={c.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] bg-background">
                {url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={c.title ?? "Sertifikat"}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="truncate text-sm font-medium">
                  {c.title ?? "—"}
                </span>
                <form action={deleteCertificate}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    Sil
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
