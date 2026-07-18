import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Fallback placeholders let the module initialise during static prerender
// even when env vars are absent (all pages are "use client" so Supabase is
// never actually called at build time).
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "https://placeholder.supabase.co";
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient<Database>(url, key);
