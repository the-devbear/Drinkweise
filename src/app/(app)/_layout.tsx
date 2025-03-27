import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { TouchableOpacity } from 'react-native';

const TabBarIcon = ({
  name,
  color,
}: {
  name: ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) => {
  return <Ionicons size={24} name={name} color={color} />;
};

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color, size }) => <TabBarIcon name='code' color={color} size={size} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons size={24} name='alert' color='black' />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name='session'
        options={{
          title: 'Session',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name={focused ? 'beer' : 'beer-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='two'
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color, size }) => <TabBarIcon name='home' color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
