"use client";

import { useState } from "react";

type Item = { url: string; title: string | null };

function Cert({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.title ?? "Sertifikat"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.title && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs font-medium text-white">
            {item.title}
          </span>
        )}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.title ?? "Sertifikat"}
            className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export default function Certificates({
  items,
  placeholder,
}: {
  items: Item[];
  placeholder: string;
}) {
  if (items.length === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-card p-4 text-center"
          >
            <div>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-xl">
                🎓
              </div>
              <p className="mt-3 text-xs text-muted">{placeholder}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <Cert key={i} item={it} />
      ))}
    </div>
  );
}
