import express from 'express';
import {
  createExpressMiddleware,
} from '@trpc/server/adapters/express';
import { appRouter } from './app';
import createContext from './lib/context';


const app = express();

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(4000);
