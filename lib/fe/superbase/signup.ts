'use client';
import { createClient } from '@/lib/fe/superbase/client';
import { env } from '@/lib/be/utils/env';

export async function signUpWithGoogle() {
   const supabase = await createClient();
   var protocol = env.isLocal() ? 'http' : 'https';
   const redirectToUrl = `${protocol}://${process.env.NEXT_PUBLIC_DOMAIN ? process.env.NEXT_PUBLIC_DOMAIN : env.nextPublicDomain}/api/auth/callback/google`;
   console.log('redirectTo:', redirectToUrl);
   const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
         redirectTo: redirectToUrl,
      },
   });

   if (error) {
      throw error;
   }

   return data;
}
