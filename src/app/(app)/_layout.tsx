import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';

const TabBarIcon = ({
  name,
  color,
  size,
}: {
  name: ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) => {
  return <Ionicons size={size} name={name} color={color} />;
};

export default function TabBarLayout() {
  return (
    <Tabs initialRouteName='(home)' screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='(home)'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='drinks'
        options={{
          title: 'Drinks',
          headerShown: false,
          lazy: false,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name={focused ? 'beer' : 'beer-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
