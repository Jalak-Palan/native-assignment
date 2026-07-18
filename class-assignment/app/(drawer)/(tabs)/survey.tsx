import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function CreateSurveyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { currentSurvey, updateCurrentSurvey, resetCurrentSurvey } = useSurvey();
  const colors = Colors[colorScheme];

  const [errors, setErrors] = useState<{ siteName?: string; clientName?: string }>({});

  const validateForm = () => {
    const newErrors: { siteName?: string; clientName?: string } = {};
    if (!currentSurvey.siteName.trim()) {
      newErrors.siteName = 'Site Name is required';
    }
    if (!currentSurvey.clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      router.push('/survey-preview');
    } else {
      Alert.alert('Validation Failed', 'Please correct the highlighted fields before previewing.');
    }
  };

  const setPriority = (priority: 'Low' | 'Medium' | 'High') => {
    updateCurrentSurvey({ priority });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Create Survey" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Main Details Section */}
        <View style={[
          styles.card, 
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Survey Information</Text>

          {/* Site Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Site Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9',
                  borderColor: errors.siteName ? '#f44336' : (colorScheme === 'dark' ? '#2d3139' : '#e0e0e0')
                }
              ]}
              placeholder="e.g. Metro Station Construction"
              placeholderTextColor={colors.icon}
              value={currentSurvey.siteName}
              onChangeText={(text) => {
                updateCurrentSurvey({ siteName: text });
                if (errors.siteName) setErrors((prev) => ({ ...prev, siteName: undefined }));
              }}
            />
            {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
          </View>

          {/* Client Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Client Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9',
                  borderColor: errors.clientName ? '#f44336' : (colorScheme === 'dark' ? '#2d3139' : '#e0e0e0')
                }
              ]}
              placeholder="e.g. Infrastructure Dept"
              placeholderTextColor={colors.icon}
              value={currentSurvey.clientName}
              onChangeText={(text) => {
                updateCurrentSurvey({ clientName: text });
                if (errors.clientName) setErrors((prev) => ({ ...prev, clientName: undefined }));
              }}
            />
            {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.textInput, 
                styles.textArea,
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9',
                  borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0'
                }
              ]}
              placeholder="Provide a brief description of the site survey..."
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={4}
              value={currentSurvey.description}
              onChangeText={(text) => updateCurrentSurvey({ description: text })}
            />
          </View>

          {/* Priority Picker */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {(['Low', 'Medium', 'High'] as const).map((p) => {
                const selected = currentSurvey.priority === p;
                let activeColor = '#4caf50';
                if (p === 'Medium') activeColor = '#ff9800';
                if (p === 'High') activeColor = '#f44336';
                
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.priorityButton,
                      { 
                        backgroundColor: selected ? activeColor : (colorScheme === 'dark' ? '#151718' : '#f9f9f9'),
                        borderColor: selected ? activeColor : (colorScheme === 'dark' ? '#2d3139' : '#e0e0e0')
                      }
                    ]}
                  >
                    <Text style={[
                      styles.priorityText, 
                      { color: selected ? '#fff' : colors.text }
                    ]}>
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Date Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Survey Date</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9',
                  borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0'
                }
              ]}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={colors.icon}
              value={currentSurvey.date}
              onChangeText={(text) => updateCurrentSurvey({ date: text })}
            />
          </View>
        </View>

        {/* Integration Modules Checklist */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Attach Site Artifacts</Text>
        </View>

        <View style={styles.modulesGrid}>
          {/* Camera Artifact */}
          <Pressable 
            onPress={() => router.push('/camera')}
            style={[
              styles.moduleCard,
              { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
            ]}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="camera" size={20} color="#4caf50" />
              </View>
              <Ionicons 
                name={currentSurvey.photoUri ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={currentSurvey.photoUri ? "#4caf50" : colors.icon} 
              />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Camera Access</Text>
            {currentSurvey.photoUri ? (
              <View>
                <Image
                  source={{ uri: currentSurvey.photoUri }}
                  style={styles.imageSnippet}
                  resizeMode="cover"
                />
                <Text style={[styles.moduleStatus, { color: '#4caf50', marginTop: 4 }]}>✓ Photo Attached</Text>
              </View>
            ) : (
              <Text style={[styles.moduleStatus, { color: colors.icon }]}>No Photo</Text>
            )}
          </Pressable>

          {/* Location GPS Artifact */}
          <Pressable 
            onPress={() => router.push('/location')}
            style={[
              styles.moduleCard,
              { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
            ]}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="location" size={20} color="#ff9800" />
              </View>
              <Ionicons 
                name={currentSurvey.location ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={currentSurvey.location ? "#4caf50" : colors.icon} 
              />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Location GPS</Text>
            {currentSurvey.location ? (
              <View style={styles.moduleTextSnippet}>
                <Text style={[styles.moduleCoord, { color: colors.text }]} numberOfLines={1}>
                  {currentSurvey.location.latitude.toFixed(4)}, {currentSurvey.location.longitude.toFixed(4)}
                </Text>
                <Text style={[styles.moduleStatus, { color: '#4caf50' }]}>Attached</Text>
              </View>
            ) : (
              <Text style={[styles.moduleStatus, { color: colors.icon }]}>No GPS</Text>
            )}
          </Pressable>

          {/* Contact Artifact */}
          <Pressable 
            onPress={() => router.push('/contacts')}
            style={[
              styles.moduleCard,
              { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
            ]}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="person" size={18} color="#9c27b0" />
              </View>
              <Ionicons 
                name={currentSurvey.contact ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={currentSurvey.contact ? "#4caf50" : colors.icon} 
              />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Linked Contact</Text>
            {currentSurvey.contact ? (
              <View style={styles.moduleTextSnippet}>
                <Text style={[styles.moduleCoord, { color: colors.text }]} numberOfLines={1}>
                  {currentSurvey.contact.name}
                </Text>
                <Text style={[styles.moduleStatus, { color: '#4caf50' }]}>Linked</Text>
              </View>
            ) : (
              <Text style={[styles.moduleStatus, { color: colors.icon }]}>No Contact</Text>
            )}
          </Pressable>

          {/* Notes Clipboard Artifact */}
          <Pressable 
            onPress={() => router.push('/clipboard')}
            style={[
              styles.moduleCard,
              { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
            ]}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(0, 188, 212, 0.1)' }]}>
                <Ionicons name="clipboard" size={20} color="#00bcd4" />
              </View>
              <Ionicons 
                name={currentSurvey.notes ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={currentSurvey.notes ? "#4caf50" : colors.icon} 
              />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Clipboard & Notes</Text>
            {currentSurvey.notes ? (
              <View style={styles.moduleTextSnippet}>
                <Text style={[styles.moduleCoord, { color: colors.text }]} numberOfLines={1}>
                  {currentSurvey.notes}
                </Text>
                <Text style={[styles.moduleStatus, { color: '#4caf50' }]}>Attached</Text>
              </View>
            ) : (
              <Text style={[styles.moduleStatus, { color: colors.icon }]}>No Notes</Text>
            )}
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.formActions}>
          <Pressable 
            onPress={handlePreview}
            style={[styles.actionBtn, styles.primaryBtn]}
          >
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Preview Survey Details</Text>
          </Pressable>

          <Pressable 
            onPress={() => {
              Alert.alert(
                'Reset Survey Draft',
                'Are you sure you want to clear your current draft survey details?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: resetCurrentSurvey }
                ]
              );
            }}
            style={[styles.actionBtn, styles.secondaryBtn, { borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0' }]}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
            <Text style={styles.secondaryBtnText}>Reset Draft</Text>
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
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  moduleCard: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  imageSnippetContainer: {
    marginTop: 4,
  },
  imageSnippet: {
    width: '100%',
    height: 56,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  moduleTextSnippet: {
    justifyContent: 'center',
  },
  moduleCoord: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  moduleStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  formActions: {
    gap: 12,
  },
  actionBtn: {
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#0a7ea4',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '700',
  },
});
