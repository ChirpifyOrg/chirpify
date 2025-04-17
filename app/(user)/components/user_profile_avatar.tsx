'use client';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import {
   DropdownMenuContent,
   DropdownMenu,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/fe/superbase/client';
import { signOutAction } from '@/lib/be/superbase/sign-out';
import Link from 'next/link';

export function UserProfile() {
   const [user, setUser] = React.useState<any>(null);
   React.useEffect(() => {
      const supabase = createClient();
      async function getUser() {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         setUser(user);
      }
      getUser();
   }, []);

   // 로그인한 사용자가 아니면 null을 리턴
   if (!user || user?.is_anonymous === true) {
      return null;
   }

   const userName = user.user_metadata?.name ?? 'User';

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Avatar>
               <AvatarImage src={user.user_metadata.avatar_url} />
               <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-200" side="bottom" align="start" sideOffset={3} alignOffset={10}>
            <Link href="/profile">
               <DropdownMenuItem className="pl-2 pt-1 pb-1">👬 Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="pl-2 pt-1 pb-1" onClick={signOutAction}>
               🔓 Logout
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
