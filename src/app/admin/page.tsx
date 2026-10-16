import { redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

async function count(table: string, filter?: Record<string, unknown>) {
  if (!isSupabaseAdminConfigured) return 0;
  const supabase = createAdminClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const [materials, paid, codes, redemptions] = await Promise.all([
    count("materials"),
    count("materials", { is_paid: true }),
    count("access_codes"),
    count("redemptions"),
  ]);

  const stats = [
    { label: "Materiallar", value: materials, href: "/admin/materials" },
    { label: "Premium materiallar", value: paid, href: "/admin/materials" },
    { label: "Giriş kodları", value: codes, href: "/admin/codes" },
    { label: "Açılmalar", value: redemptions, href: "/admin/codes" },
  ];

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-2xl font-extrabold">İdarə paneli</h1>
      <p className="mt-1 text-sm text-muted">Xoş gəldiniz 👋</p>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Service role açarı təyin edilməyib — statistika və idarəetmə üçün{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> lazımdır.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div className="text-3xl font-extrabold text-primary">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/materials/new"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          + Yeni material
        </Link>
        <Link
          href="/admin/codes"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          Kod yarat
        </Link>
      </div>
    </AdminShell>
  );
}
