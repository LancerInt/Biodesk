import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import PinModal from '../components/common/PinModal';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { formatDate, getInitials, getCategoryColor } from '../utils/helpers';

const LeadsScreen = ({ navigation }) => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getLeads();
      setLeads(data);
    } catch (e) { console.warn(e); }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadLeads(); }, [loadLeads]));

  const filtered = leads.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (l.name || '').toLowerCase().includes(q) ||
      (l.company || '').toLowerCase().includes(q) ||
      (l.country || '').toLowerCase().includes(q);
  });

  const handleDelete = (id, name) => {
    Alert.alert('Delete Lead', `Remove ${name} from leads?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await DatabaseService.deleteLead(id);
          loadLeads();
        },
      },
    ]);
  };

  const renderLead = ({ item }) => (
    <TouchableOpacity
      style={styles.leadCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('LeadForm', { lead: item, mode: 'edit' })}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.leadInfo}>
        <Text style={styles.leadName}>{item.name}</Text>
        <Text style={styles.leadCompany} numberOfLines={1}>{item.company}</Text>
        <View style={styles.leadMeta}>
          {item.country ? (
            <View style={styles.metaChip}>
              <Icon name="map-marker" size={11} color={theme.colors.textLight} />
              <Text style={styles.metaText}>{item.country}</Text>
            </View>
          ) : null}
          {item.partnerType ? (
            <View style={[styles.metaChip, { backgroundColor: theme.colors.secondary + '15' }]}>
              <Text style={[styles.metaText, { color: theme.colors.secondary, fontWeight: '600' }]}>
                {item.partnerType}
              </Text>
            </View>
          ) : null}
        </View>
        {item.event ? <Text style={styles.leadEvent} numberOfLines={1}>{item.event}</Text> : null}
      </View>
      <View style={styles.leadRight}>
        <Text style={styles.leadDate}>{formatDate(item.createdAt)}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="trash-can-outline" size={18} color={theme.colors.error + '80'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Leads"
        subtitle={`${leads.length} contacts`}
        onBack={() => navigation.goBack()}
        rightIcon="export"
        onRightPress={() => setPinVisible(true)}
      />
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search leads by name, company..."
          onClear={() => setSearchQuery('')}
        />
      </View>
      <FlatList
        data={filtered}
        renderItem={renderLead}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadLeads} colors={[theme.colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="account-group-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No Leads Yet</Text>
            <Text style={styles.emptyText}>Tap + to capture your first lead</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LeadForm', { mode: 'create' })}>
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>

      <PinModal
        visible={pinVisible}
        onClose={() => setPinVisible(false)}
        onSuccess={async () => {
          setPinVisible(false);
          const csv = await DatabaseService.getLeadsAsCSV();
          if (csv) {
            Alert.alert('Export Ready', `${leads.length} leads ready to export.\n\nFeature: Share as CSV via email.`);
          } else {
            Alert.alert('No Data', 'No leads to export.');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  leadCompany: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  leadMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  metaText: { fontSize: 11, color: theme.colors.textSecondary },
  leadEvent: { fontSize: 11, color: theme.colors.primary, marginTop: 4, fontWeight: '500' },
  leadRight: { alignItems: 'flex-end', gap: 8 },
  leadDate: { fontSize: 11, color: theme.colors.textLight },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 16 },
  emptyText: { fontSize: 14, color: theme.colors.textLight, marginTop: 6 },
});

export default LeadsScreen;
