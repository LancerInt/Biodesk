import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { formatDate } from '../utils/helpers';

const MeetingsScreen = ({ navigation }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getMeetings();
      setMeetings(data);
    } catch (e) { console.warn(e); }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadMeetings(); }, [loadMeetings]));

  const handleDelete = (id, title) => {
    Alert.alert('Delete Meeting', `Remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await DatabaseService.deleteMeeting(id); loadMeetings(); } },
    ]);
  };

  const renderMeeting = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MeetingForm', { meeting: item, mode: 'edit' })}>
      <View style={styles.cardLeft}>
        <View style={styles.iconWrap}>
          <Icon name="calendar-clock" size={24} color={theme.colors.primary} />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        {item.event ? <Text style={styles.event}>{item.event}</Text> : null}
        <View style={styles.meta}>
          {item.location ? (
            <View style={styles.metaItem}>
              <Icon name="map-marker-outline" size={12} color={theme.colors.textLight} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Icon name="calendar-outline" size={12} color={theme.colors.textLight} />
            <Text style={styles.metaText}>{formatDate(item.date || item.createdAt)}</Text>
          </View>
        </View>
        {item.notes ? <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id, item.title)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Icon name="trash-can-outline" size={18} color={theme.colors.error + '80'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Meetings" subtitle={`${meetings.length} records`} onBack={() => navigation.goBack()} />
      <FlatList
        data={meetings}
        renderItem={renderMeeting}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMeetings} colors={[theme.colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="calendar-blank-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No Meetings Yet</Text>
            <Text style={styles.emptyText}>Record your first meeting note</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MeetingForm', { mode: 'create' })}>
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  cardLeft: { marginRight: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  event: { fontSize: 13, color: theme.colors.secondary, marginTop: 2, fontWeight: '500' },
  meta: { flexDirection: 'row', gap: 12, marginTop: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: theme.colors.textLight },
  notes: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 18 },
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

export default MeetingsScreen;
