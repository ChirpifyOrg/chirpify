import { createClient } from "@/lib/fe/superbase/client";

export async function signUpWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/api/auth/callback/google`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
