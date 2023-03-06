import { string, z } from 'zod';
import { procedure, router } from '../../../lib/trpc';

export const clubRouter = router({
  getClub: procedure.input(z.string()).query(async ({ input, ctx }) => {
    const club = await ctx.prisma.club.findUnique({
      where: { id: input },
      include: {
        joinRequests: { select: { id: true } },
        players: { select: { id: true } },
      },
    });

    return club;
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
  getClubs: procedure.query(async ({ ctx }) => {
    const clubs = await ctx.prisma.club.findMany({
      include: {
        joinRequests: {
          select: {
            id: true,
          },
        },
      },
    });

    return clubs;
  }),
  getClubRequests: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const club = await ctx.prisma.club.findUnique({
      where: {
        id: input,
      },
      select: {
        joinRequests: {
          select: { id: true },
        },
      },
    });

    return club?.joinRequests;
  }),

  sendJoinRequest: procedure
    .input(
      z.object({
        clubId: z.string(),
        playerId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.club.update({
        where: {
          id: input.clubId,
        },
        data: {
          joinRequests: {
            connect: {
              id: input.playerId,
            },
          },
        },
      });

      return Boolean(updated);
    }),

  cancelJoinRequest: procedure
    .input(
      z.object({
        clubId: z.string(),
        playerId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.club.update({
        where: {
          id: input.clubId,
        },
        data: {
          joinRequests: {
            disconnect: {
              id: input.playerId,
            },
          },
        },
      });

      return Boolean(updated);
    }),

  acceptJoinRequest: procedure
    .input(
      z.object({
        clubId: z.string(),
        playerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const club = await ctx.prisma.club.update({
        where: { id: input.clubId },
        data: {
          joinRequests: {
            disconnect: { id: input.playerId },
          },
          players: {
            connect: { id: input.playerId },
          },
        },
      });

      return Boolean(club);
    }),

  declineJoinRequest: procedure
    .input(z.object({ clubOwnerId: z.number(), playerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.club.update({
        where: { ownerId: input.clubOwnerId },
        data: {
          joinRequests: {
            disconnect: { id: input.playerId },
          },
        },
        include: {
          joinRequests: {
            select: { id: true },
          },
          players: {
            select: { id: true },
          },
        },
      });
    }),

  kickFromClub: procedure
    .input(z.object({ clubOwnerId: z.number(), playerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.club.update({
        where: { ownerId: input.clubOwnerId },
        data: {
          players: {
            disconnect: { id: input.playerId },
          },
        },
        include: {
          joinRequests: { select: { id: true } },
          players: { select: { id: true } },
        },
      });
    }),
});
