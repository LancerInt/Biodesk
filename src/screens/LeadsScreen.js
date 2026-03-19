import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, RefreshControl, Dimensions, Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { StorageAccessFramework } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import PinModal from '../components/common/PinModal';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { formatDate, getInitials } from '../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const RECENT_LIMIT = 5;

const LeadsScreen = ({ navigation }) => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [leadsWithAudio, setLeadsWithAudio] = useState(new Set());
  const [exportType, setExportType] = useState('csv'); // 'csv' | 'images' | 'audio'
  const [exporting, setExporting] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getLeads();
      setLeads(data);
      const audioSet = await DatabaseService.getEntitiesWithAudio('lead');
      setLeadsWithAudio(audioSet);
    } catch (e) { console.warn(e); }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadLeads(); }, [loadLeads]));

  // Search applies to ALL leads; limit to recent 5 only when not searching and not showAll
  const displayed = useMemo(() => {
    let list = leads;

    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      return list.filter(l =>
        (l.name || '').toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q) ||
        (l.country || '').toLowerCase().includes(q) ||
        (l.lead_number || '').toLowerCase().includes(q)
      );
    }

    return showAll ? list : list.slice(0, RECENT_LIMIT);
  }, [leads, searchQuery, showAll]);

  const handleDelete = (id, name) => {
    Alert.alert('Delete Lead', `Remove ${name} and all linked images/recordings?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await DatabaseService.deleteLead(id);
          } catch (e) {
            console.warn('Delete error:', e);
          }
          loadLeads();
        },
      },
    ]);
  };

  const handleExport = () => {
    Alert.alert('Export Leads', 'What would you like to export?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'CSV Data', onPress: () => { setExportType('csv'); setPinVisible(true); } },
      { text: 'All Images', onPress: () => { setExportType('images'); setPinVisible(true); } },
      { text: 'All Audio', onPress: () => { setExportType('audio'); setPinVisible(true); } },
    ]);
  };

  // ─── Export Images to device via SAF ────────────────────────
  const exportImages = async () => {
    setExporting(true);
    try {
      const allLeads = await DatabaseService.getLeads();
      const files = [];

      for (const lead of allLeads) {
        const images = await DatabaseService.getImages('lead', lead.id);
        const cards = await DatabaseService.getVisitingCards(lead.id);
        let photoIdx = 1;
        let cardIdx = 1;
        const prefix = `${(lead.lead_number || 'LEAD').replace(/\s/g, '_')}_${(lead.name || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_')}`;

        for (const img of images) {
          if (img.filePath) {
            const info = await FileSystem.getInfoAsync(img.filePath);
            if (info.exists) {
              const ext = img.filePath.split('.').pop() || 'jpg';
              files.push({ path: img.filePath, name: `${prefix}_photo${photoIdx++}.${ext}`, mime: ext === 'png' ? 'image/png' : 'image/jpeg' });
            }
          }
        }
        for (const card of cards) {
          if (card.imagePath) {
            const info = await FileSystem.getInfoAsync(card.imagePath);
            if (info.exists) {
              const ext = card.imagePath.split('.').pop() || 'jpg';
              files.push({ path: card.imagePath, name: `${prefix}_card${cardIdx++}.${ext}`, mime: ext === 'png' ? 'image/png' : 'image/jpeg' });
            }
          }
        }
      }

      if (files.length === 0) {
        Alert.alert('No Images', 'No lead images found to export.');
        setExporting(false);
        return;
      }

      const exported = await saveFilesToDevice(files);
      if (exported > 0) {
        Alert.alert('Export Complete', `${exported} image${exported !== 1 ? 's' : ''} saved to device.`);
      }
    } catch (e) {
      Alert.alert('Export Failed', e.message || 'Unknown error');
    }
    setExporting(false);
  };

  // ─── Export Audio to device via SAF ─────────────────────────
  const exportAudio = async () => {
    setExporting(true);
    try {
      const allLeads = await DatabaseService.getLeads();
      const files = [];

      for (const lead of allLeads) {
        const audios = await DatabaseService.getAudioRecordings('lead', lead.id);
        let audioIdx = 1;
        const prefix = `${(lead.lead_number || 'LEAD').replace(/\s/g, '_')}_${(lead.name || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_')}`;

        for (const audio of audios) {
          if (audio.filePath) {
            const info = await FileSystem.getInfoAsync(audio.filePath);
            if (info.exists) {
              const ext = audio.filePath.split('.').pop() || 'm4a';
              const mime = ext === 'mp3' ? 'audio/mpeg' : ext === 'wav' ? 'audio/wav' : 'audio/mp4';
              files.push({ path: audio.filePath, name: `${prefix}_audio${audioIdx++}.${ext}`, mime });
            }
          }
        }
      }

      if (files.length === 0) {
        Alert.alert('No Audio', 'No audio recordings found to export.');
        setExporting(false);
        return;
      }

      const exported = await saveFilesToDevice(files);
      if (exported > 0) {
        Alert.alert('Export Complete', `${exported} recording${exported !== 1 ? 's' : ''} saved to device.`);
      }
    } catch (e) {
      Alert.alert('Export Failed', e.message || 'Unknown error');
    }
    setExporting(false);
  };

  // ─── SAF helper: save files to user-chosen folder ───────────
  const saveFilesToDevice = async (files) => {
    try {
      // Android: use Storage Access Framework to pick destination folder
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) return 0;

      let exported = 0;
      for (const file of files) {
        try {
          const newUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri, file.name, file.mime
          );
          const content = await FileSystem.readAsStringAsync(file.path, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.writeAsStringAsync(newUri, content, {
            encoding: FileSystem.EncodingType.Base64,
          });
          exported++;
        } catch (err) {
          console.warn(`Export failed for ${file.name}:`, err);
        }
      }
      return exported;
    } catch (safError) {
      // Fallback: copy to exports folder and share first file
      console.warn('SAF unavailable, using sharing fallback:', safError);
      const exportDir = `${FileSystem.documentDirectory}exports/media/`;
      const dirInfo = await FileSystem.getInfoAsync(exportDir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true });

      let exported = 0;
      for (const file of files) {
        try {
          const dest = exportDir + file.name;
          await FileSystem.copyAsync({ from: file.path, to: dest });
          exported++;
        } catch (err) {
          console.warn(`Copy failed for ${file.name}:`, err);
        }
      }

      if (exported > 0) {
        const firstFile = exportDir + files[0].name;
        const sharable = await Sharing.isAvailableAsync();
        if (sharable) {
          Alert.alert(
            'Files Ready',
            `${exported} file${exported !== 1 ? 's' : ''} prepared. Sharing the first file — save to your preferred location.`,
            [{ text: 'Share', onPress: () => Sharing.shareAsync(firstFile, { mimeType: files[0].mime }) }]
          );
        } else {
          Alert.alert('Export Saved', `${exported} file${exported !== 1 ? 's' : ''} saved to app storage.`);
        }
      }
      return exported;
    }
  };

  // ─── CSV Export (existing logic) ────────────────────────────
  const exportCSV = async () => {
    try {
      const csv = await DatabaseService.getLeadsAsCSV();
      if (!csv) {
        Alert.alert('No Data', 'No leads to export.');
        return;
      }
      const exportDir = `${FileSystem.documentDirectory}exports/`;
      const dirInfo = await FileSystem.getInfoAsync(exportDir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filePath = `${exportDir}BioDesk_Leads_${timestamp}.csv`;
      await FileSystem.writeAsStringAsync(filePath, csv, { encoding: FileSystem.EncodingType.UTF8 });
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (sharingAvailable) {
        await Sharing.shareAsync(filePath, { mimeType: 'text/csv', dialogTitle: 'Export Leads CSV' });
      } else {
        Alert.alert('Export Saved', `${leads.length} leads exported to:\n${filePath}`);
      }
    } catch (e) {
      Alert.alert('Export Failed', e.message || 'Unknown error');
    }
  };

  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      {/* Card body — tappable to view */}
      <TouchableOpacity
        style={styles.cardBody}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('LeadForm', { lead: item, mode: 'view' })}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.leadInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.leadName}>{item.name}</Text>
            {item.lead_number ? (
              <View style={styles.leadNumberChip}>
                <Text style={styles.leadNumberChipText}>{item.lead_number}</Text>
              </View>
            ) : null}
          </View>
          {item.company ? (
            <Text style={styles.leadCompany} numberOfLines={1}>{item.company}</Text>
          ) : null}
          {item.phone ? (
            <View style={styles.phoneRow}>
              <Icon name="phone-outline" size={13} color={theme.colors.textLight} />
              <Text style={styles.phoneText}>{item.phone}</Text>
            </View>
          ) : null}
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
            {leadsWithAudio.has(item.id) ? (
              <Icon name="microphone" size={13} color={theme.colors.secondary} />
            ) : null}
          </View>
        </View>
        <Text style={styles.leadDate}>{formatDate(item.createdAt)}</Text>
      </TouchableOpacity>

      {/* Action buttons row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('LeadForm', { lead: item, mode: 'view' })}>
          <Icon name="eye-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.actionBtnText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('LeadForm', { lead: item, mode: 'edit' })}>
          <Icon name="pencil-outline" size={16} color={theme.colors.info} />
          <Text style={[styles.actionBtnText, { color: theme.colors.info }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.6}
          onPress={() => handleDelete(item.id, item.name)}>
          <Icon name="trash-can-outline" size={16} color={theme.colors.error} />
          <Text style={[styles.actionBtnText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Lead Gallery banner */}
      <TouchableOpacity
        style={styles.galleryBanner}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('LeadImages')}>
        <View style={styles.galleryBannerLeft}>
          <Icon name="image-multiple-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.galleryBannerText}>Lead Image Gallery</Text>
        </View>
        <View style={styles.galleryBannerRight}>
          <Text style={styles.galleryBannerHint}>View all photos</Text>
          <Icon name="chevron-right" size={18} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>

      {/* Lead Audio banner */}
      <TouchableOpacity
        style={[styles.galleryBanner, { borderColor: theme.colors.secondary + '18' }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('LeadAudio')}>
        <View style={styles.galleryBannerLeft}>
          <Icon name="microphone-outline" size={20} color={theme.colors.secondary} />
          <Text style={[styles.galleryBannerText, { color: theme.colors.secondary }]}>Lead Audio Notes</Text>
        </View>
        <View style={styles.galleryBannerRight}>
          <Text style={styles.galleryBannerHint}>View all recordings</Text>
          <Icon name="chevron-right" size={18} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>

      {/* Section label */}
      <Text style={styles.sectionLabel}>
        {searchQuery.length >= 2
          ? `Search Results (${displayed.length})`
          : showAll
            ? `All Leads (${leads.length})`
            : `Recent Leads (${Math.min(leads.length, RECENT_LIMIT)} of ${leads.length})`}
      </Text>
    </View>
  );

  const ListFooter = () => {
    if (searchQuery.length >= 2) return null;
    if (leads.length <= RECENT_LIMIT) return null;

    return (
      <TouchableOpacity
        style={styles.toggleBtn}
        activeOpacity={0.7}
        onPress={() => setShowAll(!showAll)}>
        <Icon
          name={showAll ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'}
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.toggleBtnText}>
          {showAll ? 'Show Recent Only' : `Display All Leads (${leads.length} total)`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Leads"
        subtitle={leads.length + ' contacts'}
        onBack={() => navigation.goBack()}
        rightIcon="export"
        onRightPress={handleExport}
      />

      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search leads by name, company, phone..."
          onClear={() => setSearchQuery('')}
        />
      </View>

      <FlatList
        data={displayed}
        renderItem={renderLead}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLeads} colors={[theme.colors.primary]} />
        }
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
        activeOpacity={0.85}
        onPress={() => navigation.navigate('LeadForm', { mode: 'create' })}>
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>

      <PinModal
        visible={pinVisible}
        onClose={() => setPinVisible(false)}
        onSuccess={async () => {
          setPinVisible(false);
          if (exportType === 'csv') await exportCSV();
          else if (exportType === 'images') await exportImages();
          else if (exportType === 'audio') await exportAudio();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 100 },

  // ─── List header ─────────────────────────────────────────
  listHeader: { marginBottom: 4 },
  galleryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary + '0A',
    borderRadius: 14,
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '18',
  },
  galleryBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  galleryBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  galleryBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  galleryBannerHint: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  // ─── Lead Card ───────────────────────────────────────────
  leadCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: isTablet ? 16 : 14,
  },
  avatar: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  leadInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leadNumberChip: {
    backgroundColor: theme.colors.primary + '14',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leadNumberChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  leadName: {
    fontSize: isTablet ? 17 : 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  leadCompany: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  phoneText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  leadMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
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
  leadDate: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },

  // ─── Action Buttons ──────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: theme.colors.divider,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // ─── Toggle Button ───────────────────────────────────────
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    gap: 8,
    ...theme.shadows.sm,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // ─── FAB ─────────────────────────────────────────────────
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

  // ─── Empty State ─────────────────────────────────────────
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 6,
  },
});

export default LeadsScreen;
