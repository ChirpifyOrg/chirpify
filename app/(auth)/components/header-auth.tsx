// import { signOutAction } from "@/lib/fe/superbase/sign-out";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { createClient } from "@/lib/be/superbase/server";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/app/(user)/components/user_profile_avatar";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return user ? (
    <div className="flex items-center gap-4">
      <UserProfile /> 
      {/* <Avatar>
        <AvatarImage src={user.user_metadata.avatar_url} />
        <AvatarFallback>
          {user.user_metadata.name.charAt(0)}
        </AvatarFallback>
      </Avatar> */}
      {/* <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form> */}
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
