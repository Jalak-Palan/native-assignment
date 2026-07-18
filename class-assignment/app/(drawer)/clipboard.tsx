import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ClipboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { currentSurvey, updateCurrentSurvey } = useSurvey();
  const colors = Colors[colorScheme];

  // Notes state
  const [notes, setNotes] = useState(currentSurvey.notes || '');

  const handleCopySurveyId = async () => {
    await Clipboard.setStringAsync(currentSurvey.id);
    Alert.alert('Copied!', `Survey ID "${currentSurvey.id}" copied to clipboard.`);
  };

  const handleCopyContact = async () => {
    if (currentSurvey.contact?.phoneNumber) {
      await Clipboard.setStringAsync(currentSurvey.contact.phoneNumber);
      Alert.alert('Copied!', `Phone number "${currentSurvey.contact.phoneNumber}" copied to clipboard.`);
    } else {
      Alert.alert('Copy Failed', 'No contact phone number is linked to the active survey.');
    }
  };

  const handleCopyLocation = async () => {
    if (currentSurvey.location) {
      const coordStr = `${currentSurvey.location.latitude.toFixed(6)}, ${currentSurvey.location.longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(coordStr);
      Alert.alert('Copied!', `Coordinates "${coordStr}" copied to clipboard.`);
    } else {
      Alert.alert('Copy Failed', 'No GPS location is linked to the active survey.');
    }
  };

  const handlePasteNotes = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setNotes((prev) => (prev ? `${prev}\n${text}` : text));
        Alert.alert('Pasted!', 'Text appended from system clipboard.');
      } else {
        Alert.alert('Paste Failed', 'System clipboard is empty or does not contain text.');
      }
    } catch (err) {
      console.error('Failed to paste from clipboard:', err);
      Alert.alert('Error', 'Failed to paste text.');
    }
  };

  const handleClearClipboard = async () => {
    await Clipboard.setStringAsync('');
    Alert.alert('Clipboard Cleared', 'System clipboard content cleared.');
  };

  const handleSaveNotes = () => {
    updateCurrentSurvey({ notes });
    Alert.alert('Notes Saved', 'Survey notes updated.', [
      { text: 'OK', onPress: () => router.push('/survey') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Clipboard Manager" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Copy Quick Data Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Copy Active Survey Details</Text>
        
        <View style={styles.copyContainer}>
          {/* Survey ID */}
          <View style={[
            styles.copyItem,
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <View style={styles.copyTextContent}>
              <Text style={[styles.copyLabel, { color: colors.icon }]}>SURVEY ID</Text>
              <Text style={[styles.copyValue, { color: colors.text }]} numberOfLines={1}>{currentSurvey.id}</Text>
            </View>
            <Pressable 
              onPress={handleCopySurveyId}
              style={({ pressed }) => [styles.copyBtn, { backgroundColor: '#0a7ea4' }, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="copy" size={16} color="#fff" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>

          {/* Linked Contact Number */}
          <View style={[
            styles.copyItem,
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <View style={styles.copyTextContent}>
              <Text style={[styles.copyLabel, { color: colors.icon }]}>CLIENT PHONE</Text>
              <Text style={[styles.copyValue, { color: colors.text, fontStyle: !currentSurvey.contact ? 'italic' : 'normal' }]} numberOfLines={1}>
                {currentSurvey.contact?.phoneNumber || 'No contact linked'}
              </Text>
            </View>
            <Pressable 
              onPress={handleCopyContact}
              disabled={!currentSurvey.contact?.phoneNumber}
              style={({ pressed }) => [
                styles.copyBtn, 
                { backgroundColor: '#9c27b0' }, 
                !currentSurvey.contact?.phoneNumber && styles.disabledBtn,
                pressed && { opacity: 0.8 }
              ]}
            >
              <Ionicons name="copy" size={16} color="#fff" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>

          {/* GPS Coordinates */}
          <View style={[
            styles.copyItem,
            { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
          ]}>
            <View style={styles.copyTextContent}>
              <Text style={[styles.copyLabel, { color: colors.icon }]}>GPS LOCATION</Text>
              <Text style={[styles.copyValue, { color: colors.text, fontStyle: !currentSurvey.location ? 'italic' : 'normal' }]} numberOfLines={1}>
                {currentSurvey.location 
                  ? `${currentSurvey.location.latitude.toFixed(6)}, ${currentSurvey.location.longitude.toFixed(6)}` 
                  : 'No coordinates linked'}
              </Text>
            </View>
            <Pressable 
              onPress={handleCopyLocation}
              disabled={!currentSurvey.location}
              style={({ pressed }) => [
                styles.copyBtn, 
                { backgroundColor: '#ff9800' }, 
                !currentSurvey.location && styles.disabledBtn,
                pressed && { opacity: 0.8 }
              ]}
            >
              <Ionicons name="copy" size={16} color="#fff" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        {/* Paste & Edit Notes Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Notes & Observations</Text>
        
        <View style={[
          styles.notesContainer,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <TextInput
            style={[
              styles.notesInput, 
              { 
                color: colors.text,
                backgroundColor: colorScheme === 'dark' ? '#151718' : '#f9f9f9',
                borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0'
              }
            ]}
            placeholder="Type notes here, or press 'Paste Notes' below to insert clipboard contents..."
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={10}
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.notesControlButtons}>
            <Pressable 
              onPress={handlePasteNotes}
              style={({ pressed }) => [styles.notesControlBtn, styles.btnPaste, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="clipboard" size={18} color="#fff" />
              <Text style={styles.notesControlBtnText}>Paste Notes</Text>
            </Pressable>

            <Pressable 
              onPress={() => setNotes('')}
              style={({ pressed }) => [styles.notesControlBtn, styles.btnClearField, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="close" size={18} color="#fff" />
              <Text style={styles.notesControlBtnText}>Clear Input</Text>
            </Pressable>

            <Pressable 
              onPress={handleClearClipboard}
              style={({ pressed }) => [styles.notesControlBtn, styles.btnClearClipboard, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.notesControlBtnText}>Clear Clipboard</Text>
            </Pressable>
          </View>
        </View>

        {/* Save/Attach Button */}
        <Pressable 
          onPress={handleSaveNotes}
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="checkmark-done" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>Save Notes to Survey</Text>
        </Pressable>
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
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    marginLeft: 4,
  },
  copyContainer: {
    gap: 10,
    marginBottom: 8,
  },
  copyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  copyTextContent: {
    flex: 1,
    marginRight: 12,
  },
  copyLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  copyValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  copyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  notesContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  notesInput: {
    height: 160,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  notesControlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  notesControlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 6,
    gap: 4,
  },
  btnPaste: {
    backgroundColor: '#0a7ea4',
  },
  btnClearField: {
    backgroundColor: '#757575',
  },
  btnClearClipboard: {
    backgroundColor: '#f44336',
  },
  notesControlBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#4caf50',
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
