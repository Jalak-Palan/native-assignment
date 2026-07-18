import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { currentSurvey, updateCurrentSurvey } = useSurvey();
  const colors = Colors[colorScheme];

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [capturedUri, setCapturedUri] = useState<string | null>(
    currentSurvey.photoUri ?? null
  );
  const [capturedTime, setCapturedTime] = useState<string>(
    currentSurvey.photoCaptureTime ?? ''
  );
  const [isTaking, setIsTaking] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');

  /* ─── Handlers ─────────────────────────────────────────── */

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setIsTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setCapturedTime(new Date().toLocaleString());
      }
    } catch (err) {
      console.error('Camera capture error:', err);
      Alert.alert('Capture Failed', 'Could not take a photo. Please try again.');
    } finally {
      setIsTaking(false);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    setCapturedTime('');
  };

  const handleAttach = () => {
    if (!capturedUri) return;
    updateCurrentSurvey({ photoUri: capturedUri, photoCaptureTime: capturedTime });
    Alert.alert(
      '✓ Photo Attached',
      'The photo has been saved to your survey.',
      [
        { text: 'Go to Survey', onPress: () => router.push('/survey') },
        { text: 'Stay', style: 'cancel' },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setCapturedUri(null);
          setCapturedTime('');
          updateCurrentSurvey({ photoUri: undefined, photoCaptureTime: undefined });
        },
      },
    ]);
  };

  /* ─── Permission States ─────────────────────────────────── */

  if (!permission) {
    // Still loading permission status
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Camera" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Initialising camera…
          </Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Camera" />
        <View style={styles.center}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera" size={56} color="#4caf50" />
          </View>
          <Text style={[styles.permTitle, { color: colors.text }]}>
            Camera Access Needed
          </Text>
          <Text style={[styles.permDesc, { color: colors.icon }]}>
            Allow this app to use your camera so you can take real site photos and attach them to your survey.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.grantBtn, pressed && { opacity: 0.85 }]}
            onPress={requestPermission}
          >
            <Ionicons name="camera" size={18} color="#fff" />
            <Text style={styles.grantBtnText}>Allow Camera Access</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ─── Photo Preview ─────────────────────────────────────── */

  if (capturedUri) {
    return (
      <View style={styles.fullscreen}>
        <StatusBar hidden />
        <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="cover" />

        {/* Timestamp badge */}
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.timeText}>{capturedTime}</Text>
        </View>

        {/* "Photo Captured" label */}
        <View style={styles.capturedLabel}>
          <Ionicons name="checkmark-circle" size={18} color="#4caf50" />
          <Text style={styles.capturedLabelText}>Photo Captured</Text>
        </View>

        {/* Action bar */}
        <View style={styles.previewBar}>
          <Pressable
            style={[styles.previewBtn, { backgroundColor: '#555' }]}
            onPress={handleRetake}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.previewBtnText}>Retake</Text>
          </Pressable>

          <Pressable
            style={[styles.previewBtn, { backgroundColor: '#4caf50' }]}
            onPress={handleAttach}
          >
            <Ionicons name="attach" size={20} color="#fff" />
            <Text style={styles.previewBtnText}>Attach to Survey</Text>
          </Pressable>

          <Pressable
            style={[styles.previewBtn, { backgroundColor: '#f44336' }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.previewBtnText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ─── Live Camera Viewfinder ────────────────────────────── */

  return (
    <View style={styles.fullscreen}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      >
        {/* Top controls */}
        <View style={styles.topBar}>
          {/* Back */}
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>

          {/* Flash toggle */}
          <Pressable
            style={styles.iconBtn}
            onPress={() =>
              setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'))
            }
          >
            <Ionicons
              name={
                flash === 'on'
                  ? 'flash'
                  : flash === 'auto'
                  ? 'flash-outline'
                  : 'flash-off'
              }
              size={24}
              color={flash === 'off' ? 'rgba(255,255,255,0.6)' : '#ffb300'}
            />
          </Pressable>
        </View>

        {/* Corner guides */}
        <View style={styles.guideFrame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* Bottom shutter row */}
        <View style={styles.bottomBar}>
          {/* Flip camera */}
          <Pressable
            style={styles.sideBtn}
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          >
            <Ionicons name="camera-reverse" size={28} color="#fff" />
            <Text style={styles.sideBtnLabel}>Flip</Text>
          </Pressable>

          {/* Shutter button */}
          <Pressable
            style={styles.shutter}
            onPress={handleCapture}
            disabled={isTaking}
          >
            {isTaking ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <View style={styles.shutterInner} />
            )}
          </Pressable>

          {/* Thumbnail of current attached photo (if any) */}
          <Pressable style={styles.sideBtn} onPress={() => router.push('/survey')}>
            {currentSurvey.photoUri && currentSurvey.photoUri !== capturedUri ? (
              <Image
                source={{ uri: currentSurvey.photoUri }}
                style={styles.thumbPreview}
              />
            ) : (
              <View style={styles.thumbEmpty}>
                <Ionicons name="images-outline" size={22} color="rgba(255,255,255,0.5)" />
              </View>
            )}
            <Text style={styles.sideBtnLabel}>Survey</Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullscreen: { flex: 1, backgroundColor: '#000' },

  /* Loading / permission */
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 14, fontSize: 15, fontWeight: '500' },
  permissionIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(76,175,80,0.12)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  permTitle: { fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  permDesc: {
    fontSize: 14, lineHeight: 22, textAlign: 'center',
    marginBottom: 28, paddingHorizontal: 8,
  },
  grantBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#4caf50',
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 12,
  },
  grantBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  /* Preview */
  previewImage: { ...StyleSheet.absoluteFillObject },
  timeBadge: {
    position: 'absolute', top: 52, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  timeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  capturedLabel: {
    position: 'absolute', top: 52,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  capturedLabelText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  previewBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    padding: 16, paddingBottom: 36,
    backgroundColor: 'rgba(0,0,0,0.82)',
  },
  previewBtn: {
    flex: 1, height: 50, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  previewBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Viewfinder top bar */
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },

  /* Corner guide lines */
  guideFrame: {
    flex: 1,
    margin: 40,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24, height: 24,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },

  /* Bottom shutter row */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 32, paddingBottom: 40, paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: { alignItems: 'center', gap: 4, minWidth: 56 },
  sideBtnLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  shutter: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 4, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  shutterInner: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: '#fff',
  },
  thumbPreview: {
    width: 44, height: 44, borderRadius: 8,
    borderWidth: 2, borderColor: '#4caf50',
  },
  thumbEmpty: {
    width: 44, height: 44, borderRadius: 8,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
});
