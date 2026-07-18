import React from 'react';
import Drawer from 'expo-router/drawer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function DrawerLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 280,
          backgroundColor: colors.background,
        },
        swipeEdgeWidth: 100, // Makes swipe-to-open drawer easy
      }}
    >
      {/* 
        The names here map exactly to the file system routes:
        - (tabs) resolves to the bottom tabs layout.
        - camera resolves to app/(drawer)/camera.tsx
        - contacts resolves to app/(drawer)/contacts.tsx
        - location resolves to app/(drawer)/location.tsx
        - clipboard resolves to app/(drawer)/clipboard.tsx
        - settings resolves to app/(drawer)/settings.tsx
      */}
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Dashboard',
        }} 
      />
      <Drawer.Screen 
        name="camera" 
        options={{ 
          title: 'Camera Access',
        }} 
      />
      <Drawer.Screen 
        name="contacts" 
        options={{ 
          title: 'Contacts Sync',
        }} 
      />
      <Drawer.Screen 
        name="location" 
        options={{ 
          title: 'Location Tracker',
        }} 
      />
      <Drawer.Screen 
        name="clipboard" 
        options={{ 
          title: 'Clipboard Manager',
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
        }} 
      />
    </Drawer>
  );
}
