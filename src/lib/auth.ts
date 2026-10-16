import "server-only";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/** Returns the signed-in admin user, or null. */
export async function getAdminUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Throws if there is no authenticated admin (use inside server actions). */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("unauthorized");
  return user;
}
