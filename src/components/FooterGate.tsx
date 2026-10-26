"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

// Hides the footer on the immersive game pages.
const HIDDEN_ON = ["/game", "/hangman"];

export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <>{children}</>;
}
