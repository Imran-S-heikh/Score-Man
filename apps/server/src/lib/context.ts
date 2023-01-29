import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import prisma from './prisma';

function createContext({ req, res }: CreateExpressContextOptions) {
  console.log(req);
  return {
    prisma: prisma,
  };
}

export default createContext;
