import { UserUsecase } from "@/be/application/user/usecase";
import { UserRepositoryImpl } from "@/be/infrastructure/repository/user";
import { NextResponse } from "next/server";

// api/hello.js
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // 동적 라우트에서 ID 추출

  const repository = new UserRepositoryImpl();
  const usecase = new UserUsecase(repository);
  const user = await usecase.getUser(id);

  return NextResponse.json({ message: `Hello, user with ID: ${user?.name}` });
}
