import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Use || instead of ?? so empty-string env vars (common in CI when a secret
// is not configured) also fall back to the placeholder. All pages are
// "use client" so Supabase is never called at build/prerender time.
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  || "https://placeholder.supabase.co";
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient<Database>(url, key);
