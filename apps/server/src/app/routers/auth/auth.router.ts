import { z } from 'zod';
import { procedure, router } from '../../../lib/trpc';

export const authRouter = router({
  signup: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email('Invalid Email Address'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.player.create({
        data: input,
        include: {
          ownedClub: {
            select: {
              id: true,
            },
          },
        },
      });

      return user;
    }),

  signin: procedure
    .input(z.string().email('Invalid Email Address'))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.player.findUnique({
        where: { email: input },
        include: {
          ownedClub: {
            select: {
              id: true,
            },
          },
        },
      });

      return user;
    }),
});
