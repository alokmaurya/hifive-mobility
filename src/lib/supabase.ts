import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://owptoktxkkfzxbecjfwf.supabase.co";

const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_placeholder";

export const supabase = createClient<Database>(url, key);

