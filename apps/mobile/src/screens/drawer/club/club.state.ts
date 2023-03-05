import {
  atom,
  atomFamily,
  DefaultValue,
  noWait,
  selector,
  selectorFamily,
} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStoreKey } from 'apps/mobile/src/lib/conts';
import {
  getLocalData,
  removeLocalData,
  setLocalData,
} from 'apps/mobile/src/lib/util';
import { ClubStateInterface, Param } from 'apps/mobile/src/lib/types';
import { getTrpcClient } from 'apps/mobile/src/lib/trpc';
import { UserState } from 'apps/mobile/src/state/user.state';
import { ValOrUpdater } from '@score-man/types';

/** Club Details Will be the User Current Club */
export const OwnedClubState = selector({
  key: 'OwnedClub',
  async get({ get, getCallback }) {
    const user = await get(noWait(UserState)).toPromise();
    const club = await get(noWait(ClubState(user?.ownedClub?.id))).toPromise();

    // Callback
    const createClub = getCallback(({ snapshot: { getPromise }, set }) => {
      return async (name: string) => {
        const client = getTrpcClient();
        const user = await getPromise(UserState);
        if (user) {
          const club = await client.club.createClub.mutate({
            name: name,
            userId: user.id,
          });

          set(ClubState(club.id), { ...(club as any), joinRequests: [] });
          set(UserState, { ...user, ownedClub: { id: club.id } });
        }
      };
    });

    const updateClub = getCallback(({ snapshot: { getPromise }, set }) => {
      return async (updater: ValOrUpdater<ClubStateInterface>) => {
        const user = await getPromise(UserState);
        const club = await getPromise(ClubState(user?.ownedClub?.id));

        if (club) {
          set(ClubState(club.id), updater);
        }
      };
    });

    return { club, createClub, updateClub };
  },
});

export const JoinedClubState = selector({
  key: 'JoinedClub',
  async get({ get, getCallback }) {
    const user = await get(noWait(UserState)).toPromise();

    console.log({userInCLud: user});

    if (!user?.clubId) {
      return null;
    }

    const club = await get(noWait(ClubState(user.clubId))).toPromise();

    return club;
  },
});

export const JoinAbleClubsState = selector({
  key: 'JoinAbleClubsState',
  async get() {
    const client = getTrpcClient();
    const clubs = await client.club.getClubs.query();

    clubs.forEach((club) => {
      setLocalData(LocalStoreKey.Club, club as any, club.id);
    });

    return clubs;
  },
});

export const AcceptClubHandler = selector({
  key: 'AcceptClubHandler',
  async get({ get, getCallback }) {
    const acceptPlayerRequest = getCallback(
      ({ snapshot: { getPromise }, set }) => {
        return async (playerId: number) => {
          const { club, updateClub } = await getPromise(OwnedClubState);

          if (playerId && club) {
            const client = getTrpcClient();
            const isJoined = await client.club.acceptJoinRequest.mutate({
              playerId,
              clubId: club.id,
            });

            if (isJoined) {
              updateClub((pre) => {
                if (!pre) {
                  return pre;
                }

                return {
                  ...pre,
                  joinRequests: pre.joinRequests.filter(
                    (item) => item.id !== playerId
                  ),
                  players: [...pre.players, { id: playerId }],
                };
              });
            }
          }
        };
      }
    );

    const client = getTrpcClient();
    const user = await get(noWait(UserState)).toPromise();
    const club = await get(noWait(ClubState(user?.ownedClub?.id))).toPromise();
    if (club) {
      const requests = await client.club.getClubRequests.query(club?.id);

      return { requests: requests || [], acceptPlayerRequest };
    }

    return { requests: [], acceptPlayerRequest };
  },
});

// export const AcceptClubHandler = selectorFamily({

// })

export const JoinClubHanlder = selectorFamily({
  key: 'JoinAbleClubsState',
  get(clubId: Param) {
    return async ({ get, getCallback }) => {
      const joinClub = getCallback(({ snapshot: { getPromise }, set }) => {
        return async () => {
          const user = await getPromise(UserState);
          const client = getTrpcClient();
          if (clubId && user) {
            const isPending = await client.club.sendJoinRequest.mutate({
              clubId: clubId.toString(),
              playerId: user.id,
            });

            if (isPending) {
              set(ClubState(clubId), (pre) => {
                if (pre instanceof DefaultValue || pre === null) {
                  return pre;
                }

                return {
                  ...pre,
                  joinRequests: [...(pre.joinRequests || []), { id: user.id }],
                };
              });
            }
          }
        };
      });

      const cancelRequest = getCallback(({ snapshot: { getPromise }, set }) => {
        return async () => {
          const user = await getPromise(UserState);
          const client = getTrpcClient();
          if (clubId && user) {
            const isPending = await client.club.cancelJoinRequest.mutate({
              clubId: clubId.toString(),
              playerId: user.id,
            });

            if (isPending) {
              set(ClubState(clubId), (pre) => {
                if (pre instanceof DefaultValue || pre === null) {
                  return pre;
                }

                return {
                  ...pre,
                  joinRequests: pre.joinRequests?.filter(
                    (item) => item.id !== user.id
                  ),
                };
              });
            }
          }
        };
      });

      const club = await get(noWait(ClubState(clubId))).toPromise();
      const user = await get(noWait(UserState)).toPromise();
      const data = {
        pending: false,
        name: club?.name,
        id: club?.id,
        joinClub,
        cancelRequest,
      };
      if (club) {
        const client = getTrpcClient();
        let requests = club.joinRequests;

        if (!requests) {
          requests = await client.club.getClubRequests.query(club.id);
          setLocalData(LocalStoreKey.Club, {
            ...club,
            joinRequests: requests,
          }),
            club.id;
        }

        if (user && requests.some((item) => item.id === user?.id)) {
          return {
            ...data,
            pending: true,
          };
        }

        return data;
      }
    };
  },
});

export const ClubState = atomFamily<ClubStateInterface | null, Param>({
  key: 'ClubState',
  default: (clubId: Param) =>
    new Promise(async (setSelf) => {
      console.log('Called This Promise');
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
        const club = await client.club.getClub.query(clubId as string);
        if (club) {
          setSelf(club);
        }
      }
    }),
  effects(clubId) {
    return [
      ({ onSet }) =>
        onSet(async (state, old, isReset) => {
          console.log({ isReset });
          if (state && clubId) {
            setLocalData(LocalStoreKey.Club, state, clubId);
          } else {
            if (clubId) {
              removeLocalData(LocalStoreKey.Club, clubId);
            }
          }
        }),
    ];
  },
});

export const ClubUtils = selector({
  key: 'ClubUtils',
  get({ getCallback }) {
    const refetchClub = getCallback(
      ({ set }) =>
        async (clubId: string) => {
          const client = getTrpcClient();
          const club = await client.club.getClub.query(clubId);

          if (club) {
            set(ClubState(clubId), club);
          }
        }
    );

    return {refetchClub};
  },
});
