"use client";

import { useState } from "react";

/**
 * Shows /teacher.jpg from the public folder. Until the teacher adds that
 * file, a styled placeholder is shown instead.
 */
export default function ProfilePhoto({ alt }: { alt: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-accent/20 to-card shadow-lg">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/teacher.jpg"
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
              /public/teacher.jpg
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
