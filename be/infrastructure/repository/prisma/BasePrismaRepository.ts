import { Prisma, PrismaClient } from '@/lib/generated/prisma';

// prisma 구현체를 위한 기본 클래스
export class BasePrismaRepository {
   protected prisma: PrismaClient | Prisma.TransactionClient;

   constructor(prisma: PrismaClient) {
      this.prisma = prisma;
   }

   setClient(tx: Prisma.TransactionClient) {
      this.prisma = tx;
   }
}
