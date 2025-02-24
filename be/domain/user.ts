export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
    ) {}
}

// define user repository interface

export interface UserRepository {
    findById(id: string): Promise<User | null>;
}