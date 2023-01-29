import { z } from 'zod';
import { procedure, router } from '../../../lib/trpc';

export const playerRouter = router({
  getPlayers: procedure.query(async () => {
    return await prisma.player.findMany();
  }),
  getPlayersByClub: procedure.input(z.string()).query(async (ctx) => {
    const id = ctx.input;
    return await prisma.player.findMany({ where: { club: { id } } });
  }),
});
