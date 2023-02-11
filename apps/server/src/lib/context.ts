import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import prisma from './prisma';

function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    prisma: prisma,
  };
}
export type Context = ReturnType<typeof createContext>;
export default createContext;
