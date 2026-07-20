import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const PROFILE_STORAGE_KEY = '@user_profile';
const PHOTO_STORAGE_KEY = '@user_photo';

interface UserProfile {
  name: string;
  roll: string;
  email: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jalak Palan',
  roll: 'SUK250054CE095',
  email: 'jalak.a.palan@gamil.com',
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { surveys, clearAllData, simulatedMode } = useSurvey();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#1c1e21' : '#ffffff';
  const cardBorder = isDark ? '#2d3139' : '#eef0f3';
  const inputBg = isDark ? '#2d3139' : '#f5f7fa';
  const placeholderColor = isDark ? '#666' : '#aaa';

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [draft, setDraft] = useState<UserProfile>(DEFAULT_PROFILE);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate statistics
  const totalSurveys = surveys.length;
  const highPriorityCount = surveys.filter((s) => s.priority === 'High').length;
  const medPriorityCount = surveys.filter((s) => s.priority === 'Medium').length;
  const lowPriorityCount = surveys.filter((s) => s.priority === 'Low').length;

  // Load persisted profile on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          setProfile(parsed);
          setDraft(parsed);
        }
        const storedPhoto = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);
        if (storedPhoto) setPhotoUri(storedPhoto);
      } catch (_) {
        // fallback to defaults
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleEdit = () => {
    setDraft({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!draft.name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (!draft.email.trim()) {
      Alert.alert('Validation Error', 'Email cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft));
      setProfile({ ...draft });
      setIsEditing(false);
    } catch (_) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to change your profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await AsyncStorage.setItem(PHOTO_STORAGE_KEY, uri);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Database',
      'This will permanently delete all submitted survey records. Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: async () => {
            await clearAllData();
            Alert.alert('Data Cleared', 'All survey records have been deleted.');
          } 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Student Profile" />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {/* Avatar — tap to pick photo */}
            <Pressable
              onPress={handlePickPhoto}
              style={({ pressed }) => [styles.avatarWrapper, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityLabel="Change profile photo"
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={[styles.avatarCircle, styles.avatarPhoto]}
                />
              ) : (
                <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#2d3139' : '#e3f2fd' }]}>
                  <Text style={styles.avatarInitials}>
                    {getInitials(profile.name) || '??'}
                  </Text>
                </View>
              )}
              {/* Camera badge */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#fff" />
              </View>
            </Pressable>

            {isEditing ? (
              /* ── Edit Mode ── */
              <View style={styles.editFieldsContainer}>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.icon }]}>Full Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: inputBg, color: colors.text, borderColor: cardBorder }]}
                    value={draft.name}
                    onChangeText={(t) => setDraft((p) => ({ ...p, name: t }))}
                    placeholder="Full Name"
                    placeholderTextColor={placeholderColor}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.icon }]}>Roll Number</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: inputBg, color: colors.text, borderColor: cardBorder }]}
                    value={draft.roll}
                    onChangeText={(t) => setDraft((p) => ({ ...p, roll: t }))}
                    placeholder="Roll Number"
                    placeholderTextColor={placeholderColor}
                    autoCapitalize="characters"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.icon }]}>Email Address</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: inputBg, color: colors.text, borderColor: cardBorder }]}
                    value={draft.email}
                    onChangeText={(t) => setDraft((p) => ({ ...p, email: t }))}
                    placeholder="Email Address"
                    placeholderTextColor={placeholderColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                  />
                </View>

                {/* Save / Cancel */}
                <View style={styles.editActionsRow}>
                  <Pressable
                    onPress={handleCancel}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      styles.cancelBtn,
                      { borderColor: cardBorder, opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Ionicons name="close" size={16} color={colors.text} />
                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    disabled={isSaving}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      styles.saveBtn,
                      { opacity: pressed || isSaving ? 0.7 : 1 },
                    ]}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                        <Text style={[styles.actionBtnText, { color: '#fff' }]}>Save</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              /* ── View Mode ── */
              <>
                <Text style={[styles.studentName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={[styles.studentRoll, { color: colors.icon }]}>Roll No: {profile.roll}</Text>
                <Text style={[styles.studentEmail, { color: colors.icon }]}>{profile.email}</Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.statusBadge, { backgroundColor: 'rgba(10, 126, 164, 0.1)' }]}>
                    <Text style={{ color: '#0a7ea4', fontSize: 12, fontWeight: '700' }}>Active Surveyor</Text>
                  </View>
                  {simulatedMode && (
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 179, 0, 0.15)' }]}>
                      <Text style={{ color: '#ffb300', fontSize: 12, fontWeight: '700' }}>Simulated Data</Text>
                    </View>
                  )}
                </View>

                {/* Edit Profile Button */}
                <Pressable
                  onPress={handleEdit}
                  style={({ pressed }) => [
                    styles.editProfileBtn,
                    { borderColor: '#0a7ea4', opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="pencil" size={14} color="#0a7ea4" />
                  <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Survey Statistics */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statItemCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statNum, { color: '#0a7ea4' }]}>{totalSurveys}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Total Audits</Text>
            </View>
            <View style={[styles.statItemCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statNum, { color: '#f44336' }]}>{highPriorityCount}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>High Priority</Text>
            </View>
            <View style={[styles.statItemCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statNum, { color: '#ff9800' }]}>{medPriorityCount}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Med Priority</Text>
            </View>
            <View style={[styles.statItemCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statNum, { color: '#4caf50' }]}>{lowPriorityCount}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Low Priority</Text>
            </View>
          </View>

          {/* Assignment Concepts */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment Concepts Used</Text>

          <View style={[styles.conceptsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {[
              'Expo APIs: Camera, Location, Contacts, Clipboard',
              'Expo Router Group Routing & Custom Stack Modals',
              'Dual Layouts: Bottom Tabs & Drawer Side Panel',
              'Global Context State Management & Local Storage',
            ].map((concept) => (
              <View style={styles.conceptRow} key={concept}>
                <Ionicons name="checkbox-outline" size={18} color="#4caf50" />
                <Text style={[styles.conceptText, { color: colors.text }]}>{concept}</Text>
              </View>
            ))}
          </View>

          {/* Danger Zone */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Management</Text>

          <View style={[
            styles.dangerCard,
            { backgroundColor: isDark ? '#241a1a' : '#ffebee', borderColor: isDark ? '#522929' : '#ffcdd2' }
          ]}>
            <Text style={[styles.dangerTitle, { color: isDark ? '#ff8a80' : '#c62828' }]}>Danger Zone</Text>
            <Text style={[styles.dangerDesc, { color: isDark ? '#ffcdd2' : '#e53935' }]}>
              Clearing database history cannot be undone. All saved surveys will be lost.
            </Text>
            <Pressable onPress={handleClearData} style={[styles.clearBtn, { backgroundColor: '#f44336' }]}>
              <Ionicons name="trash" size={18} color="#fff" />
              <Text style={styles.clearBtnText}>Reset Local Database</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a7ea4',
  },
  avatarPhoto: {
    backgroundColor: 'transparent',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 13,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 4,
  },
  editProfileBtnText: {
    color: '#0a7ea4',
    fontWeight: '700',
    fontSize: 13,
  },
  // Edit mode
  editFieldsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 4,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  editActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  saveBtn: {
    backgroundColor: '#0a7ea4',
  },
  actionBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  // Stats
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statItemCard: {
    width: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  statNum: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  conceptsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 24,
  },
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  conceptText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  dangerCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  dangerDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  clearBtn: {
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  clearBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
