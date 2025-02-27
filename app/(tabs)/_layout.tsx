import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        headerStyle: {
          backgroundColor: '#5D3FD3',
        },
        headerShadowVisible: false,
        headerTintColor: '#FFD700',
        tabBarStyle: {
          backgroundColor: '#5D3FD3',
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Throne Finder', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        )
      }} />
      <Tabs.Screen name="acount" options={{
        title: 'Acount',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'accessibility' : 'accessibility-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  );
}
