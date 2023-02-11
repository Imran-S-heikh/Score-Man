import { atom, atomFamily, noWait, selector } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStoreKey } from 'apps/mobile/src/lib/conts';
import { getLocalData } from 'apps/mobile/src/lib/util';
import { Param } from 'apps/mobile/src/lib/types';
import { getTrpcClient } from 'apps/mobile/src/lib/trpc';
import { UserState } from 'apps/mobile/src/state/user.state';

/** Club Details Will be the User Current Club */
export const ClubDetails = selector({
  key: 'ClubDetails',
  async get({ get, getCallback }) {
    // Callback
    const createClub = getCallback(
      ({ snapshot: { getPromise }, set }) => {
        return async (name: string) => {
          const client = getTrpcClient();
          const user = await getPromise(UserState);
          if (user) {
            const club = await client.club.createClub.mutate({
              name: name,
              userId: user.id,
            });

            set(ClubState(club.id), club);
            set(UserState, { ...user, ownedClub: { id: club.id } });
          }
        };
      }
    );

    const user = await get(noWait(UserState)).toPromise();
    const club = await get(noWait(ClubState(user?.ownedClub?.id))).toPromise();

    return { club, createClub };
  },
});

export const ClubState = atomFamily<{ id: string; name: string } | null, Param>(
  {
    key: 'ClubState',
    default: (clubId: Param) =>
      new Promise(async (setSelf) => {
        if (!clubId) {
          return setSelf(null);
        }

        /** Get Data From localstorage */
        {
          let club = await getLocalData(LocalStoreKey.Club, clubId);

          if (club) {
            return setSelf(club);
          }
        }

        /** Get Data from Server */
        {
          const client = getTrpcClient();
          const club = await client.club.getClub.query(clubId);
          if (club) {
            setSelf(club);
          }
        }
      }),
  }
);
