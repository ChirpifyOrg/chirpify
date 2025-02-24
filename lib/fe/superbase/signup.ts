import { createClient } from "@/lib/fe/superbase/client";

export async function signUpWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback/google`,
    },
  });

  console.log(`${window.location.origin}/api/auth/callback/google`);

  if (error) {
    throw error;
  }

  return data;
}
