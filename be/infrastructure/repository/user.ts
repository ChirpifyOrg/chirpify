import { User } from "@/be/domain/user";
import { UserRepository } from "@/be/domain/user";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        public data: Map<number, User> = new Map([
            [1, new User(1, "John Doe", "john.doe@example.com")],
        ])
    ) {}

    async findById(id: string): Promise<User | null> {
        return this.data.get(parseInt(id)) ?? null;
    }
}

