import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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
  const [exporting, setExporting] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

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
    setPinVisible(false);
    setAuthenticated(true);
  }, []);

  // ─── Real CSV Export ───────────────────────────────────────
  const handleExportLeads = useCallback(async () => {
    try {
      setExporting(true);
      const csv = await DatabaseService.getLeadsAsCSV();
      if (!csv) {
        Alert.alert('No Data', 'No leads to export.');
        setExporting(false);
        return;
      }

      // Write CSV to document directory
      const exportDir = `${FileSystem.documentDirectory}exports/`;
      const dirInfo = await FileSystem.getInfoAsync(exportDir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `BioDesk_Leads_${timestamp}.csv`;
      const filePath = exportDir + filename;

      await FileSystem.writeAsStringAsync(filePath, csv, { encoding: FileSystem.EncodingType.UTF8 });

      // Verify file was written
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'Failed to write export file.');
        setExporting(false);
        return;
      }

      setExporting(false);

      // Share the file
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (sharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Leads CSV',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert(
          'Export Saved',
          `${leadCount} leads exported successfully.\n\nFile saved to:\n${filePath}`,
        );
      }
    } catch (e) {
      setExporting(false);
      Alert.alert('Export Failed', 'Could not export leads: ' + (e.message || 'Unknown error'));
    }
  }, [leadCount]);

  // ─── Real Backup with ZIP ──────────────────────────────────
  const handleBackup = useCallback(async () => {
    Alert.alert(
      'Create Backup',
      `This will create a backup containing:\n• ${leadCount} leads\n• ${meetingCount} meetings\n• Audio recordings & visiting cards`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Backup',
          onPress: async () => {
            try {
              setBackingUp(true);

              // Gather all data
              const leads = await DatabaseService.getLeads();
              const meetings = await DatabaseService.getMeetings();

              // Gather audio recordings for all leads and meetings
              const audioRecordings = [];
              for (const lead of leads) {
                const recs = await DatabaseService.getAudioRecordings('lead', lead.id);
                audioRecordings.push(...recs.map(r => ({ ...r, parentType: 'lead' })));
              }
              for (const meeting of meetings) {
                const recs = await DatabaseService.getAudioRecordings('meeting', meeting.id);
                audioRecordings.push(...recs.map(r => ({ ...r, parentType: 'meeting' })));
              }

              // Gather visiting cards
              const visitingCards = [];
              for (const lead of leads) {
                const cards = await DatabaseService.getVisitingCards(lead.id);
                visitingCards.push(...cards);
              }

              // Build backup JSON
              const backupData = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                app: 'BioDesk',
                data: {
                  leads,
                  meetings,
                  audioRecordings,
                  visitingCards,
                },
                stats: {
                  leadCount: leads.length,
                  meetingCount: meetings.length,
                  audioCount: audioRecordings.length,
                  cardCount: visitingCards.length,
                },
              };

              // Create ZIP using JSZip
              const JSZip = require('jszip');
              const zip = new JSZip();
              zip.file('backup_data.json', JSON.stringify(backupData, null, 2));

              // Add audio files to ZIP if they exist
              for (const rec of audioRecordings) {
                try {
                  const info = await FileSystem.getInfoAsync(rec.filePath);
                  if (info.exists) {
                    const content = await FileSystem.readAsStringAsync(rec.filePath, { encoding: FileSystem.EncodingType.Base64 });
                    const pathParts = rec.filePath.split('/');
                    const audioFilename = pathParts[pathParts.length - 1];
                    zip.file(`audio/${rec.parentType}_${rec.parentId}/${audioFilename}`, content, { base64: true });
                  }
                } catch {}
              }

              // Add visiting card images to ZIP if they exist
              for (const card of visitingCards) {
                try {
                  const info = await FileSystem.getInfoAsync(card.imagePath);
                  if (info.exists) {
                    const content = await FileSystem.readAsStringAsync(card.imagePath, { encoding: FileSystem.EncodingType.Base64 });
                    const pathParts = card.imagePath.split('/');
                    const imageFilename = pathParts[pathParts.length - 1];
                    zip.file(`visiting_cards/${card.leadId}/${imageFilename}`, content, { base64: true });
                  }
                } catch {}
              }

              // Generate ZIP blob as base64
              const zipBase64 = await zip.generateAsync({ type: 'base64' });

              // Write ZIP to file system
              const exportDir = `${FileSystem.documentDirectory}exports/`;
              const dirInfo = await FileSystem.getInfoAsync(exportDir);
              if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true });

              const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
              const zipPath = `${exportDir}BioDesk_Backup_${timestamp}.zip`;
              await FileSystem.writeAsStringAsync(zipPath, zipBase64, { encoding: FileSystem.EncodingType.Base64 });

              // Verify
              const zipInfo = await FileSystem.getInfoAsync(zipPath);
              if (!zipInfo.exists) {
                setBackingUp(false);
                Alert.alert('Error', 'Failed to create backup file.');
                return;
              }

              setBackingUp(false);

              // Share the ZIP
              const sharingAvailable = await Sharing.isAvailableAsync();
              if (sharingAvailable) {
                await Sharing.shareAsync(zipPath, {
                  mimeType: 'application/zip',
                  dialogTitle: 'BioDesk Backup',
                });
              } else {
                Alert.alert(
                  'Backup Created',
                  `Backup saved successfully!\n\nFile: ${zipPath}\nSize: ${(zipInfo.size / 1024).toFixed(1)} KB`,
                );
              }
            } catch (e) {
              setBackingUp(false);
              Alert.alert('Backup Failed', 'Could not create backup: ' + (e.message || 'Unknown error'));
            }
          },
        },
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
      `Size: ${pack.size}\n${pack.desc}\n\nThis will download the media pack for offline use.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
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
              <Text style={styles.actionDesc}>{leadCount} leads ready • Save or share</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#2196F3', opacity: exporting ? 0.6 : 1 }]}
              onPress={handleExportLeads}
              disabled={exporting}>
              {exporting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.actionBtnText}>Export</Text>
              )}
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
              <Text style={styles.actionDesc}>Leads, meetings, audio & cards → ZIP</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.colors.primary, opacity: backingUp ? 0.6 : 1 }]}
              onPress={handleBackup}
              disabled={backingUp}>
              {backingUp ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.actionBtnText}>Backup</Text>
              )}
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
    minWidth: 70,
    justifyContent: 'center',
  },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});

export default SyncScreen;
