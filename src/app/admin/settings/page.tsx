import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { mediaUrl } from "@/lib/data";
import { saveSettings } from "../actions";
import type { SiteSettings } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";
const labelCls = "text-sm font-medium";

export default async function AdminSettings() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  let s: Partial<SiteSettings> = {};
  if (isSupabaseAdminConfigured) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    s = (data as SiteSettings) ?? {};
  }

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-2xl font-extrabold">Parametrlər</h1>
      <p className="mt-1 text-sm text-muted">
        Əlaqə məlumatları və ana səhifə mətnləri.
      </p>

      {!isSupabaseAdminConfigured && (
        <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Supabase konfiqurasiya edilməyib.
        </p>
      )}

      <form action={saveSettings} className="mt-6 max-w-3xl space-y-8">
        <input
          type="hidden"
          name="photo_path_existing"
          value={s.photo_path ?? ""}
        />

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold">Müəllimin şəkli</h2>
          <div className="flex items-center gap-5">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
              {mediaUrl(s.photo_path ?? null) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(s.photo_path ?? null)!}
                  alt="Şəkil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-2xl">📷</div>
              )}
            </div>
            <div className="flex-1">
              <label className={labelCls}>Yeni şəkil yüklə (Haqqımda səhifəsi)</label>
              <input name="photo" type="file" accept="image/*" className={inputCls} />
              <p className="mt-1 text-xs text-muted">
                Boş buraxsan, köhnə şəkil qalır.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold">Əlaqə</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Telefon</label>
              <input name="phone" defaultValue={s.phone ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp (nömrə, + olmadan)</label>
              <input
                name="whatsapp"
                placeholder="994501234567"
                defaultValue={s.whatsapp ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>E-poçt</label>
              <input name="email" defaultValue={s.email ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram (link)</label>
              <input
                name="instagram"
                defaultValue={s.instagram ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Telegram (link)</label>
              <input
                name="telegram"
                defaultValue={s.telegram ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold">Ana səhifə</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Hero başlıq (AZ)</label>
              <input
                name="hero_title_az"
                defaultValue={s.hero_title_az ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hero title (EN)</label>
              <input
                name="hero_title_en"
                defaultValue={s.hero_title_en ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hero alt başlıq (AZ)</label>
              <input
                name="hero_subtitle_az"
                defaultValue={s.hero_subtitle_az ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hero subtitle (EN)</label>
              <input
                name="hero_subtitle_en"
                defaultValue={s.hero_subtitle_en ?? ""}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Haqqımda (AZ)</label>
              <textarea
                name="about_az"
                rows={3}
                defaultValue={s.about_az ?? ""}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>About (EN)</label>
              <textarea
                name="about_en"
                rows={3}
                defaultValue={s.about_en ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Təcrübə (il)</label>
              <input
                name="years_experience"
                type="number"
                defaultValue={s.years_experience ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Tələbə sayı</label>
              <input
                name="students_count"
                type="number"
                defaultValue={s.students_count ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg">
          Yadda saxla
        </button>
      </form>
    </AdminShell>
  );
}
