import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Dimensions, RefreshControl, Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import { StorageAccessFramework } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const COLS = isTablet ? 3 : 2;
const PAD = isTablet ? 24 : 16;
const GAP = isTablet ? 14 : 10;
const CARD_W = (screenWidth - PAD * 2 - GAP * (COLS - 1)) / COLS;

const LeadImagesScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const [allLeads, allImages, allCards] = await Promise.all([
        DatabaseService.getLeads(),
        DatabaseService.getAllImages(),
        DatabaseService.getAllVisitingCards(),
      ]);

      const leadMap = {};
      allLeads.forEach(l => { leadMap[l.id] = l; });

      const combined = [];

      // Lead photos
      for (const img of allImages) {
        if (img.entityType !== 'lead') continue;
        const info = await FileSystem.getInfoAsync(img.filePath).catch(() => ({ exists: false }));
        if (!info.exists) continue;
        const lead = leadMap[img.entityId];
        combined.push({
          id: 'img_' + img.id,
          uri: img.filePath,
          leadId: img.entityId,
          leadName: lead?.name || 'Unknown',
          companyName: lead?.company || '',
          capturedAt: img.createdAt || img.timestamp,
          type: 'photo',
        });
      }

      // Visiting cards
      for (const card of allCards) {
        const info = await FileSystem.getInfoAsync(card.imagePath).catch(() => ({ exists: false }));
        if (!info.exists) continue;
        const lead = leadMap[card.leadId];
        combined.push({
          id: 'vc_' + card.id,
          uri: card.imagePath,
          leadId: card.leadId,
          leadName: lead?.name || card.extractedName || 'Unknown',
          companyName: lead?.company || card.extractedCompany || '',
          capturedAt: card.createdAt,
          type: 'visiting_card',
        });
      }

      combined.sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
      setImages(combined);
    } catch (e) {
      console.warn('LeadImages load error:', e);
    }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadImages(); }, [loadImages]));

  const handleCardPress = useCallback(async (item) => {
    try {
      const lead = await DatabaseService.getLeadById(item.leadId);
      if (lead) {
        navigation.navigate('LeadForm', { lead, mode: 'view' });
      }
    } catch {}
  }, [navigation]);

  const deleteImage = useCallback((item) => {
    const typeLabel = item.type === 'visiting_card' ? 'visiting card' : 'photo';
    Alert.alert(
      'Delete Image',
      `Remove this ${typeLabel} from "${item.leadName}"?\nThe lead itself will NOT be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri, { idempotent: true }).catch(() => {});
              const rawId = item.id.replace(/^(img_|vc_)/, '');
              if (item.type === 'visiting_card') {
                await DatabaseService.deleteVisitingCard(rawId);
              } else {
                await DatabaseService.deleteImage(rawId);
              }
              loadImages();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete image.');
            }
          },
        },
      ]
    );
  }, [loadImages]);

  const downloadImage = useCallback(async (item) => {
    try {
      const ext = item.uri.split('.').pop() || 'jpg';
      const safeName = (item.leadName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
      const typeLabel = item.type === 'visiting_card' ? 'card' : 'photo';
      const fileName = `${safeName}_${typeLabel}.${ext}`;
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

      try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) return;

        const newUri = await StorageAccessFramework.createFileAsync(
          permissions.directoryUri, fileName, mime
        );
        const content = await FileSystem.readAsStringAsync(item.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(newUri, content, {
          encoding: FileSystem.EncodingType.Base64,
        });
        Alert.alert('Downloaded', `${fileName} saved to device.`);
      } catch (safErr) {
        // Fallback: share the file
        const sharable = await Sharing.isAvailableAsync();
        if (sharable) {
          await Sharing.shareAsync(item.uri, { mimeType: mime });
        } else {
          Alert.alert('Error', 'Unable to save file.');
        }
      }
    } catch (e) {
      Alert.alert('Download Failed', e.message || 'Unknown error');
    }
  }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.uri }} style={styles.cardImage} />
      <View style={styles.typeBadge}>
        <Icon
          name={item.type === 'visiting_card' ? 'card-account-details' : 'camera'}
          size={12}
          color="#FFF"
        />
      </View>
      {/* Download button */}
      <TouchableOpacity
        style={styles.downloadBadge}
        activeOpacity={0.7}
        onPress={() => downloadImage(item)}>
        <Icon name="download" size={14} color="#FFF" />
      </TouchableOpacity>
      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteBadge}
        activeOpacity={0.7}
        onPress={() => deleteImage(item)}>
        <Icon name="trash-can-outline" size={14} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.leadName}</Text>
        {item.companyName ? (
          <Text style={styles.cardCompany} numberOfLines={1}>{item.companyName}</Text>
        ) : null}
        <Text style={styles.cardDate}>
          {item.capturedAt
            ? new Date(item.capturedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Lead Images"
        subtitle={images.length + ' images'}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={images}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadImages}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="image-off-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No Lead Images</Text>
            <Text style={styles.emptyText}>
              Photos and visiting cards captured during lead creation will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  grid: { padding: PAD, paddingBottom: 40 },
  row: { gap: GAP },
  card: {
    width: CARD_W,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: GAP,
    ...theme.shadows.md,
  },
  cardImage: {
    width: '100%',
    height: CARD_W * 0.75,
    backgroundColor: '#E8E8E8',
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 6,
  },
  downloadBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: theme.colors.primary + 'CC',
    borderRadius: 12,
    padding: 6,
  },
  deleteBadge: {
    position: 'absolute',
    bottom: 70,
    right: 10,
    backgroundColor: (theme.colors.error || '#D32F2F') + 'CC',
    borderRadius: 12,
    padding: 6,
  },
  cardInfo: {
    padding: isTablet ? 14 : 12,
  },
  cardName: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardCompany: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  cardDate: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 6,
  },
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default LeadImagesScreen;
