import { ActivityIndicator, Text, View } from 'react-native';

function Loader() {
  return (
    <View className="flex flex-1 flex-row justify-around p-10 bg-black/10">
      <ActivityIndicator color="#000000" size="large" />
    </View>
  );
}

export default Loader;
