import { z } from 'zod';
import { procedure, router } from '../../../lib/trpc';

export const clubRouter = router({
  getClub: procedure.input(z.string()).query(async ({ input, ctx }) => {
    return await ctx.prisma.club.findUnique({ where: { id: input } });
  }),
  getClubByOwner: procedure.input(z.number()).query(async ({ input, ctx }) => {
    return await ctx.prisma.club.findUnique({ where: { ownerId: input } });
  }),
  createClub: procedure
    .input(
      z.object({
        name: z.string(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const club = await ctx.prisma.club.create({
        data: {
          name: input.name,
          ownerId: input.userId,
        },
      });

      return club;
    }),
});
