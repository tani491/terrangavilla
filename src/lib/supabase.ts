import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase — créé uniquement si les variables d'environnement sont présentes.
 * - Côté serveur : lecture de site_settings, insertion des leads (via RLS anon).
 * - Côté client : insertion des leads uniquement.
 * - Ne JAMAIS utiliser SUPABASE_SERVICE_ROLE_KEY ici (jamais côté frontend).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 0;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cachedClient) return cachedClient;
  try {
    cachedClient = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return cachedClient;
  } catch {
    return null;
  }
}
