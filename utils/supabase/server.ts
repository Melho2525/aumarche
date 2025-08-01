// /utils/supabase/server.ts

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // clé serveur, pas anonyme !
  return createSupabaseClient(supabaseUrl, supabaseKey);
}
