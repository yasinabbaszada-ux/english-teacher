import { redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import MaterialForm from "@/components/MaterialForm";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { saveMaterial } from "../../actions";
import type { Category } from "@/lib/types";

export default async function NewMaterial() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let categories: Category[] = [];
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    categories = (data as Category[]) ?? [];
  }

  return (
    <AdminShell email={user.email ?? ""}>
      <Link href="/admin/materials" className="text-sm text-muted hover:text-primary">
        ← Materiallar
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">Yeni material</h1>
      <div className="mt-6">
        <MaterialForm action={saveMaterial} categories={categories} />
      </div>
    </AdminShell>
  );
}
