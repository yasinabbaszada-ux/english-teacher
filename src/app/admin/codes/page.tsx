import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { createCode, deleteCode, toggleCode } from "../actions";
import type { AccessCode, Material } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

export default async function AdminCodes() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let codes: AccessCode[] = [];
  let paidMaterials: Material[] = [];
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const [c, m] = await Promise.all([
      supabase.from("access_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("materials").select("*").eq("is_paid", true).order("sort_order"),
    ]);
    codes = (c.data as AccessCode[]) ?? [];
    paidMaterials = (m.data as Material[]) ?? [];
  }

  const titleFor = (id: string | null) =>
    id ? paidMaterials.find((m) => m.id === id)?.title_az ?? "—" : "Bütün materiallar";

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-2xl font-extrabold">Giriş kodları</h1>
      <p className="mt-1 text-sm text-muted">
        Ödənişdən sonra alıcıya kod yaradın və göndərin.
      </p>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Supabase konfiqurasiya edilməyib.
        </p>
      )}

      {/* generate form */}
      <form
        action={createCode}
        className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label className="text-sm font-medium">Material</label>
          <select name="material_id" className={inputCls} defaultValue="">
            <option value="">Bütün premium materiallar</option>
            {paidMaterials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title_az}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Kod (boş = avtomatik)</label>
          <input name="code" placeholder="Avtomatik" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Qeyd (alıcı)</label>
          <input name="note" placeholder="Ad / nömrə" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">İstifadə sayı</label>
          <input
            name="max_uses"
            type="number"
            min={1}
            defaultValue={3}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Bitmə (gün, 0 = limitsiz)</label>
          <input
            name="expires_days"
            type="number"
            min={0}
            defaultValue={0}
            className={inputCls}
          />
        </div>
        <div className="flex items-end">
          <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg">
            Kod yarat
          </button>
        </div>
      </form>

      {/* codes table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background/50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">İstifadə</th>
              <th className="px-4 py-3">Qeyd</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Hələ kod yoxdur.
                </td>
              </tr>
            )}
            {codes.map((c) => {
              const expired = c.expires_at
                ? new Date(c.expires_at).getTime() < Date.now()
                : false;
              return (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                  <td className="px-4 py-3 text-muted">{titleFor(c.material_id)}</td>
                  <td className="px-4 py-3">
                    {c.used_count}/{c.max_uses}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.note ?? "—"}</td>
                  <td className="px-4 py-3">
                    {!c.active ? (
                      <span className="text-xs text-muted">Deaktiv</span>
                    ) : expired ? (
                      <span className="text-xs text-red-600">Vaxtı bitib</span>
                    ) : (
                      <span className="text-xs text-green-600">Aktiv</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={toggleCode}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="active" value={String(c.active)} />
                        <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
                          {c.active ? "Deaktiv et" : "Aktiv et"}
                        </button>
                      </form>
                      <form action={deleteCode}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                          Sil
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
