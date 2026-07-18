import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const PHOTO_STORAGE_KEY = '@user_photo';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme];

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Load saved profile photo each time the header renders (focus-aware)
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(PHOTO_STORAGE_KEY).then((uri) => {
      if (active && uri) setPhotoUri(uri);
    });
    return () => { active = false; };
  }, []);

  const handleLeftPress = () => {
    if (showBack) {
      navigation.goBack();
    } else {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top + 8,
        backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff',
        borderBottomColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3',
      }
    ]}>
      <Pressable 
        onPress={handleLeftPress} 
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Ionicons 
          name={showBack ? "arrow-back" : "menu"} 
          size={26} 
          color={colors.text} 
        />
      </Pressable>
      
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      {/* Profile avatar button */}
      <Pressable 
        onPress={() => router.push('/(drawer)/(tabs)/profile')} 
        style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.avatarImage}
          />
        ) : (
          <Ionicons 
            name="person-circle-outline" 
            size={36} 
            color={colors.text} 
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  pressed: {
    opacity: 0.6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

