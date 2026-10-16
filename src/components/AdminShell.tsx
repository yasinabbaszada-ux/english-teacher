import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

const nav = [
  { href: "/admin", label: "İdarə paneli" },
  { href: "/admin/materials", label: "Materiallar" },
  { href: "/admin/certificates", label: "Sertifikatlar" },
  { href: "/admin/codes", label: "Giriş kodları" },
  { href: "/admin/settings", label: "Parametrlər" },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card p-4">
        <div className="flex items-center gap-2 px-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-fg">
            E
          </span>
          Admin
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-primary/10 hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border pt-3">
          <p className="truncate px-2 text-xs text-muted">{email}</p>
          <form action={signOut}>
            <button className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
              Çıxış
            </button>
          </form>
          <Link
            href="/"
            className="mt-2 block rounded-lg px-3 py-2 text-center text-xs text-muted hover:text-primary"
          >
            ← Sayta qayıt
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
    </div>
  );
}
