// U : Curiously Recurring Template Pattern (CRTP)
// 부모 인터페이스에서 자식 클래스의 타입을 알기 위해 사용하였음.
export interface IUnitOfWork<U extends IUnitOfWork<U>> {
   executeInTransaction<T>(callback: (uow: U) => Promise<T>): Promise<T>;
   beginTransaction(): Promise<void>;
   commit(): Promise<void>;
   rollback(): Promise<void>;
}
