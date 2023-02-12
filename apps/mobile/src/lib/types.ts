import { Club, Prisma } from '@prisma/client';
import { authRouter } from 'apps/server/src/app/routers/auth/auth.router';
import { TrpcClient } from './trpc';

export type Param = string | null | undefined | number;

export type Signup = TrpcClient['auth']['signup']['mutate'];

export type ClubStateInterface = Awaited<ReturnType<TrpcClient['club']['getClub']['query']>>