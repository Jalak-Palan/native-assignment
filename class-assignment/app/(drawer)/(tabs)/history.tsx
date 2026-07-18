import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey, SurveyData } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { surveys, deleteSurvey } = useSurvey();
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  const handleDelete = (id: string, siteName: string) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete the survey for "${siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            await deleteSurvey(id);
          } 
        }
      ]
    );
  };

  // Filter and Search Logic
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch = 
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPriority = 
      selectedPriority === 'All' || 
      s.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

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

  const renderSurveyItem = ({ item }: { item: SurveyData }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/survey-detail', params: { id: item.id } } as any)}
      style={({ pressed }) => [
        styles.surveyCard,
        { 
          backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', 
          borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3',
          opacity: pressed ? 0.9 : 1
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleInfo}>
          <Text style={[styles.siteText, { color: colors.text }]} numberOfLines={1}>
            {item.siteName}
          </Text>
          <Text style={[styles.clientText, { color: colors.icon }]}>
            Client: {item.clientName}
          </Text>
        </View>
        <View style={[styles.priorityPill, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <Text style={[styles.descText, { color: colors.text }]} numberOfLines={2}>
        {item.description || 'No description provided.'}
      </Text>

      {/* Metadata Row */}
      <View style={[styles.metaRow, { borderTopColor: colorScheme === 'dark' ? '#2d3139' : '#f5f5f5' }]}>
        <View style={styles.metaLeft}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.icon} />
            <Text style={[styles.metaVal, { color: colors.icon }]}>{item.date}</Text>
          </View>
          {item.photoUri && <Ionicons name="camera" size={16} color="#4caf50" />}
          {item.location && <Ionicons name="location" size={16} color="#ff9800" />}
          {item.contact && <Ionicons name="person" size={14} color="#9c27b0" />}
        </View>

        <Pressable
          onPress={() => handleDelete(item.id, item.siteName)}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deletePressed]}
        >
          <Ionicons name="trash-outline" size={18} color="#f44336" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Survey History" />

      {/* Search & Filter Header Section */}
      <View style={[
        styles.searchSection, 
        { borderBottomColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
      ]}>
        {/* Search Bar */}
        <View style={[
          styles.searchBar,
          { 
            backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#f2f4f7',
            borderColor: colorScheme === 'dark' ? '#2d3139' : '#e0e0e0'
          }
        ]}>
          <Ionicons name="search" size={20} color={colors.icon} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by site or client..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.icon} />
            </Pressable>
          )}
        </View>

        {/* Priority Filter Pills */}
        <View style={styles.filterRow}>
          {(['All', 'High', 'Medium', 'Low'] as const).map((p) => {
            const active = selectedPriority === p;
            let activeColor = '#0a7ea4';
            if (p === 'High') activeColor = '#f44336';
            if (p === 'Medium') activeColor = '#ff9800';
            if (p === 'Low') activeColor = '#4caf50';

            return (
              <Pressable
                key={p}
                onPress={() => setSelectedPriority(p)}
                style={[
                  styles.filterPill,
                  { 
                    backgroundColor: active ? activeColor : (colorScheme === 'dark' ? '#1c1e21' : '#f2f4f7'),
                    borderColor: active ? activeColor : (colorScheme === 'dark' ? '#2d3139' : '#e0e0e0')
                  }
                ]}
              >
                <Text style={[
                  styles.filterTextLabel, 
                  { 
                    color: active ? '#fff' : colors.text,
                    fontWeight: active ? '700' : '500'
                  }
                ]}>
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Surveys List */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={renderSurveyItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={colors.icon} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Surveys Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              {searchQuery || selectedPriority !== 'All' 
                ? 'Try adjusting your search or filter settings.' 
                : 'Tap "New Survey" tab to create your first report.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterTextLabel: {
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  surveyCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleInfo: {
    flex: 1,
    marginRight: 12,
  },
  siteText: {
    fontSize: 16,
    fontWeight: '700',
  },
  clientText: {
    fontSize: 13,
    marginTop: 2,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePressed: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
