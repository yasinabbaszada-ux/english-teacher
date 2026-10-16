import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import MaterialForm from "@/components/MaterialForm";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { saveMaterial } from "../../actions";
import type { Category, Material } from "@/lib/types";

export default async function EditMaterial({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!isSupabaseAdminConfigured) notFound();

  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: mat }, { data: cats }] = await Promise.all([
    supabase.from("materials").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!mat) notFound();
  const material = mat as Material;
  const categories = (cats as Category[]) ?? [];

  return (
    <AdminShell email={user.email ?? ""}>
      <Link href="/admin/materials" className="text-sm text-muted hover:text-primary">
        ← Materiallar
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">Materialı redaktə et</h1>
      <div className="mt-6">
        <MaterialForm
          action={saveMaterial}
          categories={categories}
          material={material}
        />
      </div>
    </AdminShell>
  );
}
