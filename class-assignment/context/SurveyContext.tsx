import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SurveyData {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  photoUri?: string;
  photoCaptureTime?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  contact?: {
    name: string;
    phoneNumber?: string;
  };
  notes?: string;
  submittedAt?: string;
}

interface SurveyContextProps {
  currentSurvey: SurveyData;
  surveys: SurveyData[];
  simulatedMode: boolean;
  updateCurrentSurvey: (fields: Partial<SurveyData>) => void;
  saveCurrentSurvey: () => boolean;
  deleteSurvey: (id: string) => Promise<void>;
  resetCurrentSurvey: () => void;
  clearAllData: () => Promise<void>;
  setSimulatedMode: (enabled: boolean) => void;
}

const STORAGE_KEY = '@smart_survey_history_v1';
const SIMULATED_MODE_KEY = '@smart_survey_simulated_mode';

const createEmptySurvey = (): SurveyData => ({
  id: `SRV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
  siteName: '',
  clientName: '',
  description: '',
  priority: 'Medium',
  date: new Date().toLocaleDateString(),
  notes: '',
});

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSurvey, setCurrentSurvey] = useState<SurveyData>(createEmptySurvey());
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [simulatedMode, setSimulatedModeState] = useState<boolean>(false); // Default OFF — use real hardware

  // Load history and settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSurveys = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedSurveys) {
          setSurveys(JSON.parse(storedSurveys));
        }

        const storedSimMode = await AsyncStorage.getItem(SIMULATED_MODE_KEY);
        if (storedSimMode !== null) {
          const parsed = JSON.parse(storedSimMode) as boolean;
          // If the old stored value is "true" (the previous default), clear it
          // so we fall back to the new default of false (real hardware mode).
          if (parsed === true) {
            await AsyncStorage.removeItem(SIMULATED_MODE_KEY);
            setSimulatedModeState(false);
          } else {
            setSimulatedModeState(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load data from storage:', error);
      }
    };
    loadData();
  }, []);

  const updateCurrentSurvey = (fields: Partial<SurveyData>) => {
    setCurrentSurvey((prev) => ({ ...prev, ...fields }));
  };

  const resetCurrentSurvey = () => {
    setCurrentSurvey(createEmptySurvey());
  };

  const saveCurrentSurvey = () => {
    if (!currentSurvey.siteName.trim() || !currentSurvey.clientName.trim()) {
      Alert.alert('Validation Error', 'Site Name and Client Name are required.');
      return false;
    }

    const newSurvey: SurveyData = {
      ...currentSurvey,
      submittedAt: new Date().toLocaleString(),
    };

    const updatedSurveys = [newSurvey, ...surveys];
    setSurveys(updatedSurveys);
    
    // Save to storage
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys))
      .catch(err => console.error('Failed to save survey list:', err));

    // Reset current draft
    resetCurrentSurvey();
    return true;
  };

  const deleteSurvey = async (id: string) => {
    const updatedSurveys = surveys.filter((s) => s.id !== id);
    setSurveys(updatedSurveys);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys));
  };

  const clearAllData = async () => {
    setSurveys([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const setSimulatedMode = async (enabled: boolean) => {
    setSimulatedModeState(enabled);
    await AsyncStorage.setItem(SIMULATED_MODE_KEY, JSON.stringify(enabled));
  };

  return (
    <SurveyContext.Provider
      value={{
        currentSurvey,
        surveys,
        simulatedMode,
        updateCurrentSurvey,
        saveCurrentSurvey,
        deleteSurvey,
        resetCurrentSurvey,
        clearAllData,
        setSimulatedMode,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
