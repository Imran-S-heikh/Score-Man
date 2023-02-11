import { Player } from "@prisma/client";
import { TrpcClient } from "./trpc";
import { Signup } from "./types";

export enum LocalStoreKey {
  LiveMatch = '@LiveMatch',
  Players = '@Players',
  Club = '@Club',
  CurrentUser = '@CurrentUser',
}

export interface LocalStore {
  [LocalStoreKey.Club]: {
    id: string;
    name: string;
  };
  [LocalStoreKey.Players]: string[];
  [LocalStoreKey.LiveMatch]: {};
  [LocalStoreKey.CurrentUser]: Awaited<ReturnType<Signup>>;
}
