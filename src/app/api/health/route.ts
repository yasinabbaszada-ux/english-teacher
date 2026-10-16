import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured, SUPABASE_URL } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

// Temporary diagnostic — no secrets, only counts and error messages.
export async function GET() {
  const info: Record<string, unknown> = {
    configured: isSupabaseConfigured,
    urlHost: SUPABASE_URL ? (() => { try { return new URL(SUPABASE_URL).host; } catch { return "INVALID_URL"; } })() : null,
    anonLen: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").length,
    serviceLen: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").length,
  };

  if (!isSupabaseConfigured) return NextResponse.json(info);

  try {
    const s = createPublicClient();
    const mats = await s
      .from("materials")
      .select("id", { count: "exact", head: true });
    info.materialsCount = mats.count;
    info.materialsError = mats.error?.message ?? null;

    const certs = await s
      .from("certificates")
      .select("id", { count: "exact", head: true });
    info.certsCount = certs.count;
    info.certsError = certs.error?.message ?? null;

    const settings = await s
      .from("site_settings")
      .select("photo_path")
      .eq("id", 1)
      .maybeSingle();
    info.photoPath = settings.data?.photo_path ?? null;
    info.settingsError = settings.error?.message ?? null;
  } catch (e) {
    info.exception = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(info);
}
