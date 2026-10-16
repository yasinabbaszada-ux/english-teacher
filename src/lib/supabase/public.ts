import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Anon Supabase client for reading PUBLIC data on the server.
 * Respects RLS (only sees published materials, categories, settings,
 * certificates). Used for the public site so it does not depend on the
 * service-role key.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
