"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { STORAGE_BUCKET, MEDIA_BUCKET } from "@/lib/supabase/env";

/* --------------------------- helpers --------------------------- */

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function uploadFile(
  file: File | null,
  folder: string,
  bucket: string = STORAGE_BUCKET,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = createAdminClient();
  const key = `${folder}/${Date.now()}-${slug(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(key, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(`upload_failed: ${error.message}`);
  return key;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = (v as string | null)?.toString().trim();
  return s ? s : null;
}

/* --------------------------- auth --------------------------- */

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* --------------------------- materials --------------------------- */

export async function saveMaterial(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const id = str(formData.get("id"));
  const filePathExisting = str(formData.get("file_path_existing"));
  const thumbPathExisting = str(formData.get("thumbnail_path_existing"));

  const file = formData.get("file") as File | null;
  const thumb = formData.get("thumbnail") as File | null;

  const newFilePath = await uploadFile(file, "files");
  const newThumbPath = await uploadFile(thumb, "thumbnails", MEDIA_BUCKET);

  const isPaid = formData.get("is_paid") === "on";

  const row = {
    title_az: str(formData.get("title_az")) ?? "",
    title_en: str(formData.get("title_en")) ?? "",
    description_az: str(formData.get("description_az")),
    description_en: str(formData.get("description_en")),
    category_id: str(formData.get("category_id")),
    is_paid: isPaid,
    price: isPaid ? Number(formData.get("price")) || null : null,
    preview_text_az: str(formData.get("preview_text_az")),
    preview_text_en: str(formData.get("preview_text_en")),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order")) || 0,
    file_path: newFilePath ?? filePathExisting,
    thumbnail_path: newThumbPath ?? thumbPathExisting,
  };

  if (id) {
    const { error } = await supabase.from("materials").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("materials").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/materials");
  revalidatePath("/", "layout");
  redirect("/admin/materials");
}

export async function deleteMaterial(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  const supabase = createAdminClient();
  await supabase.from("materials").delete().eq("id", id);
  revalidatePath("/admin/materials");
  revalidatePath("/", "layout");
}

/* --------------------------- categories --------------------------- */

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("categories").insert({
    name_az: str(formData.get("name_az")) ?? "",
    name_en: str(formData.get("name_en")) ?? "",
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  revalidatePath("/admin/materials");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  const supabase = createAdminClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/materials");
}

/* --------------------------- access codes --------------------------- */

export async function createCode(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const custom = str(formData.get("code"));
  const code = (custom ?? randomBytes(4).toString("hex")).toUpperCase();
  const materialId = str(formData.get("material_id"));
  const expiresDays = Number(formData.get("expires_days")) || 0;
  const expires_at =
    expiresDays > 0
      ? new Date(Date.now() + expiresDays * 86400000).toISOString()
      : null;

  await supabase.from("access_codes").insert({
    code,
    material_id: materialId,
    max_uses: Number(formData.get("max_uses")) || 1,
    used_count: 0,
    expires_at,
    active: true,
    note: str(formData.get("note")),
  });

  revalidatePath("/admin/codes");
}

export async function toggleCode(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  const supabase = createAdminClient();
  await supabase.from("access_codes").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/codes");
}

export async function deleteCode(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  const supabase = createAdminClient();
  await supabase.from("access_codes").delete().eq("id", id);
  revalidatePath("/admin/codes");
}

/* --------------------------- settings --------------------------- */

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const photo = formData.get("photo") as File | null;
  const newPhotoPath = await uploadFile(photo, "photo", MEDIA_BUCKET);
  const photoExisting = str(formData.get("photo_path_existing"));

  const row = {
    id: 1,
    photo_path: newPhotoPath ?? photoExisting,
    phone: str(formData.get("phone")),
    whatsapp: str(formData.get("whatsapp")),
    email: str(formData.get("email")),
    instagram: str(formData.get("instagram")),
    telegram: str(formData.get("telegram")),
    hero_title_az: str(formData.get("hero_title_az")),
    hero_title_en: str(formData.get("hero_title_en")),
    hero_subtitle_az: str(formData.get("hero_subtitle_az")),
    hero_subtitle_en: str(formData.get("hero_subtitle_en")),
    about_az: str(formData.get("about_az")),
    about_en: str(formData.get("about_en")),
    years_experience: Number(formData.get("years_experience")) || null,
    students_count: Number(formData.get("students_count")) || null,
  };
  await supabase.from("site_settings").upsert(row);
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

/* --------------------------- certificates --------------------------- */

export async function createCertificate(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const image = formData.get("image") as File | null;
  const imagePath = await uploadFile(image, "certificates", MEDIA_BUCKET);
  if (!imagePath) return;
  await supabase.from("certificates").insert({
    title: str(formData.get("title")),
    image_path: imagePath,
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  revalidatePath("/admin/certificates");
  revalidatePath("/", "layout");
}

export async function deleteCertificate(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  const supabase = createAdminClient();
  await supabase.from("certificates").delete().eq("id", id);
  revalidatePath("/admin/certificates");
  revalidatePath("/", "layout");
}
