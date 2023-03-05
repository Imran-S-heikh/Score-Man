import { Club, Prisma } from '@prisma/client';
import { inferRouterOutputs,Simplify } from "@trpc/server";
import { authRouter } from 'apps/server/src/app/routers/auth/auth.router';
import { TrpcClient,AppRouter } from './trpc';

export type Param = string | null | undefined | number;

export type Signup = Simplify<inferRouterOutputs<AppRouter>['auth']['signup']>;

export type ClubStateInterface = Simplify<inferRouterOutputs<AppRouter>['club']['getClub']>
