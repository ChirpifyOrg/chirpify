'use server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from './server';

export const updateSession = async (request: NextRequest) => {
   // This `try/catch` block is only here for the interactive tutorial.
   // Feel free to remove once you have Supabase connected.
   try {
      // Create an unmodified response
      let response = NextResponse.next({
         request: {
            headers: request.headers,
         },
      });
      const supabase = await createClient();
      const {
         data: { user },
      } = await supabase.auth.getUser();

      const protectedPaths = ['/chat', '/translate', '/profile'];
      const pathname = request.nextUrl.pathname;

      const isProtected = protectedPaths.some(path => pathname.startsWith(path));

      const isAnonymous = user?.is_anonymous;
      const isNotLoggedIn = !user;

      if (isProtected && (isNotLoggedIn || isAnonymous)) {
         const redirectUrl = new URL('/sign-up', request.url);
         return NextResponse.redirect(redirectUrl);
      }

      return response;
   } catch (_error) {
      // If you are here, a Supabase client could not be created!
      // This is likely because you have not set up environment variables.
      // Check out http://localhost:3000 for Next Steps.
      return NextResponse.next({
         request: {
            headers: request.headers,
         },
      });
   }
};
