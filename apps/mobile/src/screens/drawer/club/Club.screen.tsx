import Hide from 'apps/mobile/src/components/Hide';
import { useClubUtils } from 'apps/mobile/src/hooks/club';
import { PlayerState, UserState } from 'apps/mobile/src/state/user.state';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Dialog, Input } from 'react-native-elements';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  AcceptClubHandler,
  ClubState,
  JoinAbleClubsState,
  JoinClubHanlder,
  JoinedClubState,
  OwnedClubState,
} from './club.state';

import ButtonLoading from '../../../components/Button';
import useClient from 'apps/mobile/src/hooks/client';

function AcceptRequestItem({ playerId }: { playerId: number }) {
  const client = useClient();
  const player = useRecoilValue(PlayerState(playerId));
  const { club } = useRecoilValue(OwnedClubState);
  const { acceptPlayerRequest } = useRecoilValue(AcceptClubHandler);
  const setClub = useSetRecoilState(ClubState(club?.id));

  const declineJoinRequest = async () => {
    if (club) {
      const updated = await client.club.declineJoinRequest.mutate({
        clubOwnerId: club?.ownerId,
        playerId,
      });

      setClub(updated);
    }
  };

  return (
    <View className="flex flex-row justify-between items-center mt-3">
      <Text className="text-lg font-bold">{player?.name}</Text>

      <View className="flex flex-row">
        <Button
          buttonStyle={{ height: 30, backgroundColor: '#860c0c' }}
          titleStyle={{ fontSize: 10 }}
          title="Decline"
          onPress={declineJoinRequest}
        />
        <View className="w-2" />
        <Button
          onPress={() => acceptPlayerRequest(playerId)}
          buttonStyle={{ height: 30 }}
          titleStyle={{ fontSize: 10 }}
          title="Accept"
        />
      </View>
    </View>
  );
}

function ClubPlayerItem({ playerId }: { playerId: number }) {
  const player = useRecoilValue(PlayerState(playerId));
  const { club } = useRecoilValue(OwnedClubState);
  const setClub = useSetRecoilState(ClubState(club?.id));
  const client = useClient();

  const kickPlayer = async () => {
    if (club) {
      const updated = await client.club.kickFromClub.mutate({
        playerId,
        clubOwnerId: club?.ownerId,
      });

      setClub(updated);
    }
  };

  return (
    <View className="flex flex-row justify-between items-center mt-1">
      <Text className="text-lg font-bold">{player?.name}</Text>

      <View className="flex flex-row">
        <Button
          buttonStyle={{ height: 30, backgroundColor: '#860c0c' }}
          titleStyle={{ fontSize: 10 }}
          title="Kick"
          onPress={kickPlayer}
        />
      </View>
    </View>
  );
}

function OwnedClub() {
  const { club, createClub } = useRecoilValue(OwnedClubState);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { refetchClub } = useClubUtils();

  async function handleCreate() {
    setLoading(true);
    await createClub(name);
    setLoading(false);
  }

  if (!club) {
    return (
      <View>
        <Text className="text-lg font-bold">Owned Club</Text>
        <View className="border p-2 rounded border-black/50">
          <Text className="text-center mb-2">No Club Details Found</Text>
          <Button onPress={() => setOpen(true)} title="Create Club"></Button>
          <Dialog isVisible={open} onBackdropPress={() => setOpen(false)}>
            <Dialog.Title title="Create Club"></Dialog.Title>
            <View>
              <Input
                value={name}
                onChangeText={setName}
                className="mx-0 px-0"
                placeholder="club name..."
                label="Your Club Name:"
              />

              <Button
                loading={loading}
                onPress={handleCreate}
                title="Create"
              ></Button>
            </View>
          </Dialog>
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* <Button onPress={handleRefresh} title="Refresh"></Button> */}
      <View className="flex flex-row justify-between">
        <Text className="text-lg font-bold">Owned Club</Text>
        <ButtonLoading
          onPress={async () => refetchClub(club.id)}
          title="Refresh"
          buttonStyle={{ height: 30 }}
          titleStyle={{ fontSize: 10 }}
        ></ButtonLoading>
      </View>
      <View className="border border-black/50 rounded px-3 mt-3">
        <Text className="text-xl font-bold">Club Name: {club.name}</Text>
        <Text className="text-xl font-bold">Club ID: {club.id}</Text>
      </View>
      <View className="border border-black/50 rounded px-3 py-2 mt-2">
        <Text className="text-lg text-center font-bold">Current Players</Text>
        {club.players?.map((request) => (
          <ClubPlayerItem key={request.id} playerId={request.id} />
        ))}
      </View>
      <View className="border border-black/50 rounded px-3 py-2 mt-2">
        <Text className="text-lg text-center font-bold">Join Requests</Text>
        {club.joinRequests?.map((request) => (
          <AcceptRequestItem key={request.id} playerId={request.id} />
        ))}
      </View>
    </View>
  );
}

