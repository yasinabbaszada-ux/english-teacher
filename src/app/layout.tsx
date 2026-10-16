import type { ReactNode } from "react";
import "./globals.css";

// Root layout is a pass-through: the real <html>/<body> live in the
// [locale] and admin layouts so each can set its own lang attribute.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
