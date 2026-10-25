import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: {
    name?: string;
    contact?: string;
    body?: string;
    website?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real users leave this empty; bots fill it.
  if (body.website && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const contact = (body.contact ?? "").trim().slice(0, 150);
  const message = (body.body ?? "").trim().slice(0, 2000);

  if (!name || !contact || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messages")
    .insert({ name, contact, body: message });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
