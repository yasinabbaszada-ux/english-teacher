"use client";

import { useState } from "react";
import type { Category, Material } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";
const labelCls = "text-sm font-medium";

export default function MaterialForm({
  action,
  categories,
  material,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  material?: Material;
}) {
  const [isPaid, setIsPaid] = useState(material?.is_paid ?? false);

  return (
    <form action={action} className="max-w-2xl space-y-6">
      {material && <input type="hidden" name="id" value={material.id} />}
      <input
        type="hidden"
        name="file_path_existing"
        value={material?.file_path ?? ""}
      />
      <input
        type="hidden"
        name="thumbnail_path_existing"
        value={material?.thumbnail_path ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Başlıq (AZ)</label>
          <input
            name="title_az"
            required
            defaultValue={material?.title_az}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Title (EN)</label>
          <input
            name="title_en"
            required
            defaultValue={material?.title_en}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Təsvir (AZ)</label>
          <textarea
            name="description_az"
            rows={3}
            defaultValue={material?.description_az ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea
            name="description_en"
            rows={3}
            defaultValue={material?.description_en ?? ""}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Kateqoriya</label>
          <select
            name="category_id"
            defaultValue={material?.category_id ?? ""}
            className={inputCls}
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_az}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={material?.sort_order ?? 0}
            className={inputCls}
          />
        </div>
      </div>

      {/* file uploads */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Fayl (PDF və s.)</label>
          <input name="file" type="file" className={inputCls} />
          {material?.file_path && (
            <p className="mt-1 text-xs text-muted">Mövcud: {material.file_path}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Şəkil (thumbnail)</label>
          <input name="thumbnail" type="file" accept="image/*" className={inputCls} />
          {material?.thumbnail_path && (
            <p className="mt-1 text-xs text-muted">
              Mövcud: {material.thumbnail_path}
            </p>
          )}
        </div>
      </div>

      {/* paid toggle */}
      <div className="rounded-xl border border-border p-4">
        <label className="flex items-center gap-3">
          <input
            name="is_paid"
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Premium (pullu) material</span>
        </label>

        {isPaid && (
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>Qiymət (₼)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={material?.price ?? ""}
                className={inputCls}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Önizləmə mətni (AZ)</label>
                <textarea
                  name="preview_text_az"
                  rows={2}
                  defaultValue={material?.preview_text_az ?? ""}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Preview text (EN)</label>
                <textarea
                  name="preview_text_en"
                  rows={2}
                  defaultValue={material?.preview_text_en ?? ""}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <label className="flex items-center gap-3">
        <input
          name="published"
          type="checkbox"
          defaultChecked={material?.published ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium">Dərc et (saytda göstər)</span>
      </label>

      <div className="flex gap-3">
        <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg">
          Yadda saxla
        </button>
      </div>
    </form>
  );
}
