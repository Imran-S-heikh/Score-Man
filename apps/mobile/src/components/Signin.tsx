import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Input } from 'react-native-elements';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useClient from '../hooks/client';
import { UserState } from '../state/user.state';

function Signin() {
  const [open, setOpen] = useState(false);
  const client = useClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const setUser = useSetRecoilState(UserState);

  async function handleSignin() {
    setLoading(true);
    const user = await client.auth.signin.query(email);
    console.log({user})
    setUser(user);
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Button title="Signin" onPress={() => setOpen(true)} />
      <Dialog isVisible={open} onBackdropPress={() => setOpen(false)}>
        <Dialog.Title title="Create User Account" />
        <View className="flex">
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
            onPress={handleSignin}
            className="mx-auto"
            title="Submit"
          ></Button>
        </View>
      </Dialog>
    </React.Fragment>
  );
}

export default Signin;
