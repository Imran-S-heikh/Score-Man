import { Player } from '@prisma/client';
import { atom, atomFamily } from 'recoil';
import { LocalStoreKey } from '../lib/conts';
import { getTrpcClient, TrpcClient } from '../lib/trpc';
import { Param, Signup } from '../lib/types';
import { getLocalData, removeLocalData, setLocalData } from '../lib/util';

/** Current User Details */
export const UserState = atom<Awaited<ReturnType<Signup>> | null>({
  key: 'USER_STATE',
  default: new Promise(async (setSelf) => {
    /** Get User Details form localstorage */
    const user = await getLocalData(LocalStoreKey.CurrentUser);

    setSelf(user);
  }),

  effects: [
    ({ onSet }) =>
      onSet((state) => {
        if (state) {
          setLocalData(LocalStoreKey.CurrentUser, state);
        } else {
          removeLocalData(LocalStoreKey.CurrentUser);
        }
      }),
  ],
});

export const PlayerState = atomFamily<Player | null, Param>({
  key: 'PlayerState',
  default: (playerId: Param) =>
    new Promise(async (setSelf) => {
      if (!playerId) {
        return null;
      }
      {
        const player = await getLocalData(LocalStoreKey.Player, playerId);

        if (player) {
          return setSelf(player);
        }
      }

      {
        const client = getTrpcClient();
        const player = await client.player.getPlayer.query(playerId as number);
        if (player) {
          return setSelf(player)
        }
      }

      setSelf(null)
    }),
  effects(playerId: Param) {
    return [
      ({ onSet }) =>
        onSet(async (player) => {
          if (player) {
            return setLocalData(LocalStoreKey.Player, player, player.id);
          }

          if (playerId) {
            removeLocalData(LocalStoreKey.Player, playerId);
          }
        }),
    ];
  },
});
