import { uowContext } from '@/be/domain/UnitOfWorkContext';
import { Prisma, PrismaClient } from '@prisma/client';

// prisma 구현체를 위한 클래스
// 모든 prisma를 통한 영속화 구현체들은 UoW + Service Locator 가 적용된  prisma()를 통해서 prismaclient를 가져오도록 한다.
export abstract class BasePrismaRepository {
   constructor(private readonly defaultClient: PrismaClient) {}

   protected get prisma(): PrismaClient | Prisma.TransactionClient {
      const tx = uowContext.getStore();
      const defaultClient = this.defaultClient;
      const currentClient = tx ?? defaultClient;
      // duck type checking
      if (!('$transaction' in currentClient)) {
         console.log('[BasePrismaRepo.getClient] : transaction 안');
      } else {
         console.log('[BasePrismaRepo.getClient] : transaction 바깥');
      }
      return currentClient;
   }
}
