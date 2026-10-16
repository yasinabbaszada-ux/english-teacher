import "server-only";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured, STORAGE_BUCKET } from "./supabase/env";
import type { Category, Material, SiteSettings } from "./types";

/* ------------------------------------------------------------------ *
 * Fallback sample data — used when Supabase is not yet configured so
 * the site renders locally during development.
 * ------------------------------------------------------------------ */

const SAMPLE_CATEGORIES: Category[] = [
  { id: "c1", name_az: "Qrammatika", name_en: "Grammar", sort_order: 1 },
  { id: "c2", name_az: "IELTS", name_en: "IELTS", sort_order: 2 },
  { id: "c3", name_az: "Danışıq", name_en: "Speaking", sort_order: 3 },
];

const SAMPLE_MATERIALS: Material[] = [
  {
    id: "m1",
    title_az: "İngilis dili zamanları — tam bələdçi",
    title_en: "English Tenses — Complete Guide",
    description_az:
      "Bütün zamanlar sadə izahlar və nümunələrlə. Başlanğıc və orta səviyyə üçün.",
    description_en:
      "All tenses with simple explanations and examples. For beginner and intermediate levels.",
    category_id: "c1",
    is_paid: false,
    price: null,
    file_path: null,
    thumbnail_path: null,
    preview_text_az: null,
    preview_text_en: null,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "m2",
    title_az: "IELTS Writing Task 2 — model cavablar",
    title_en: "IELTS Writing Task 2 — Model Answers",
    description_az:
      "Yüksək bal toplamış 20 esse nümunəsi və strukturlar. PDF formatında.",
    description_en:
      "20 high-scoring essay samples and structures. In PDF format.",
    category_id: "c2",
    is_paid: true,
    price: 15,
    file_path: null,
    thumbnail_path: null,
    preview_text_az:
      "Bu toplu 20 tam esse, giriş-nəticə şablonları və keçid ifadələri siyahısını əhatə edir.",
    preview_text_en:
      "This pack includes 20 full essays, intro/conclusion templates and a list of linking phrases.",
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "m3",
    title_az: "Gündəlik danışıq ifadələri (A2-B1)",
    title_en: "Everyday Speaking Phrases (A2-B1)",
    description_az: "200+ praktik ifadə audio tələffüzlə birlikdə.",
    description_en: "200+ practical phrases with audio pronunciation.",
    category_id: "c3",
    is_paid: false,
    price: null,
    file_path: null,
    thumbnail_path: null,
    preview_text_az: null,
    preview_text_en: null,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "m4",
    title_az: "Phrasal Verbs ustalıq kursu",
    title_en: "Phrasal Verbs Mastery",
    description_az: "Ən vacib 150 phrasal verb, nümunə cümlələr və testlər.",
    description_en: "The 150 most important phrasal verbs, example sentences and quizzes.",
    category_id: "c1",
    is_paid: true,
    price: 10,
    file_path: null,
    thumbnail_path: null,
    preview_text_az: "150 phrasal verb kateqoriyalar üzrə qruplaşdırılıb.",
    preview_text_en: "150 phrasal verbs grouped by category.",
    published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

const SAMPLE_SETTINGS: SiteSettings = {
  id: 1,
  phone: "+994 50 000 00 00",
  whatsapp: "994500000000",
  email: "teacher@example.com",
  instagram: "https://instagram.com/",
  telegram: "https://t.me/",
  hero_title_az: null,
  hero_title_en: null,
  hero_subtitle_az: null,
  hero_subtitle_en: null,
  about_az: null,
  about_en: null,
  years_experience: 7,
  students_count: 500,
};

/* ------------------------------------------------------------------ *
 * Data access — reads from Supabase when configured, else sample data.
 * ------------------------------------------------------------------ */

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseAdminConfigured) return SAMPLE_CATEGORIES;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Category[];
}

export async function getMaterials(): Promise<Material[]> {
  if (!isSupabaseAdminConfigured) return SAMPLE_MATERIALS;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Material[];
}

export async function getMaterial(id: string): Promise<Material | null> {
  if (!isSupabaseAdminConfigured) {
    return SAMPLE_MATERIALS.find((m) => m.id === id) ?? null;
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  return data as Material;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseAdminConfigured) return SAMPLE_SETTINGS;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !data) return SAMPLE_SETTINGS;
  return data as SiteSettings;
}

/** Public URL for a thumbnail stored in Supabase Storage. */
export function thumbnailUrl(path: string | null): string | null {
  if (!path) return null;
  if (!isSupabaseAdminConfigured) return null;
  const supabase = createAdminClient();
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Short-lived signed URL for a file in the private Storage bucket. */
export async function createSignedUrl(
  path: string | null,
  expiresIn = 3600,
): Promise<string | null> {
  if (!path) return null;
  if (!isSupabaseAdminConfigured) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}
