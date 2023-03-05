import { z } from 'zod';
import { procedure, router } from '../../../lib/trpc';

export const playerRouter = router({
  getPlayers: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.player.findMany();
  }),
  getUser: procedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.prisma.player.findUnique({
      where: { id: input },
      include: { ownedClub: { select: { id: true } } },
    });
  }),
  getPlayersByClub: procedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const id = input;
      return await ctx.prisma.player.findMany({ where: { club: { id } } });
    }),
  getPlayer: procedure.input(z.number()).query(async ({ input, ctx }) => {
    return ctx.prisma.player.findUnique({ where: { id: input } });
  }),
});
