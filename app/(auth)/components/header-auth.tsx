import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { createClient } from '@/lib/be/superbase/server';
import { UserProfile } from '@/app/(user)/components/user_profile_avatar';

export default async function AuthButton() {
   const supabase = await createClient();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   // 로그인한 사용자가 아니면 null을 리턴

   if (user?.user_metadata?.isAnonymous || !user) {
      return (
         <div className="flex gap-2">
            <Button asChild size="sm" variant={'default'}>
               <Link href="/sign-up">Sign up</Link>
            </Button>
         </div>
      );
   } else {
      return (
         <div className="flex items-center gap-4">
            <UserProfile />
         </div>
      );
   }
}
