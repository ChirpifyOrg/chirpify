import { Prisma, PrismaClient } from '@/lib/generated/prisma';

import { BasePrismaRepository } from './BasePrismaRepository';
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
   // uow 패턴을 암시적으로 처리하기 위해 아래와 같이 proxy 지정
   private createProxyWithTx(tx: Prisma.TransactionClient) {
      const proxy = new Proxy(this, {
         get: (target, prop, receiver) => {
            if (prop === 'client') {
               return tx;
            }
            const value = Reflect.get(target, prop, receiver);
            if (value instanceof BasePrismaRepository) {
               const value = Reflect.get(target, prop, receiver);
            }
            return value;
         },
      });
      // 내부에서 tx -> prismaclient로 변환하는 restore 메소드 주입
      (proxy as any).restoreClient = () => {
         for (const key of Object.keys(this)) {
            const val = (this as any)[key]; // BasePrismaRepository 뿐만이 아닌 그 외 key가 있을수 있으니 any 지정.
            if (val instanceof BasePrismaRepository) {
            }
         }
      };
      return proxy;
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
         // const proxy = this.createProxyWithTx(tx); // 프록시가 없어도 각 도메인별 uow 구현체에서
         return uowContext.run(tx, async () => {
            try {
               return await callback(this);
            } catch (e) {
               console.log(e); // 로깅 기능 추후 추가
               throw e;
            } finally {
               uowContext.exit(() => {
                  //(proxy as any).restoreClient();
               });
               uowContext.disable();
            }
         });
      });
   }
}
