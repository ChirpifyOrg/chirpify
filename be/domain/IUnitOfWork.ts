export interface IUnitOfWork {
   executeInTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
   beginTransaction(): Promise<void>;
   commit(): Promise<void>;
   rollback(): Promise<void>;
}
