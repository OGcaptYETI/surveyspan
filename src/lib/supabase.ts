// 📂 lib/supabase.ts
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase credentials are missing from environment variables.");
}

const supabase = createPagesBrowserClient();

export default supabase;
