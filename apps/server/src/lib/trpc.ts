import { initTRPC } from '@trpc/server';
import { Context } from "./context";


export const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;
export const procedure = t.procedure;