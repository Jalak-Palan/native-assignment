import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SurveyPreviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { currentSurvey, saveCurrentSurvey } = useSurvey();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const handleEdit = () => {
    router.back();
  };

  const handleSubmit = () => {
    const success = saveCurrentSurvey();
    if (success) {
      Alert.alert(
        'Survey Submitted!',
        'Your field survey has been submitted and saved in history successfully.',
        [
          { 
            text: 'View History', 
            onPress: () => {
              router.dismissAll();
              router.push('/history');
            } 
          },
          { 
            text: 'Go to Dashboard', 
            onPress: () => {
              router.dismissAll();
              router.push('/');
            } 
          }
        ]
      );
    }
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Modal Custom Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }]}>
        <Pressable onPress={handleEdit} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Survey Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Alert Card */}
        <View style={styles.reviewBanner}>
          <Ionicons name="eye" size={22} color="#0a7ea4" />
          <Text style={[styles.reviewBannerText, { color: colors.text }]}>
            Review details before final submission.
          </Text>
        </View>

        {/* Site Information */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={20} color="#0a7ea4" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Site & Client Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>SITE NAME</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{currentSurvey.siteName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>CLIENT NAME</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{currentSurvey.clientName}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>PRIORITY</Text>
              <View style={[styles.priorityPill, { backgroundColor: getPriorityColor(currentSurvey.priority) }]}>
                <Text style={styles.priorityText}>{currentSurvey.priority}</Text>
              </View>
            </View>

            <View style={styles.metaCol}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>DATE</Text>
              <Text style={[styles.detailVal, { color: colors.text }]}>{currentSurvey.date}</Text>
            </View>
          </View>

          {currentSurvey.description ? (
            <View style={[styles.descContainer, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9' }]}>
              <Text style={[styles.descText, { color: colors.text }]}>{currentSurvey.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Attached Photo */}
        <View style={[
          styles.sectionCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera" size={20} color="#4caf50" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Captured Photo</Text>
          </View>

          {currentSurvey.photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: currentSurvey.photoUri }} style={styles.sitePhoto} />
              <View style={styles.photoTimeOverlay}>
                <Ionicons name="time" size={14} color="#fff" />
                <Text style={styles.photoTimeText}>{currentSurvey.photoCaptureTime}</Text>
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

          {currentSurvey.location ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <Text style={[styles.locationLabel, { color: colors.icon }]}>LATITUDE</Text>
                <Text style={[styles.locationValue, { color: colors.text }]}>{currentSurvey.location.latitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={[styles.locationLabel, { color: colors.icon }]}>LONGITUDE</Text>
                <Text style={[styles.locationValue, { color: colors.text }]}>{currentSurvey.location.longitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.locationAccuracyRow}>
                <Ionicons name="analytics" size={14} color="#0a7ea4" />
                <Text style={[styles.accuracyLabel, { color: colors.text }]}>
                  Accuracy Margin: <Text style={styles.boldText}>+/- {currentSurvey.location.accuracy.toFixed(1)}m</Text>
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

          {currentSurvey.contact ? (
            <View style={styles.contactContainer}>
              <Text style={[styles.contactName, { color: colors.text }]}>{currentSurvey.contact.name}</Text>
              {currentSurvey.contact.phoneNumber ? (
                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={14} color="#9c27b0" />
                  <Text style={[styles.contactPhone, { color: colors.text }]}>{currentSurvey.contact.phoneNumber}</Text>
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

          {currentSurvey.notes ? (
            <View style={[styles.notesBox, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9' }]}>
              <Text style={[styles.notesText, { color: colors.text }]}>{currentSurvey.notes}</Text>
            </View>
          ) : (
            <View style={styles.emptyModuleContent}>
              <Ionicons name="create-outline" size={32} color={colors.icon} />
              <Text style={[styles.emptyModuleText, { color: colors.icon }]}>No additional notes entered</Text>
            </View>
          )}
        </View>

        {/* Preview Footer Actions */}
        <View style={styles.footerActions}>
          <Pressable 
            onPress={handleSubmit} 
            style={[styles.actionBtn, styles.btnSubmit]}
          >
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Submit Field Survey</Text>
          </Pressable>

          <Pressable 
            onPress={handleEdit} 
            style={[styles.actionBtn, styles.btnEdit, { borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0' }]}
          >
            <Ionicons name="create-outline" size={20} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Edit Survey Draft</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.08)',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  reviewBannerText: {
    fontSize: 13,
    fontWeight: '500',
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
  footerActions: {
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnSubmit: {
    backgroundColor: '#0a7ea4',
  },
  btnEdit: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
