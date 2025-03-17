import '../global.css';

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="login" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
