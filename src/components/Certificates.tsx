"use client";

import { useState } from "react";

function Cert({ index, placeholder }: { index: number; placeholder: string }) {
  const [error, setError] = useState(false);
  const src = `/certificates/${index}.jpg`;

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Sertifikat ${index}`}
          onError={() => setError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full place-items-center p-4 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-xl">
              🎓
            </div>
            <p className="mt-3 text-xs text-muted">{placeholder}</p>
            <p className="mt-1 text-[11px] text-muted/70">
              /public/certificates/{index}.jpg
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Certificates({
  count = 4,
  placeholder,
}: {
  count?: number;
  placeholder: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Cert key={i} index={i + 1} placeholder={placeholder} />
      ))}
    </div>
  );
}
