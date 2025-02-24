import { createClient } from "@/lib/fe/superbase/client";
import { env } from "@/lib/be/utils/env";

export async function signUpWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `https://${env.nextPublicDomain}/api/auth/callback/google`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
