import { Suspense, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Dialog, Input } from 'react-native-elements';
import { useRecoilState, useRecoilValue } from 'recoil';
import Signin from '../../components/Signin';
import withSuspense from '../../components/WIthSuspense';
import useClient from '../../hooks/client';
import { UserState } from '../../state/user.state';

function ProfileScreen() {
  const [user, setUser] = useRecoilState(UserState);
  const [open, setOpen] = useState(false);
  const client = useClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);
    const user = await client.auth.signup.mutate({
      name: name,
      email: email,
    });

    if (user) {
      setUser(user);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <View>
        <Text className="text-center my-3">
          No User Profile Found. Please create one
        </Text>

        <View className="mx-4">
          <Signin />
          <View className="mt-2">
            <Button onPress={() => setOpen(true)} title="Signup" />
          </View>
        </View>

        <Dialog isVisible={open} onBackdropPress={() => setOpen(false)}>
          <Dialog.Title title="Create User Account" />
          <View className="flex">
            <Input
              value={name}
              onChangeText={setName}
              className="mx-0 px-0"
              placeholder="your name..."
              label="Name:"
            />
            <Input
              value={email}
              onChangeText={setEmail}
              className="mx-0 px-0"
              placeholder="your email..."
              label="Email:"
            />
          </View>
          <View className="bg-red-700 flex justify-center">
            <Button
              loading={loading}
              onPress={handleCreateUser}
              className="mx-auto"
              title="Create"
            ></Button>
          </View>
        </Dialog>
      </View>
    );
  }

  return (
    <View className="flex flex-1 ">
      <Text className="text-xl font-bold text-center">{user.name}</Text>
      <Text className="text-xl font-bold text-center">{user.email}</Text>
      <View className="mx-3 mt-3">
        <Button title="Signout" onPress={() => setUser(null)}></Button>
      </View>
    </View>
  );
}

export default withSuspense(ProfileScreen);
