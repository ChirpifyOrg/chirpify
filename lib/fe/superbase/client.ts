import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/be/utils/env";

export const createClient = () =>
  createBrowserClient(
    env.nextPublicSupabaseUrl,
    env.nextPublicSupabaseAnonKey,
  );
