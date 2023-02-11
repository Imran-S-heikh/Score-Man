import { Player } from '@prisma/client';
import { atom } from 'recoil';
import { LocalStoreKey } from '../lib/conts';
import { TrpcClient } from "../lib/trpc";
import { Signup } from "../lib/types";
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
