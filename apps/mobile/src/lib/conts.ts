import { Player } from "@prisma/client";
import { TrpcClient } from "./trpc";
import { ClubStateInterface, Signup } from "./types";

export enum LocalStoreKey {
  LiveMatch = '@LiveMatch',
  Player = '@Player',
  Club = '@Club',
  CurrentUser = '@CurrentUser',
}

export interface LocalStore {
  [LocalStoreKey.Club]: ClubStateInterface;
  [LocalStoreKey.Player]: Player;
  [LocalStoreKey.LiveMatch]: {};
  [LocalStoreKey.CurrentUser]: Awaited<ReturnType<Signup>>;
}
