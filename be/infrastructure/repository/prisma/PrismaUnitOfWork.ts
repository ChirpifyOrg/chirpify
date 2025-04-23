import { Prisma, PrismaClient } from '@/lib/generated/prisma';

import { BasePrismaRepository } from './BasePrismaRepository';
import { UnitOfWork } from '../uow/UnitOfWork';

export class PrismaUnitOfWork extends UnitOfWork {
   protected transactionClient: unknown;

   constructor(protected readonly client: unknown) {
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
   private createProxyWithTx(tx: Prisma.TransactionClient): this {
      return new Proxy(this, {
         get: (target, prop, receiver) => {
            const value = Reflect.get(target, prop, receiver);

            if (value instanceof BasePrismaRepository) {
               value.setClient(tx);
            }

            return value;
         },
      });
   }
   async executeInTransaction<T>(callback: (uow: this) => Promise<T>): Promise<T> {
      return this.prisma.$transaction(async tx => {
         const proxy = this.createProxyWithTx(tx);
         this.transactionClient = tx;
         try {
            return await callback(proxy);
         } finally {
            this.transactionClient = null;
         }
      });
   }
}
