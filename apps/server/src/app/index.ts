import { procedure, router } from "../lib/trpc";
import { playerRouter } from "./routers/player/player.router";


export const appRouter = router({
  player: playerRouter,
  users: procedure.query(()=>{
    return []
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;

// const app = {} as AppRouter;

// appRouter.player.list
