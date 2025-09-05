import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

export default function AuthLayout() {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Do you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    // <AuthProvider>
      
    // </AuthProvider>
    <Stack screenOptions={{ headerShown: false }} />
  );
}