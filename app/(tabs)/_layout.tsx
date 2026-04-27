import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { palette } from '../../src/utils/theme';

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  pets: 'paw',
  logs: 'pulse',
  calendar: 'calendar',
  settings: 'settings',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: palette.canvas },
        headerShadowVisible: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: '#fffaf5',
          borderTopColor: '#eadccf',
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
        sceneStyle: { backgroundColor: palette.canvas },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name] ?? 'ellipse'} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', headerTitle: 'Pet Care Tracker' }} />
      <Tabs.Screen name="pets" options={{ title: 'Pets' }} />
      <Tabs.Screen name="logs" options={{ title: 'Logs' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Upcoming', headerTitle: 'Upcoming Care' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
