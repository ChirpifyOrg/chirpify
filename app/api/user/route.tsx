import { UserUsecase } from "@/be/application/user/usecase";
import { UserRepositoryImpl } from "@/be/infrastructure/repository/user";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/be/utils/env";
import { getCurrentUser } from "@/lib/be/superbase/server";

export async function GET(_request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = new UserRepositoryImpl(
    env.nextPublicSupabaseUrl,
    env.supabaseSecret
  );
  const usecase = new UserUsecase(repository);
  const domainUser = await usecase.getUser(user.id);

  return NextResponse.json({
    message: `Hello, user with ID: ${domainUser?.name}`,
  });
}

export async function DELETE(_request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
