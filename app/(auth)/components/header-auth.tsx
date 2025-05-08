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

   if (user?.is_anonymous || !user) {
      return (
         <div className="flex gap-2">
            <Button asChild size="sm" variant={'default'}>
               <Link href="/sign-up">Sign up</Link>
            </Button>
         </div>
      );
   } else {
      return (
         <div className=" flex items-center gap-4 pl-2 justify-start xs:justify-end ">
            <div className=" w-1/8 xxs:w-1/4 xs:w-1/3 md:w-2/3">
               <Button variant="outline" asChild className="flex-1 truncate text-left w-full">
                  <Link href="/translate"> Practice English Sentences </Link>
               </Button>
            </div>
            <div className="  w-1/8 xxs:w-1/4 xs:w-1/3 md:w-2/3 ">
               <Button variant="outline" className="flex-1 truncate text-left  w-full">
                  <Link href="/chat">Chat With AI</Link>
               </Button>
            </div>
            <div className="flex-shrink-0">
               <UserProfile />
            </div>
         </div>
      );
   }
}
