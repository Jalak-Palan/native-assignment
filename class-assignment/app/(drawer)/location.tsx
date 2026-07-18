import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function LocationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { currentSurvey, updateCurrentSurvey, simulatedMode } = useSurvey();
  const colors = Colors[colorScheme];

  // Local state
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    currentSurvey.location ? (currentSurvey.location as any) : null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (simulatedMode) {
      // Simulate GPS fetch (around New Delhi with slight random offsets)
      setTimeout(() => {
        const DelhiLat = 28.6139;
        const DelhiLon = 77.2090;
        const offsetLat = (Math.random() - 0.5) * 0.005;
        const offsetLon = (Math.random() - 0.5) * 0.005;
        
        setLocation({
          latitude: DelhiLat + offsetLat,
          longitude: DelhiLon + offsetLon,
          altitude: 215,
          accuracy: Math.floor(Math.random() * 5) + 3, // 3 to 8 meters accuracy
          altitudeAccuracy: 5,
          heading: 0,
          speed: 0,
        });
        setIsLoading(false);
      }, 1000);
    } else {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc.coords);
      } catch (error) {
        console.error('Failed to get location:', error);
        setErrorMsg('Error occurred while fetching location. Enable Simulated Data Mode in Settings.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [simulatedMode]);

  useEffect(() => {
    // Auto-fetch location on mount if there's no attached location
    if (!currentSurvey.location) {
      fetchLocation();
    }
  }, [currentSurvey.location, fetchLocation]);

  const handleCopyLocation = async () => {
    if (location) {
      const copyStr = `Lat: ${location.latitude.toFixed(6)}, Lon: ${location.longitude.toFixed(6)}, Acc: +/-${location.accuracy?.toFixed(1) || '0'}m`;
      await Clipboard.setStringAsync(copyStr);
      
      // Toast alert done via popup Alert
      
      Alert.alert('Copied!', 'GPS coordinates copied to clipboard successfully.');
    }
  };

  const handleAttachLocation = () => {
    if (location) {
      updateCurrentSurvey({
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy || 0,
        },
      });
      Alert.alert('Location Attached', 'GPS Coordinates have been linked to your active survey.', [
        { text: 'OK', onPress: () => router.push('/survey') }
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Location Tracker" />

      <View style={styles.content}>
        {/* GPS Sensor Visualizer */}
        <View style={[
          styles.sensorCard, 
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          <View style={[styles.radarCircle, { backgroundColor: colorScheme === 'dark' ? '#1d2a31' : '#e1f5fe' }]}>
            <Ionicons 
              name="location" 
              size={56} 
              color={location ? "#ff9800" : colors.icon} 
            />
            {isLoading && (
              <ActivityIndicator 
                size="large" 
                color="#0a7ea4" 
                style={styles.radarLoader} 
              />
            )}
          </View>

          <Text style={[styles.sensorStatus, { color: colors.text }]}>
            {isLoading 
              ? 'Pinging GPS Satellites...' 
              : (location ? 'Location Locked' : 'No GPS Fix')}
          </Text>

          {simulatedMode && (
            <View style={styles.simBadge}>
              <Text style={styles.simText}>GPS SIMULATION ACTIVE</Text>
            </View>
          )}
        </View>

        {/* Location Details Panel */}
        <View style={[
          styles.detailsCard,
          { backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
        ]}>
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={24} color="#f44336" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : location ? (
            <View style={styles.coordsGrid}>
              <View style={[styles.coordItem, { borderRightWidth: 1, borderRightColor: colorScheme === 'dark' ? '#2d3139' : '#f5f5f5' }]}>
                <Text style={[styles.coordLabel, { color: colors.icon }]}>LATITUDE</Text>
                <Text style={[styles.coordVal, { color: colors.text }]}>
                  {location.latitude.toFixed(6)}°
                </Text>
              </View>

              <View style={styles.coordItem}>
                <Text style={[styles.coordLabel, { color: colors.icon }]}>LONGITUDE</Text>
                <Text style={[styles.coordVal, { color: colors.text }]}>
                  {location.longitude.toFixed(6)}°
                </Text>
              </View>

              <View style={[styles.accuracyRow, { borderTopWidth: 1, borderTopColor: colorScheme === 'dark' ? '#2d3139' : '#f5f5f5' }]}>
                <Ionicons name="analytics" size={16} color="#0a7ea4" />
                <Text style={[styles.accuracyText, { color: colors.text }]}>
                  Accuracy Margin: <Text style={styles.boldText}>+/- {location.accuracy?.toFixed(1) || '3.2'} meters</Text>
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noCoordsContainer}>
              <Text style={[styles.noCoordsText, { color: colors.icon }]}>
                Tap refresh below to lock your coordinates.
              </Text>
            </View>
          )}
        </View>

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          <Pressable 
            onPress={fetchLocation} 
            disabled={isLoading}
            style={({ pressed }) => [
              styles.actionBtn, 
              styles.btnRefresh,
              pressed && { opacity: 0.8 }
            ]}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.btnText}>Refresh GPS</Text>
          </Pressable>

          <Pressable 
            onPress={handleCopyLocation} 
            disabled={!location || isLoading}
            style={({ pressed }) => [
              styles.actionBtn, 
              styles.btnCopy,
              (!location || isLoading) && styles.disabledBtn,
              pressed && { opacity: 0.8 }
            ]}
          >
            <Ionicons name="copy-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Copy GPS</Text>
          </Pressable>
        </View>

        {/* Attach Button */}
        {location && (
          <Pressable 
            onPress={handleAttachLocation}
            style={({ pressed }) => [
              styles.attachBtn,
              pressed && { opacity: 0.9 }
            ]}
          >
            <Ionicons name="checkmark-done" size={22} color="#fff" />
            <Text style={styles.attachBtnText}>Attach GPS to Survey</Text>
          </Pressable>
        )}
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
    flex: 1,
  },
  sensorCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  radarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  radarLoader: {
    position: 'absolute',
    transform: [{ scale: 1.5 }],
  },
  sensorStatus: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  simBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  simText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  detailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  coordItem: {
    width: '50%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  coordVal: {
    fontSize: 20,
    fontWeight: '800',
  },
  accuracyRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
    marginTop: 8,
  },
  accuracyText: {
    fontSize: 13,
  },
  boldText: {
    fontWeight: '700',
  },
  noCoordsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noCoordsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnRefresh: {
    backgroundColor: '#0a7ea4',
  },
  btnCopy: {
    backgroundColor: '#ff9800',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  attachBtn: {
    backgroundColor: '#4caf50',
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto', // Pushes to the bottom if space allows
  },
  attachBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
