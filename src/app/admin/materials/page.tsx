import { redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { createCategory, deleteCategory, deleteMaterial } from "../actions";
import type { Category, Material } from "@/lib/types";

export default async function AdminMaterials() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let materials: Material[] = [];
  let categories: Category[] = [];
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const [m, c] = await Promise.all([
      supabase.from("materials").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    materials = (m.data as Material[]) ?? [];
    categories = (c.data as Category[]) ?? [];
  }

  return (
    <AdminShell email={user.email ?? ""}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Materiallar</h1>
        <Link
          href="/admin/materials/new"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          + Yeni
        </Link>
      </div>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Supabase konfiqurasiya edilməyib.
        </p>
      )}

      {/* materials table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background/50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Başlıq</th>
              <th className="px-4 py-3">Növ</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Hələ material yoxdur.
                </td>
              </tr>
            )}
            {materials.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{m.title_az}</td>
                <td className="px-4 py-3">
                  {m.is_paid ? (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Premium {m.price ? `· ${m.price}₼` : ""}
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Pulsuz
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {m.published ? "Dərc olunub" : "Qaralama"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/materials/${m.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                    >
                      Redaktə
                    </Link>
                    <form action={deleteMaterial}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* categories */}
      <h2 className="mt-12 text-lg font-bold">Kateqoriyalar</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <ul className="space-y-2">
            {categories.length === 0 && (
              <li className="text-sm text-muted">Kateqoriya yoxdur.</li>
            )}
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>
                  {c.name_az} / {c.name_en}
                </span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs text-red-600 hover:underline">
                    Sil
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        <form
          action={createCategory}
          className="space-y-3 rounded-2xl border border-border bg-card p-4"
        >
          <p className="text-sm font-semibold">Yeni kateqoriya</p>
          <input
            name="name_az"
            placeholder="Ad (AZ)"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            name="name_en"
            placeholder="Name (EN)"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            name="sort_order"
            type="number"
            placeholder="Sıra"
            defaultValue={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg">
            Əlavə et
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
