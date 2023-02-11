import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Dialog, Input } from 'react-native-elements';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ClubDetails } from './club.state';

function ClubScreen() {
  const { club, createClub } = useRecoilValue(ClubDetails);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    await createClub(name);
    setLoading(false);
  }

  if (!club) {
    return (
      <View className="mx-2 mt-10">
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
    );
  }

  return (
    <View>
      <Text className="text-xl text-center font-bold">Club Name: {club.name}</Text>
      <Text className="text-xl text-center font-bold">Club ID: {club.id}</Text>
    </View>
  );
}

export default ClubScreen;
