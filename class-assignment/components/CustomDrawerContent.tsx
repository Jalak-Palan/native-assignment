import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme() ?? 'light';
  const { simulatedMode } = useSurvey();
  const insets = useSafeAreaInsets();

  const colors = Colors[colorScheme];

  // Helper to determine if a route is active
  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname.startsWith(route);
  };

  const navItems = [
    { label: 'Dashboard', icon: 'home-outline', activeIcon: 'home', route: '/' },
    { label: 'Survey Form', icon: 'create-outline', activeIcon: 'create', route: '/survey' },
    { label: 'Camera Access', icon: 'camera-outline', activeIcon: 'camera', route: '/camera' },
    { label: 'Location Tracker', icon: 'location-outline', activeIcon: 'location', route: '/location' },
    { label: 'Contacts Sync', icon: 'people-outline', activeIcon: 'people', route: '/contacts' },
    { label: 'Clipboard Mgr', icon: 'clipboard-outline', activeIcon: 'clipboard', route: '/clipboard' },
    { label: 'Settings', icon: 'settings-outline', activeIcon: 'settings', route: '/settings' },
  ];

  const handleNavigate = (route: string) => {
    props.navigation.closeDrawer();
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Student Details Header */}
      <View style={[
        styles.header, 
        { 
          paddingTop: insets.top + 20, 
          backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#0a7ea4',
        }
      ]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>JP</Text>
        </View>
        <Text style={styles.studentName}>Jalak Palan</Text>
        <Text style={styles.rollNumber}>Roll No: RN-2026-07</Text>
        
        {simulatedMode && (
          <View style={styles.simBadge}>
            <Text style={styles.simBadgeText}>Simulated Mode Active</Text>
          </View>
        )}
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {navItems.map((item, index) => {
            const active = isActive(item.route);
            return (
              <Pressable
                key={index}
                onPress={() => handleNavigate(item.route)}
                style={[
                  styles.navItem,
                  active && { 
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 126, 164, 0.1)' 
                  }
                ]}
              >
                <Ionicons
                  name={active ? (item.activeIcon as any) : (item.icon as any)}
                  size={22}
                  color={active ? (colorScheme === 'dark' ? '#fff' : '#0a7ea4') : colors.icon}
                  style={styles.navIcon}
                />
                <Text
                  style={[
                    styles.navLabel,
                    { color: active ? (colorScheme === 'dark' ? '#fff' : '#0a7ea4') : colors.text },
                    active && styles.activeLabel
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }]}>
        <Text style={[styles.footerText, { color: colors.icon }]}>Mini Project v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  simBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffb300',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  simBadgeText: {
    color: '#11181c',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 8,
  },
  menuContainer: {
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  navIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
  },
});
