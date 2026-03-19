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
  const [meetingsWithAudio, setMeetingsWithAudio] = useState(new Set());

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getMeetings();
      setMeetings(data);
      const audioSet = await DatabaseService.getEntitiesWithAudio('meeting');
      setMeetingsWithAudio(audioSet);
    } catch (e) { console.warn(e); }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadMeetings(); }, [loadMeetings]));

  const handleDelete = (id, title) => {
    Alert.alert('Delete Meeting', `Remove "${title}" and all linked audio recordings?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await DatabaseService.deleteMeeting(id); loadMeetings(); } },
    ]);
  };

  const ListHeader = () => (
    <TouchableOpacity
      style={styles.audioBanner}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MeetingAudio')}>
      <View style={styles.audioBannerLeft}>
        <Icon name="microphone-outline" size={20} color={theme.colors.secondary} />
        <Text style={styles.audioBannerText}>Meeting Audio Notes</Text>
      </View>
      <View style={styles.audioBannerRight}>
        <Text style={styles.audioBannerHint}>View all recordings</Text>
        <Icon name="chevron-right" size={18} color={theme.colors.textLight} />
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          {item.meeting_number ? (
            <View style={styles.meetNumChip}>
              <Text style={styles.meetNumText}>{item.meeting_number}</Text>
            </View>
          ) : null}
        </View>
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
        {meetingsWithAudio.has(item.id) && (
          <View style={styles.audioIndicator}>
            <Icon name="microphone" size={12} color={theme.colors.secondary} />
            <Text style={styles.audioIndicatorText}>Has audio</Text>
          </View>
        )}
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
        ListHeaderComponent={ListHeader}
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.text, flex: 1 },
  meetNumChip: {
    backgroundColor: theme.colors.primary + '14',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  meetNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  event: { fontSize: 13, color: theme.colors.secondary, marginTop: 2, fontWeight: '500' },
  meta: { flexDirection: 'row', gap: 12, marginTop: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: theme.colors.textLight },
  notes: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 18 },
  audioIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  audioIndicatorText: { fontSize: 11, color: theme.colors.secondary, fontWeight: '500' },
  audioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.secondary + '0A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.secondary + '18',
  },
  audioBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  audioBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioBannerHint: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
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
