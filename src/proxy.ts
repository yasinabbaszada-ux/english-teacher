import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api, /admin (handled separately, not localized)
  // - /_next, /_vercel (internals)
  // - files with an extension (e.g. /favicon.ico)
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
