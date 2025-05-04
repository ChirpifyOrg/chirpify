import { Prisma, PrismaClient } from '@prisma/client';
import { UnitOfWork } from '../uow/UnitOfWork';
import { uowContext } from '@/be/domain/UnitOfWorkContext';

export class PrismaUnitOfWork extends UnitOfWork {
   protected transactionClient: PrismaClient | Prisma.TransactionClient | null = null;
   constructor(protected readonly client: PrismaClient | Prisma.TransactionClient) {
      super(client);
   }
   beginTransaction(): Promise<void> {
      throw new Error('Method not implemented.');
   }
   commit(): Promise<void> {
      throw new Error('Method not implemented.');
   }
   rollback(): Promise<void> {
      throw new Error('Method not implemented.');
   }
   static create(prisma: PrismaClient): PrismaUnitOfWork {
      return new PrismaUnitOfWork(prisma);
   }

   async executeInTransaction<T>(callback: (uow: this) => Promise<T>): Promise<T> {
      // duck typing을 통해 check
      if (!('$transaction' in this.client)) {
         console.error('[executeInTransaction] error this.client :', this.client.constructor.name, this.client);
         throw new Error('$transaction은 PrismaClient에서만 호출할 수 있습니다.');
      }

      return this.client.$transaction(async tx => {
         if (!('$transaction' in tx)) {
            console.error('[in $transaction] : tx가 $transaction을 가지고 있습니다.');
         }
         return uowContext.run(tx, async () => {
            try {
               return await callback(this);
            } catch (e) {
               console.log(e); // 로깅 기능 추후 추가
               throw e;
            } finally {
            }
         });
      });
   }
}
