import { IUnitOfWork } from '@/be/domain/IUnitOfWork';

export abstract class UnitOfWork implements IUnitOfWork<any> {
   protected transactionClient: unknown;
   constructor(protected readonly client: any) {}
   executeInTransaction<T>(callback: (uow: any) => Promise<T>): Promise<T> {
      console.log(callback);
      throw new Error('Method not implemented.');
   }

   protected getOriginClient() {
      return this.client;
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
