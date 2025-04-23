import { IUnitOfWork } from '@/be/domain/IUnitOfWork';

export abstract class UnitOfWork implements IUnitOfWork {
   protected transactionClient: unknown;

   constructor(protected readonly client: unknown) {}

   abstract executeInTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;

   static create(client: unknown): UnitOfWork {
      throw new Error('Need Implements Prisma UoW!');
   }

   async beginTransaction(): Promise<void> {
      if (this.transactionClient) {
         throw new Error('Transaction already started');
      }
      this.transactionClient = this.client;
   }

   async commit(): Promise<void> {
      if (!this.transactionClient) {
         throw new Error('No transaction in progress');
      }
      this.transactionClient = null;
   }

   async rollback(): Promise<void> {
      if (!this.transactionClient) {
         throw new Error('No transaction in progress');
      }
      this.transactionClient = null;
   }
}
