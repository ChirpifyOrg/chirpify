import { UserUsecase } from "@/be/application/user/usecase";
import { UserRepositoryImpl } from "@/be/infrastructure/repository/user";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params?: Record<string, string | string[]> }) {
  const id = context.params?.id;

  if (!id || Array.isArray(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const repository = new UserRepositoryImpl();
  const usecase = new UserUsecase(repository);
  const user = await usecase.getUser(id);

  return NextResponse.json({ message: `Hello, user with ID: ${user?.name}` });
}
