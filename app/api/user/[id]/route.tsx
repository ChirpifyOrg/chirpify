import { UserUsecase } from "@/be/application/user/usecase";
import { UserRepositoryImpl } from "@/be/infrastructure/repository/user";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = context.params; // context에서 params 추출

  const repository = new UserRepositoryImpl();
  const usecase = new UserUsecase(repository);
  const user = await usecase.getUser(id);

  return NextResponse.json({ message: `Hello, user with ID: ${user?.name}` });
}
