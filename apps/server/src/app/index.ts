import { procedure, router } from "../lib/trpc";
import { authRouter } from "./routers/auth/auth.router";
import { clubRouter } from "./routers/club/club.router";
import { playerRouter } from "./routers/player/player.router";


export const appRouter = router({
  player: playerRouter,
  club: clubRouter,
  auth: authRouter
});

export type AppRouter = typeof appRouter;
