import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PetCareProvider } from '../src/storage/PetCareProvider';
import { palette } from '../src/utils/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PetCareProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.canvas },
            headerShadowVisible: false,
            headerTintColor: palette.ink,
            contentStyle: { backgroundColor: palette.canvas },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pets/new" options={{ title: 'Pet Profile' }} />
          <Stack.Screen name="pets/[id]" options={{ title: 'Pet Details' }} />
          <Stack.Screen name="entries/[kind]" options={{ title: 'New Entry' }} />
        </Stack>
      </PetCareProvider>
    </SafeAreaProvider>
  );
}
