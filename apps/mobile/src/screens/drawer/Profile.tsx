import { Suspense } from 'react';
import { Text, View } from 'react-native';
import { useRecoilValue } from "recoil";
import withSuspense from "../../components/WIthSuspense";
import { UserState } from "../../state/user.state";

function ProfileScreen() {
  const user = useRecoilValue(UserState);

  return (
    <View className="bg-black flex flex-1">
      <Text className="text-white">Hell oworld</Text>
    </View>
  );
}


export default withSuspense(ProfileScreen)
