import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined;
};

export const prisma =
   globalForPrisma.prisma ??
   (process.env.NODE_ENV !== 'production'
      ? new PrismaClient({
           log: ['query', 'info', 'warn', 'error'],
        })
      : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
