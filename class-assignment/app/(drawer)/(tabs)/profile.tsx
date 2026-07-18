import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { surveys, clearAllData, simulatedMode } = useSurvey();
  const colors = Colors[colorScheme];

  // Calculate statistics
  const totalSurveys = surveys.length;
  const highPriorityCount = surveys.filter((s) => s.priority === 'High').length;
  const medPriorityCount = surveys.filter((s) => s.priority === 'Medium').length;
  const lowPriorityCount = surveys.filter((s) => s.priority === 'Low').length;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Student Profile" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={[
          styles.profileCard, 
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={[styles.avatarCircle, { backgroundColor: colorScheme === 'dark' ? '#2d3139' : '#e3f2fd' }]}>
            <Text style={styles.avatarInitials}>JP</Text>
          </View>
          
          <Text style={[styles.studentName, { color: colors.text }]}>Jalak Palan</Text>
          <Text style={[styles.studentRoll, { color: colors.icon }]}>Roll No: RN-2026-07</Text>
          <Text style={[styles.studentEmail, { color: colors.icon }]}>jalak.palan@student.edu</Text>

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
        </View>

        {/* Survey Statistics */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Statistics</Text>

        <View style={styles.statsGrid}>
          {/* Total surveys */}
          <View style={[
            styles.statItemCard, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <Text style={[styles.statNum, { color: '#0a7ea4' }]}>{totalSurveys}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Total Audits</Text>
          </View>

          {/* High Priority */}
          <View style={[
            styles.statItemCard, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <Text style={[styles.statNum, { color: '#f44336' }]}>{highPriorityCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>High Priority</Text>
          </View>

          {/* Medium Priority */}
          <View style={[
            styles.statItemCard, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <Text style={[styles.statNum, { color: '#ff9800' }]}>{medPriorityCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Med Priority</Text>
          </View>

          {/* Low Priority */}
          <View style={[
            styles.statItemCard, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <Text style={[styles.statNum, { color: '#4caf50' }]}>{lowPriorityCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Low Priority</Text>
          </View>
        </View>

        {/* Technical Details / Assignment Concepts */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment Concepts Used</Text>
        
        <View style={[
          styles.conceptsCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.conceptRow}>
            <Ionicons name="checkbox-outline" size={18} color="#4caf50" />
            <Text style={[styles.conceptText, { color: colors.text }]}>Expo APIs: Camera, Location, Contacts, Clipboard</Text>
          </View>
          <View style={styles.conceptRow}>
            <Ionicons name="checkbox-outline" size={18} color="#4caf50" />
            <Text style={[styles.conceptText, { color: colors.text }]}>Expo Router Group Routing & Custom Stack Modals</Text>
          </View>
          <View style={styles.conceptRow}>
            <Ionicons name="checkbox-outline" size={18} color="#4caf50" />
            <Text style={[styles.conceptText, { color: colors.text }]}>Dual Layouts: Bottom Tabs & Drawer Side Panel</Text>
          </View>
          <View style={styles.conceptRow}>
            <Ionicons name="checkbox-outline" size={18} color="#4caf50" />
            <Text style={[styles.conceptText, { color: colors.text }]}>Global Context State Management & Local Storage</Text>
          </View>
        </View>

        {/* Database Utilities */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Management</Text>
        
        <View style={[
          styles.dangerCard, 
          { backgroundColor: colorScheme === 'dark' ? '#241a1a' : '#ffebee', borderColor: colorScheme === 'dark' ? '#522929' : '#ffcdd2' }
        ]}>
          <Text style={[styles.dangerTitle, { color: colorScheme === 'dark' ? '#ff8a80' : '#c62828' }]}>Danger Zone</Text>
          <Text style={[styles.dangerDesc, { color: colorScheme === 'dark' ? '#ffcdd2' : '#e53935' }]}>
            Clearing database history cannot be undone. All saved surveys will be lost.
          </Text>
          
          <Pressable 
            onPress={handleClearData}
            style={[styles.clearBtn, { backgroundColor: '#f44336' }]}
          >
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.clearBtnText}>Reset Local Database</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#0a7ea4',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0a7ea4',
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
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
