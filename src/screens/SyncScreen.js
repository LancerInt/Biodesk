import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import PinModal from '../components/common/PinModal';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';

const MEDIA_PACKS = [
  { id: 'product-videos', title: 'Product Videos', size: '450 MB', icon: 'video', color: '#2196F3', desc: '12 product demonstration videos' },
  { id: 'mfg-videos', title: 'Manufacturing Videos', size: '200 MB', icon: 'factory', color: '#FF9800', desc: 'Facility and process videos' },
  { id: 'moa-videos', title: 'Mode of Action Animations', size: '150 MB', icon: 'animation-play', color: '#9C27B0', desc: 'Animated MoA explanations' },
];

const SyncScreen = ({ navigation }) => {
  const [pinVisible, setPinVisible] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);
  const [mediaPacks, setMediaPacks] = useState({});

  useEffect(() => {
    const loadStats = async () => {
      try {
        const lc = await DatabaseService.getLeadCount();
        const mc = await DatabaseService.getMeetingCount();
        setLeadCount(lc);
        setMeetingCount(mc);
      } catch (e) { console.warn(e); }
    };
    if (authenticated) loadStats();
  }, [authenticated]);

  const handlePinSuccess = useCallback(async () => {
    const stored = await DatabaseService.getSetting('admin_pin');
    // Pin was already validated by PinModal via verifyPin
    setPinVisible(false);
    setAuthenticated(true);
  }, []);

  const handleExportLeads = useCallback(async () => {
    try {
      const csv = await DatabaseService.getLeadsAsCSV();
      if (!csv) {
        Alert.alert('No Data', 'No leads to export.');
        return;
      }
      Alert.alert(
        'Export Ready',
        `${leadCount} leads ready for export as CSV.\n\nIn production: This would open your email client with the CSV attached.`,
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [leadCount]);

  const handleBackup = useCallback(() => {
    Alert.alert(
      'Create Backup',
      `This will create BioDesk_Backup.zip containing:\n• ${leadCount} leads\n• ${meetingCount} meetings\n• Visiting card images\n\nIn production: The file would be saved to your device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Backup', onPress: () => Alert.alert('Success', 'BioDesk_Backup.zip created successfully!') },
      ]
    );
  }, [leadCount, meetingCount]);

  const handleMediaPack = useCallback((pack) => {
    if (mediaPacks[pack.id]) {
      Alert.alert('Already Downloaded', `${pack.title} is available offline.`);
      return;
    }
    Alert.alert(
      `Download ${pack.title}`,
      `Size: ${pack.size}\n${pack.desc}\n\nIn production: This would download the media pack for offline use.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Download',
          onPress: () => {
            setMediaPacks(p => ({ ...p, [pack.id]: true }));
            Alert.alert('Downloaded', `${pack.title} is now available offline.`);
          },
        },
      ]
    );
  }, [mediaPacks]);

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Header title="Sync & Backup" onBack={() => navigation.goBack()} />
        <PinModal
          visible={pinVisible}
          onClose={() => navigation.goBack()}
          onSuccess={handlePinSuccess}
        />
        <View style={styles.lockedState}>
          <Icon name="lock" size={64} color={theme.colors.textLight} />
          <Text style={styles.lockedTitle}>Admin Access Required</Text>
          <Text style={styles.lockedText}>Enter Admin PIN to access Sync & Backup</Text>
          <TouchableOpacity style={styles.unlockBtn} onPress={() => setPinVisible(true)}>
            <Icon name="lock-open" size={18} color="#FFF" />
            <Text style={styles.unlockBtnText}>Enter PIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Sync & Backup"
        subtitle="Admin Panel"
        onBack={() => navigation.goBack()}
        rightIcon="cog"
        onRightPress={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="account-group" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{leadCount}</Text>
            <Text style={styles.statLabel}>Leads</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="calendar-clock" size={24} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{meetingCount}</Text>
            <Text style={styles.statLabel}>Meetings</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="database" size={24} color={theme.colors.info} />
            <Text style={styles.statValue}>Local</Text>
            <Text style={styles.statLabel}>Storage</Text>
          </View>
        </View>

        {/* Export */}
        <Text style={styles.sectionTitle}>Data Export</Text>
        <View style={styles.card}>
          <View style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: '#2196F3' + '15' }]}>
              <Icon name="microsoft-excel" size={24} color="#2196F3" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Export Leads as CSV</Text>
              <Text style={styles.actionDesc}>{leadCount} leads ready • Opens email client</Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2196F3' }]} onPress={handleExportLeads}>
              <Text style={styles.actionBtnText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backup */}
        <Text style={styles.sectionTitle}>Backup</Text>
        <View style={styles.card}>
          <View style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Icon name="folder-zip" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Create Full Backup</Text>
              <Text style={styles.actionDesc}>Leads, meetings & card images → BioDesk_Backup.zip</Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]} onPress={handleBackup}>
              <Text style={styles.actionBtnText}>Backup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Packs */}
        <Text style={styles.sectionTitle}>Media Packs</Text>
        {MEDIA_PACKS.map(pack => (
          <View key={pack.id} style={styles.card}>
            <View style={styles.actionRow}>
              <View style={[styles.actionIcon, { backgroundColor: pack.color + '15' }]}>
                <Icon name={pack.icon} size={24} color={pack.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{pack.title}</Text>
                <Text style={styles.actionDesc}>{pack.desc} • {pack.size}</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: mediaPacks[pack.id] ? theme.colors.success : pack.color }]}
                onPress={() => handleMediaPack(pack)}>
                <Icon name={mediaPacks[pack.id] ? 'check' : 'download'} size={14} color="#FFF" />
                <Text style={styles.actionBtnText}>{mediaPacks[pack.id] ? 'Done' : 'Get'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 40 },
  lockedState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  lockedTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginTop: 16 },
  lockedText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 6, textAlign: 'center' },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    gap: 8,
  },
  unlockBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginTop: 6 },
  statLabel: { fontSize: 11, color: theme.colors.textLight, marginTop: 2 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 10, ...theme.shadows.sm },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  actionDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});

export default SyncScreen;
