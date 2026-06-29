import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

export const getPrisma = (): PrismaClient | null => {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prismaInstance;
};

export default getPrisma;
