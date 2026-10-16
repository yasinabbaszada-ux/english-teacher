export type Localized = { az: string; en: string };

export type Category = {
  id: string;
  name_az: string;
  name_en: string;
  sort_order: number;
};

export type Material = {
  id: string;
  title_az: string;
  title_en: string;
  description_az: string | null;
  description_en: string | null;
  category_id: string | null;
  is_paid: boolean;
  price: number | null;
  file_path: string | null;
  thumbnail_path: string | null;
  preview_text_az: string | null;
  preview_text_en: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type AccessCode = {
  id: string;
  code: string;
  material_id: string | null;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  note: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  hero_title_az: string | null;
  hero_title_en: string | null;
  hero_subtitle_az: string | null;
  hero_subtitle_en: string | null;
  about_az: string | null;
  about_en: string | null;
  years_experience: number | null;
  students_count: number | null;
};
