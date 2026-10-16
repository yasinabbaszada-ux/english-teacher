# English Teacher — şəxsi sayt

İngilis dili müəllimi üçün animasiyalı şəxsi sayt. Dərsliklər/materiallar (pulsuz və premium), AZ/EN dil seçimi, müəllim üçün admin panel. Premium materiallar **giriş kodu** ilə açılır (ödəniş əl ilə / WhatsApp).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · next-intl · Supabase (Postgres + Storage).

---

## 1. Lokal işə salma

```bash
npm install
npm run dev
```

Sayt: http://localhost:3000 (→ `/az`). Admin: http://localhost:3000/admin

> Supabase konfiqurasiya edilməyibsə, sayt **nümunə data** ilə işləyir ki, dizaynı dərhal görə biləsiniz.

---

## 2. Supabase quraşdırması

1. [supabase.com](https://supabase.com) → yeni layihə yarat (pulsuz plan).
2. **SQL Editor** → `supabase/schema.sql` faylının məzmununu yapışdır və işə sal (cədvəllər, RLS, `materials` storage bucket yaranır).
3. **Project Settings → API** bölməsindən açarları götür.
4. `.env.example` faylını `.env.local` adı ilə kopyala və doldur:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # yalnız serverdə, heç vaxt brauzerə vermə
   ```

5. **Admin hesabı yarat:** Supabase → **Authentication → Users → Add user** (email + parol). Bu məlumatlarla `/admin` -ə giriş edəcəksən.
6. `npm run dev` yenidən başlat.

---

## 3. İstifadə

- **Admin → Materiallar:** yeni material əlavə et, fayl (PDF və s.) və şəkil yüklə, "Premium" seç və qiymət təyin et.
- **Premium satış axını:**
  1. İstifadəçi materialda **"Satın al"** → WhatsApp açılır.
  2. Ödəniş əl ilə alınır.
  3. **Admin → Giriş kodları** → həmin material üçün kod yarat (istifadə sayı/bitmə təyin et) və alıcıya göndər.
  4. İstifadəçi kodu material səhifəsində daxil edir → fayl açılır (müvəqqəti signed URL).
- **Admin → Parametrlər:** əlaqə məlumatları, hero/haqqımda mətnləri, statistika.

---

## 4. Vercel-ə deploy

1. Kodu GitHub-a yüklə.
2. [vercel.com](https://vercel.com) → **New Project** → repo-nu seç.
3. **Environment Variables** bölməsinə `.env.local`-dakı 3 dəyişəni əlavə et.
4. Deploy. (Supabase ayrıca işləyir — əlavə ayar lazım deyil.)

---

## Struktur

```
src/
  app/[locale]/        # public sayt (az/en): ana səhifə, materiallar, haqqımda
  app/admin/           # admin panel (Supabase Auth)
  app/api/redeem/      # giriş kodu → signed URL
  components/          # Hero, MaterialCard, PaidUnlock, AdminShell, ...
  i18n/                # next-intl (routing, request, navigation)
  lib/                 # supabase client-ləri, data qatı, auth
messages/              # az.json, en.json
supabase/schema.sql    # baza sxemi + RLS + storage
```
