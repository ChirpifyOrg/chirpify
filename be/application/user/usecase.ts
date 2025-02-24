import { UserRepository } from "@/be/domain/user";

export class UserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string)  {
    return this.userRepository.findById(id);
  }
}

