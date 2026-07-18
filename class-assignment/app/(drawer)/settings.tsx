import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { simulatedMode, setSimulatedMode, clearAllData } = useSurvey();
  const colors = Colors[colorScheme];

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all submitted survey records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Success', 'Database reset successfully.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Settings" />

      <View style={styles.content}>
        {/* Development Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Developer Tools</Text>

        <View style={[
          styles.card,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          {/* Simulated Mode Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(255, 179, 0, 0.15)' }]}>
                <Ionicons name="construct" size={20} color="#ffb300" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Simulated Data Mode</Text>
                <Text style={[styles.settingDesc, { color: colors.icon }]}>
                  Bypass hardware permissions & mock Camera, GPS, and Contacts.
                </Text>
              </View>
            </View>
            <Switch
              value={simulatedMode}
              onValueChange={setSimulatedMode}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor={simulatedMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* Explanation Info */}
          <View style={[styles.explanationBox, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f5f7fa' }]}>
            <Ionicons name="information-circle" size={18} color="#0a7ea4" style={{ marginTop: 2 }} />
            <Text style={[styles.explanationText, { color: colors.text }]}>
              When enabled, the app uses preloaded coordinates, mock camera viewports, and simulated phone contacts. This allows 100% of the assignment requirements to be fully tested in a browser or on standard simulators.
            </Text>
          </View>
        </View>

        {/* Database Utilities Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Database Utilities</Text>

        <View style={[
          styles.card,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <Pressable 
            onPress={handleReset}
            style={({ pressed }) => [styles.settingRowPressable, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                <Ionicons name="trash-bin" size={20} color="#f44336" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={[styles.settingLabel, { color: '#f44336' }]}>Wipe Survey Database</Text>
                <Text style={[styles.settingDesc, { color: colors.icon }]}>
                  Erase all submitted survey items from local storage.
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.icon} />
          </Pressable>
        </View>

        {/* Student Verification Footer Info */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.icon }]}>Smart Field Survey & Inspection App</Text>
          <Text style={[styles.footerText, { color: colors.icon }]}>Student Name: Jalak Palan</Text>
          <Text style={[styles.footerText, { color: colors.icon }]}>Roll Number: RN-2026-07</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTexts: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
  explanationBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
