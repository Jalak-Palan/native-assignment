import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SurveyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const { surveys, deleteSurvey } = useSurvey();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const survey = surveys.find((s) => s.id === id);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    if (!survey) return;

    Alert.alert(
      'Delete Survey Record',
      `Are you sure you want to delete the survey record for "${survey.siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSurvey(survey.id);
            Alert.alert('Record Deleted', 'Survey has been successfully removed from history.', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          },
        },
      ]
    );
  };

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

  if (!survey) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Record Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Survey Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.icon }]}>
            The survey record you are trying to view does not exist or has been deleted.
          </Text>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Modal Custom Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }]}>
        <Pressable onPress={handleBack} style={styles.closeBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Survey Details</Text>
        <Pressable onPress={handleDelete} style={styles.deleteHeaderBtn}>
          <Ionicons name="trash-outline" size={22} color="#f44336" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Site Details Card */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={20} color="#0a7ea4" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Site & Client Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>SURVEY ID</Text>
            <Text style={[styles.detailVal, { color: colors.text, userSelect: 'all' as any }]}>{survey.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>SITE NAME</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{survey.siteName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>CLIENT NAME</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{survey.clientName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>ADDRESS</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{survey.address}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>PRIORITY</Text>
              <View style={[styles.priorityPill, { backgroundColor: getPriorityColor(survey.priority) }]}>
                <Text style={styles.priorityText}>{survey.priority}</Text>
              </View>
            </View>

            <View style={styles.metaCol}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>DATE</Text>
              <Text style={[styles.detailVal, { color: colors.text }]}>{survey.date}</Text>
            </View>
          </View>

          {survey.description ? (
            <View style={[styles.descContainer, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9' }]}>
              <Text style={[styles.descText, { color: colors.text }]}>{survey.description}</Text>
            </View>
          ) : null}

          {survey.submittedAt ? (
            <View style={styles.submittedAtRow}>
              <Ionicons name="time-outline" size={12} color={colors.icon} />
              <Text style={[styles.submittedAtText, { color: colors.icon }]}>Submitted: {survey.submittedAt}</Text>
            </View>
          ) : null}
        </View>

        {/* Captured Photo */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera" size={20} color="#4caf50" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Captured Photo</Text>
          </View>

          {survey.photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: survey.photoUri }} style={styles.sitePhoto} />
              <View style={styles.photoTimeOverlay}>
                <Ionicons name="time" size={14} color="#fff" />
                <Text style={styles.photoTimeText}>{survey.photoCaptureTime}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyModuleContent}>
              <Ionicons name="image-outline" size={32} color={colors.icon} />
              <Text style={[styles.emptyModuleText, { color: colors.icon }]}>No site photo captured</Text>
            </View>
          )}
        </View>

        {/* GPS Location */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#ff9800" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>GPS Coordinates</Text>
          </View>

          {survey.location ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <Text style={[styles.locationLabel, { color: colors.icon }]}>LATITUDE</Text>
                <Text style={[styles.locationValue, { color: colors.text }]}>{survey.location.latitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={[styles.locationLabel, { color: colors.icon }]}>LONGITUDE</Text>
                <Text style={[styles.locationValue, { color: colors.text }]}>{survey.location.longitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.locationAccuracyRow}>
                <Ionicons name="analytics" size={14} color="#0a7ea4" />
                <Text style={[styles.accuracyLabel, { color: colors.text }]}>
                  Accuracy Margin: <Text style={styles.boldText}>+/- {survey.location.accuracy.toFixed(1)}m</Text>
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyModuleContent}>
              <Ionicons name="pin-outline" size={32} color={colors.icon} />
              <Text style={[styles.emptyModuleText, { color: colors.icon }]}>No GPS coordinates linked</Text>
            </View>
          )}
        </View>

        {/* Client Contact */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#9c27b0" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Client Contact</Text>
          </View>

          {survey.contact ? (
            <View style={styles.contactContainer}>
              <Text style={[styles.contactName, { color: colors.text }]}>{survey.contact.name}</Text>
              {survey.contact.phoneNumber ? (
                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={14} color="#9c27b0" />
                  <Text style={[styles.contactPhone, { color: colors.text }]}>{survey.contact.phoneNumber}</Text>
                </View>
              ) : (
                <Text style={[styles.contactPhone, { color: colors.icon, fontStyle: 'italic' }]}>No Phone Number Available</Text>
              )}
            </View>
          ) : (
            <View style={styles.emptyModuleContent}>
              <Ionicons name="people-outline" size={32} color={colors.icon} />
              <Text style={[styles.emptyModuleText, { color: colors.icon }]}>No contact linked</Text>
            </View>
          )}
        </View>

        {/* Clipboard Notes */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard" size={20} color="#00bcd4" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes & Observations</Text>
          </View>

          {survey.notes ? (
            <View style={[styles.notesBox, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9' }]}>
              <Text style={[styles.notesText, { color: colors.text }]}>{survey.notes}</Text>
            </View>
          ) : (
            <View style={styles.emptyModuleContent}>
              <Ionicons name="create-outline" size={32} color={colors.icon} />
              <Text style={[styles.emptyModuleText, { color: colors.icon }]}>No additional notes entered</Text>
            </View>
          )}
        </View>

        {/* Delete Record Button */}
        <Pressable 
          onPress={handleDelete} 
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete Survey Record</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteHeaderBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailVal: {
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 40,
  },
  metaCol: {
    flex: 1,
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  descContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 20,
  },
  submittedAtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  submittedAtText: {
    fontSize: 11,
    fontWeight: '500',
  },
  photoContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  sitePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoTimeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  photoTimeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  emptyModuleContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyModuleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  locationItem: {
    flex: 1,
    minWidth: 100,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  locationAccuracyRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  accuracyLabel: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: '700',
  },
  contactContainer: {
    gap: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesBox: {
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
