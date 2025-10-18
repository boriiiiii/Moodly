import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Use dark navbar to match background
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B0B0B0',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#353535',
          borderTopColor: 'transparent',
        },
        headerStyle: {
          backgroundColor: '#353535',
        },
        headerTintColor: '#FFFFFF',
      }}>
    </Tabs>
  );
}
