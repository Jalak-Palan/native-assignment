import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  
  const colors = Colors[colorScheme];

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
      
      <Pressable 
        onPress={() => navigation.navigate('(drawer)/(tabs)/profile' as any)} 
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Ionicons 
          name="person-circle-outline" 
          size={26} 
          color={colors.text} 
        />
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
