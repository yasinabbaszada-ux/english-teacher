import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, STORAGE_BUCKET } from "@/lib/supabase/env";
import type { AccessCode, Material } from "@/lib/types";

const EXPIRES_IN = 3600; // 1 hour signed URL

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 503 },
    );
  }

  let body: { code?: string; materialId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase();
  const materialId = (body.materialId ?? "").trim();
  if (!code || !materialId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Look up the code.
  const { data: codeRow, error: codeErr } = await supabase
    .from("access_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (codeErr || !codeRow) {
    return NextResponse.json({ error: "invalid" }, { status: 403 });
  }
  const ac = codeRow as AccessCode;

  // Validate.
  const now = Date.now();
  const expired = ac.expires_at ? new Date(ac.expires_at).getTime() < now : false;
  const exhausted = ac.used_count >= ac.max_uses;
  const matchesMaterial = ac.material_id === null || ac.material_id === materialId;

  if (!ac.active || expired || exhausted || !matchesMaterial) {
    return NextResponse.json({ error: "invalid" }, { status: 403 });
  }

  // Resolve the material file.
  const { data: matRow, error: matErr } = await supabase
    .from("materials")
    .select("*")
    .eq("id", materialId)
    .eq("published", true)
    .maybeSingle();

  if (matErr || !matRow) {
    return NextResponse.json({ error: "invalid" }, { status: 403 });
  }
  const material = matRow as Material;
  if (!material.is_paid || !material.file_path) {
    return NextResponse.json({ error: "invalid" }, { status: 403 });
  }

  // Create the signed URL.
  const { data: signed, error: signErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(material.file_path, EXPIRES_IN);

  if (signErr || !signed) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  // Increment usage and log the redemption (best effort).
  await supabase
    .from("access_codes")
    .update({ used_count: ac.used_count + 1 })
    .eq("id", ac.id);

  await supabase.from("redemptions").insert({
    code_id: ac.id,
    material_id: materialId,
  });

  return NextResponse.json({ url: signed.signedUrl, expiresIn: EXPIRES_IN });
}
