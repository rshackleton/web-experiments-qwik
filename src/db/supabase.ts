import { createClient } from '@supabase/supabase-js';

export const client = createClient(
  `https://${import.meta.env.PUBLIC_SUPABASE_PROJECT}.supabase.co`,
  import.meta.env.PUBLIC_SUPABASE_KEY,
);
