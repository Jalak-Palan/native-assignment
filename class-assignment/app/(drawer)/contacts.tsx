import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '@/components/CustomHeader';
import { useSurvey } from '@/context/SurveyContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ContactItem {
  id: string;
  name: string;
  phone?: string;
  initials: string;
  avatarColor: string;
}

// --------------- Module-level helpers (stable references) ---------------
const AVATAR_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#9e9e9e', '#607d8b',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, Math.min(2, name.length)).toUpperCase();
}

const MOCK_CONTACTS: ContactItem[] = [
  { id: '1', name: 'Aditya Sharma',  phone: '+91 98765 43210', initials: 'AS', avatarColor: getAvatarColor('Aditya Sharma') },
  { id: '2', name: 'Bhavesh Kumar',  phone: '+91 87654 32109', initials: 'BK', avatarColor: getAvatarColor('Bhavesh Kumar') },
  { id: '3', name: 'Chitra Singh',   phone: '+91 76543 21098', initials: 'CS', avatarColor: getAvatarColor('Chitra Singh') },
  { id: '4', name: 'Dinesh Patel',   phone: undefined,         initials: 'DP', avatarColor: getAvatarColor('Dinesh Patel') },
  { id: '5', name: 'Esha Gupta',     phone: '+91 95432 10987', initials: 'EG', avatarColor: getAvatarColor('Esha Gupta') },
  { id: '6', name: 'Faisal Khan',    phone: '+91 94321 09876', initials: 'FK', avatarColor: getAvatarColor('Faisal Khan') },
  { id: '7', name: 'Ganesh Murthy',  phone: '+91 93210 98765', initials: 'GM', avatarColor: getAvatarColor('Ganesh Murthy') },
  { id: '8', name: 'Harish Rawat',   phone: '+91 92109 87654', initials: 'HR', avatarColor: getAvatarColor('Harish Rawat') },
  { id: '9', name: 'Isha Roy',       phone: '+91 91098 76543', initials: 'IR', avatarColor: getAvatarColor('Isha Roy') },
  { id: '10', name: 'Jalak Palan',   phone: '+91 99999 88888', initials: 'JP', avatarColor: getAvatarColor('Jalak Palan') },
];
// -------------------------------------------------------------------------

export default function ContactsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { updateCurrentSurvey, simulatedMode } = useSurvey();
  const colors = Colors[colorScheme];

  // Local state
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const loadContacts = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);

    if (simulatedMode) {
      setTimeout(() => {
        setContacts(MOCK_CONTACTS);
        setPermissionStatus('granted');
        setIsLoading(false);
        setIsRefreshing(false);
      }, 800);
    } else {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        setPermissionStatus(status);
        
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          
          if (data.length > 0) {
            const formatted: ContactItem[] = data.map((c) => {
              const phone = c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : undefined;
              return {
                id: c.id || Math.random().toString(),
                name: c.name || 'Unnamed',
                phone: phone,
                initials: getInitials(c.name || 'Unnamed'),
                avatarColor: getAvatarColor(c.name || 'Unnamed'),
              };
            });
            setContacts(formatted);
          } else {
            setContacts([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        setErrorState();
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [simulatedMode]);

  const setErrorState = () => {
    setPermissionStatus('denied');
    setContacts([]);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadContacts(false);
  };

  const handleCopyNumber = async (phone: string, name: string) => {
    await Clipboard.setStringAsync(phone);
    Alert.alert('Number Copied', `Copied phone number for ${name} to clipboard.`);
  };

  const handleSelectContact = (contact: ContactItem) => {
    updateCurrentSurvey({
      contact: {
        name: contact.name,
        phoneNumber: contact.phone,
      },
    });
    Alert.alert(
      'Contact Selected',
      `Linked "${contact.name}" to your active survey.`,
      [{ text: 'OK', onPress: () => router.push('/survey') }]
    );
  };

  // Filter contacts by query
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContactItem = ({ item }: { item: ContactItem }) => (
    <Pressable
      onPress={() => handleSelectContact(item)}
      style={({ pressed }) => [
        styles.contactCard,
        { 
          backgroundColor: colorScheme === 'dark' ? '#1c1e21' : '#ffffff', 
          borderColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3',
          opacity: pressed ? 0.9 : 1
        }
      ]}
    >
      {/* Initials Avatar */}
      <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>

      <View style={styles.contactDetails}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        {item.phone ? (
          <Pressable 
            onPress={() => handleCopyNumber(item.phone!, item.name)}
            style={({ pressed }) => [styles.phoneRow, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="call-outline" size={14} color="#0a7ea4" />
            <Text style={[styles.contactPhone, { color: '#0a7ea4' }]}>{item.phone}</Text>
            <Ionicons name="copy-outline" size={12} color="#0a7ea4" style={{ marginLeft: 4 }} />
          </Pressable>
        ) : (
          <Text style={[styles.contactPhone, { color: colors.icon, fontStyle: 'italic' }]}>
            No Phone Number
          </Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.icon} />
    </Pressable>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={[styles.loadingText, { color: colors.icon }]}>Retrieving contacts database...</Text>
        </View>
      );
    }

    if (permissionStatus === 'denied' && !simulatedMode) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={64} color={colors.icon} style={styles.emptyIcon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Contacts Permission Blocked</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            Grant contacts permission in your device settings or enable Simulated Data Mode in Settings.
          </Text>
          <Pressable onPress={() => loadContacts()} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry Request</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#0a7ea4']}
            tintColor="#0a7ea4"
          />
        }
        ListHeaderComponent={
          contacts.length > 0 ? (
            <View style={styles.counterRow}>
              <Text style={[styles.counterText, { color: colors.icon }]}>
                {searchQuery 
                  ? `Showing ${filteredContacts.length} of ${contacts.length} contacts`
                  : `${contacts.length} contacts synced`
                }
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Ionicons name="people-outline" size={64} color={colors.icon} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Contacts Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              No matching records found. Pull down to refresh.
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Contacts Sync" />

      {/* Search Header */}
      <View style={[
        styles.searchSection, 
        { borderBottomColor: colorScheme === 'dark' ? '#2d3139' : '#eef0f3' }
      ]}>
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
            placeholder="Search contacts by name..."
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
      </View>

      {renderContent()}
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  counterRow: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  contactCard: {
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  contactPhone: {
    fontSize: 12,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
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
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
