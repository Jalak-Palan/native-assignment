import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const PROFILE_STORAGE_KEY = '@user_profile';

interface UserProfile { name: string; roll: string; email: string; }

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { surveys, currentSurvey } = useSurvey();
  const colors = Colors[colorScheme];

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jalak Palan',
    roll: 'RN-2026-07',
    email: 'jalak.palan@student.edu',
  });

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_STORAGE_KEY).then((stored) => {
      if (stored) setProfile(JSON.parse(stored));
    });
  }, []);

  // Calculate Today's Survey Count
  const getTodaySurveyCount = () => {
    const todayStr = new Date().toLocaleDateString();
    return surveys.filter((s) => {
      // Handles both locale strings and standard date matches
      return s.date === todayStr || (s.submittedAt && s.submittedAt.includes(todayStr));
    }).length;
  };

  const todayCount = getTodaySurveyCount();
  const recentSurveys = surveys.slice(0, 3);

  const quickActions = [
    {
      title: 'New Survey',
      icon: 'create',
      color: '#0a7ea4',
      bg: 'rgba(10, 126, 164, 0.1)',
      route: '/survey',
      description: 'Fill survey details',
    },
    {
      title: 'Camera Access',
      icon: 'camera',
      color: '#4caf50',
      bg: 'rgba(76, 175, 80, 0.1)',
      route: '/camera',
      description: 'Capture site photos',
    },
    {
      title: 'Location GPS',
      icon: 'location',
      color: '#ff9800',
      bg: 'rgba(255, 152, 0, 0.1)',
      route: '/location',
      description: 'Pinpoint locations',
    },
    {
      title: 'Contacts Sync',
      icon: 'people',
      color: '#9c27b0',
      bg: 'rgba(156, 39, 176, 0.1)',
      route: '/contacts',
      description: 'Link client contacts',
    },
    {
      title: 'Clipboard Manager',
      icon: 'clipboard',
      color: '#00bcd4',
      bg: 'rgba(0, 188, 212, 0.1)',
      route: '/clipboard',
      description: 'Manage survey copy/notes',
    },
    {
      title: 'Survey History',
      icon: 'list-circle',
      color: '#e91e63',
      bg: 'rgba(233, 30, 99, 0.1)',
      route: '/history',
      description: 'View all past records',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      default:
        return '#4caf50';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Smart Field Survey" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome Back,</Text>
          <Text style={styles.appName}>Field Surveyor</Text>
        </View>

        {/* Info Grid: Student details + Today's Count */}
        <View style={styles.infoGrid}>
          {/* Student Details Card */}
          <View style={[
            styles.infoCard, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="school" size={20} color="#0a7ea4" />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>Student Details</Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={[styles.studentName, { color: colors.text }]}>{profile.name}</Text>
              <Text style={[styles.studentRoll, { color: colors.icon }]}>Roll No: {profile.roll}</Text>
              <Text style={[styles.studentClass, { color: colors.icon }]}>Mini Project Assignment</Text>
            </View>
          </View>

          {/* Today's Survey Count */}
          <View style={[
            styles.infoCard, 
            styles.countCard,
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="calendar-today" size={20} color="#e91e63" />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>Today&apos;s Work</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countNumber}>{todayCount}</Text>
              <Text style={[styles.countLabel, { color: colors.icon }]}>Surveys Completed</Text>
            </View>
          </View>
        </View>

        {/* Survey Draft Progress Indicator */}
        {(currentSurvey.siteName || currentSurvey.photoUri || currentSurvey.location) && (
          <Pressable 
            onPress={() => router.push('/survey')}
            style={[
              styles.draftCard, 
              { backgroundColor: colorScheme === 'dark' ? '#152431' : '#e3f2fd', borderColor: '#90caf9' }
            ]}
          >
            <Ionicons name="time" size={22} color="#1e88e5" style={styles.draftIcon} />
            <View style={styles.draftTextContainer}>
              <Text style={[styles.draftTitle, { color: colorScheme === 'dark' ? '#90caf9' : '#0d47a1' }]}>Draft Survey In Progress</Text>
              <Text style={[styles.draftDesc, { color: colorScheme === 'dark' ? '#cfd8dc' : '#1565c0' }]}>
                {currentSurvey.siteName || 'Unnamed Site'} - Tap to continue editing.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#1e88e5" />
          </Pressable>
        )}

        {/* Quick Action Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickGrid}>
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(action.route as any)}
              style={({ pressed }) => [
                styles.actionCard,
                { 
                  backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', 
                  borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3',
                  opacity: pressed ? 0.8 : 1 
                }
              ]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
              <Text style={[styles.actionDesc, { color: colors.icon }]}>{action.description}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Surveys</Text>
          <Pressable onPress={() => router.push('/history')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </Pressable>
        </View>

        {recentSurveys.length === 0 ? (
          <View style={[
            styles.emptyRecent, 
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#f9f9f9', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <Ionicons name="folder-open-outline" size={40} color={colors.icon} />
            <Text style={[styles.emptyRecentText, { color: colors.icon }]}>No surveys completed yet.</Text>
            <Pressable 
              onPress={() => router.push('/survey')}
              style={styles.emptyRecentBtn}
            >
              <Text style={styles.emptyRecentBtnText}>Start First Survey</Text>
            </Pressable>
          </View>
        ) : (
          recentSurveys.map((survey) => (
            <Pressable
              key={survey.id}
              onPress={() => router.push({ pathname: '/survey-detail', params: { id: survey.id } } as any)}
              style={({ pressed }) => [
                styles.surveyCard,
                { 
                  backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', 
                  borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3',
                  opacity: pressed ? 0.9 : 1
                }
              ]}
            >
              <View style={styles.surveyCardMain}>
                <View style={styles.surveyHeaderRow}>
                  <Text style={[styles.surveySite, { color: colors.text }]} numberOfLines={1}>
                    {survey.siteName}
                  </Text>
                  <View style={[styles.priorityPill, { backgroundColor: getPriorityColor(survey.priority) }]}>
                    <Text style={styles.priorityText}>{survey.priority}</Text>
                  </View>
                </View>
                <Text style={[styles.surveyClient, { color: colors.icon }]}>Client: {survey.clientName}</Text>
                
                <View style={styles.surveyFooterRow}>
                  <View style={styles.footerIconText}>
                    <Ionicons name="calendar-outline" size={14} color={colors.icon} />
                    <Text style={[styles.footerTextVal, { color: colors.icon }]}>{survey.date}</Text>
                  </View>
                  {survey.photoUri && (
                    <View style={[styles.footerBadge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                      <Ionicons name="camera" size={12} color="#4caf50" />
                      <Text style={[styles.footerBadgeText, { color: '#4caf50' }]}>Photo</Text>
                    </View>
                  )}
                  {survey.location && (
                    <View style={[styles.footerBadge, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                      <Ionicons name="location" size={12} color="#ff9800" />
                      <Text style={[styles.footerBadgeText, { color: '#ff9800' }]}>GPS</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </Pressable>
          ))
        )}
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
    paddingBottom: 32,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  studentDetails: {
    gap: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
  },
  studentRoll: {
    fontSize: 12,
  },
  studentClass: {
    fontSize: 11,
  },
  countContainer: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e91e63',
  },
  countLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  draftIcon: {
    marginRight: 12,
  },
  draftTextContainer: {
    flex: 1,
  },
  draftTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  draftDesc: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllButton: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%', // A bit under half to fit gaps
    flexGrow: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
  emptyRecent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyRecentText: {
    fontSize: 14,
    marginVertical: 10,
  },
  emptyRecentBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  emptyRecentBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  surveyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  surveyCardMain: {
    flex: 1,
  },
  surveyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  surveySite: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: '75%',
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  surveyClient: {
    fontSize: 13,
    marginBottom: 8,
  },
  surveyFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerTextVal: {
    fontSize: 12,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
