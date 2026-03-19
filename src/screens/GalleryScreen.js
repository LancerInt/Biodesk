import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image,
  Dimensions, Alert, Modal, RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';

const { width } = Dimensions.get('window');
const COLS = 3;
const THUMB_SIZE = (width - 48) / COLS;

const GalleryScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerImage, setViewerImage] = useState(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const allImages = [];

      // Load images from images table (camera captures)
      const dbImages = await DatabaseService.getAllImages();
      for (const img of dbImages) {
        const info = await FileSystem.getInfoAsync(img.filePath).catch(() => ({ exists: false }));
        if (info.exists) {
          allImages.push({
            id: img.id,
            uri: img.filePath,
            label: img.label || 'Photo',
            entityType: img.entityType,
            entityId: img.entityId,
            createdAt: img.createdAt,
            source: 'camera',
          });
        }
      }

      // Load visiting card images
      const cards = await DatabaseService.getAllVisitingCards();
      for (const card of cards) {
        const info = await FileSystem.getInfoAsync(card.imagePath).catch(() => ({ exists: false }));
        if (info.exists) {
          allImages.push({
            id: 'vc_' + card.id,
            uri: card.imagePath,
            label: card.extractedName || 'Visiting Card',
            entityType: 'visiting_card',
            entityId: card.leadId,
            createdAt: card.createdAt,
            source: 'visiting_card',
          });
        }
      }

      // Sort by newest first
      allImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setImages(allImages);
    } catch (e) {
      console.warn('Gallery load error:', e);
    }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadImages(); }, [loadImages]));

  // Preload gallery image URIs for faster thumbnails
  useEffect(() => {
    images.forEach((img) => {
      if (img.uri) Image.prefetch(img.uri);
    });
  }, [images]);

  const renderImage = ({ item }) => (
    <TouchableOpacity
      style={styles.imageCard}
      activeOpacity={0.8}
      onPress={() => setViewerImage(item)}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <View style={styles.imageLabel}>
        <Icon
          name={item.source === 'visiting_card' ? 'card-account-details' : 'camera'}
          size={10}
          color="#FFF"
        />
        <Text style={styles.imageLabelText} numberOfLines={1}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Gallery"
        subtitle={`${images.length} images`}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={item => item.id}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadImages} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="image-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No Images Yet</Text>
            <Text style={styles.emptyText}>Captured photos and visiting cards will appear here</Text>
          </View>
        }
      />

      {/* Full-screen image viewer */}
      <Modal visible={!!viewerImage} transparent animationType="fade" onRequestClose={() => setViewerImage(null)}>
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerImage(null)}>
            <Icon name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          {viewerImage && (
            <>
              <Image
                source={{ uri: viewerImage.uri }}
                style={styles.viewerImage}
                resizeMode="contain"
              />
              <View style={styles.viewerInfo}>
                <Text style={styles.viewerLabel}>{viewerImage.label}</Text>
                <Text style={styles.viewerDate}>
                  {new Date(viewerImage.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  grid: { padding: 12, paddingBottom: 20 },
  row: { justifyContent: 'flex-start', gap: 6 },
  imageCard: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#E0E0E0',
  },
  thumbnail: { width: '100%', height: '100%' },
  imageLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  imageLabelText: { color: '#FFF', fontSize: 10, fontWeight: '500', flex: 1 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 16 },
  emptyText: { fontSize: 14, color: theme.colors.textLight, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 },

  // Full-screen viewer
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: { width: '90%', height: '65%' },
  viewerInfo: { alignItems: 'center', marginTop: 16 },
  viewerLabel: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  viewerDate: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
});

export default GalleryScreen;
