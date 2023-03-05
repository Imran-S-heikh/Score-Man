import { useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

function LoadingButton({
  children,
  onPress,
  loading: loadingDefault,
  ...props
}: Omit<ButtonProps, 'onPress'> & {
  onPress: (e: GestureResponderEvent) => Promise<void>;
}) {
  const [loading, setLoading] = useState(Boolean(loadingDefault));
  const handlePress = async (event: GestureResponderEvent) => {
    setLoading(true);
    await onPress(event);
    setLoading(false);
  };
  return (
    <Button {...props} onPress={handlePress} loading={loading}>
      {children}
    </Button>
  );
}

export default LoadingButton;
