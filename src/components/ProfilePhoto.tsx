"use client";

import { useState } from "react";

/**
 * Teacher photo. Shows the provided image URL; until one is set (or if it
 * fails to load) a styled placeholder is shown instead.
 */
export default function ProfilePhoto({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [error, setError] = useState(false);
  const showImg = src && !error;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-accent/20 to-card shadow-lg">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center text-center">
          <div>
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary/15 text-4xl">
              📷
            </div>
            <p className="mt-4 px-6 text-sm text-muted">
              Şəkil admin paneldən əlavə olunacaq
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
