import { UserUsecase } from "@/be/application/user/usecase";
import { UserRepositoryImpl } from "@/be/infrastructure/repository/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const repository = new UserRepositoryImpl();
  const usecase = new UserUsecase(repository);
  const user = await usecase.getUser(id);

  return NextResponse.json({ message: `Hello, user with ID: ${user?.name}` });
}