function JoinClubItem({ clubId }: { clubId: string }) {
  const club = useRecoilValue(JoinClubHanlder(clubId));

  return (
    <View className="border border-black/30 rounded px-3 py-2 flex flex-row justify-between items-center">
      <Text className="text-lg font-bold">{club?.name}</Text>
      <Hide
        open={club?.pending}
        fallback={<Button onPress={club?.joinClub} title="Join" />}
      >
        <Button
          onPress={club?.cancelRequest}
          buttonStyle={{ backgroundColor: 'orange' }}
          title="Cancel Join"
        />
      </Hide>
    </View>
  );
}

function JoinClubPopup() {
  const [open, setOpen] = useState(false);
  const clubs = useRecoilValue(JoinAbleClubsState);

  return (
    <View>
      <Text className="text-lg font-bold">Joined Club</Text>

      <View className="border p-2 rounded border-black/50">
        <Text className="text-center mb-2">You are not in a club</Text>
        <Button onPress={() => setOpen(true)} title="Join A Club"></Button>
        <Dialog isVisible={open} onBackdropPress={() => setOpen(false)}>
          <Dialog.Title title="Join A Club"></Dialog.Title>
          <View>
            {clubs.map((club) => (
              <JoinClubItem key={club.id} clubId={club.id} />
            ))}
          </View>
        </Dialog>
      </View>
    </View>
  );
}

function JoinedClub() {
  const club = useRecoilValue(JoinedClubState);
  const [user, setUser] = useRecoilState(UserState);
  const { refetchClub } = useClubUtils();
  const {
    player: { leaveJoinedClub },
  } = useClient();

  if (!club) {
    return <JoinClubPopup />;
  }

  async function handleLeaveJoinedClub() {
    if (user) {
      const updated = await leaveJoinedClub.mutate({ playerId: user.id });
      if (updated) {
        setUser((pre) => pre && { ...pre, ...updated });
      }
    }
  }

  return (
    <View>
      <View className="flex flex-row justify-between">
        <Text className="text-lg font-bold">Joined Club</Text>
        <ButtonLoading
          onPress={async () => refetchClub(club.id)}
          title="Refresh"
          buttonStyle={{ height: 30 }}
          titleStyle={{ fontSize: 10 }}
        ></ButtonLoading>
      </View>
      <View>
        <View className="border border-black/50 rounded px-3 mt-3 mb-3">
          <Text className="text-xl font-bold">Club Name: {club.name}</Text>
          <Text className="text-xl font-bold">Club ID: {club.id}</Text>
        </View>
        <ButtonLoading
          onPress={handleLeaveJoinedClub}
          title="Leave Club"
          className="mt-6 hidden"
        ></ButtonLoading>
      </View>
    </View>
  );
}

function ClubScreen() {
  return (
    <View className="mx-2 mt-3">
      <View>
        <OwnedClub />
      </View>

      <View className="mt-8">
        <JoinedClub />
      </View>
    </View>
  );
}

export default ClubScreen;
