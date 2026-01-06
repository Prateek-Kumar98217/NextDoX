import { Database } from "@/types/database.types";
import { createBrowserClient } from "@supabase/ssr";

function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export const supabase = createClient();
