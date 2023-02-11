import { Prisma } from '@prisma/client';
import { authRouter } from 'apps/server/src/app/routers/auth/auth.router';
import { TrpcClient } from './trpc';

export type Param = string | null | undefined;

export type Signup = TrpcClient['auth']['signup']['mutate'];
