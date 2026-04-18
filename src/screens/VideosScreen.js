import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, useWindowDimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { PRODUCTS } from '../constants/productData';
import { getHeroImage, getMoaImage } from '../constants/productImages';

// ═══════════════════════════════════════════════════════════════
// MEDIA DATA
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = ['All', 'Product', 'Manufacturing', 'Mode of Action', 'Shipping'];

const VIDEOS = [
  { id: 'v1', title: 'Ecoza Max – Product Overview', category: 'Product', duration: '3:24', icon: 'leaf' },
  { id: 'v2', title: 'Mycova – How It Works', category: 'Mode of Action', duration: '4:12', icon: 'bacteria' },
  { id: 'v3', title: 'Wynn Platform – Fermentation Facility', category: 'Manufacturing', duration: '6:45', icon: 'factory' },
  { id: 'v4', title: 'IGreen NPK – Application Demo', category: 'Product', duration: '2:58', icon: 'sprout' },
  { id: 'v5', title: 'Karyo Platform – Formulation Process', category: 'Manufacturing', duration: '5:30', icon: 'beaker' },
  { id: 'v6', title: 'MargoShine – Mode of Action', category: 'Mode of Action', duration: '3:15', icon: 'flask' },
  { id: 'v7', title: 'Biota-H – Root Disease Control', category: 'Product', duration: '2:44', icon: 'bacteria' },
  { id: 'v8', title: 'Microvate Platform Overview', category: 'Manufacturing', duration: '7:10', icon: 'lightning-bolt' },
  { id: 'v9', title: 'Blooma – Seaweed Biostimulant', category: 'Product', duration: '3:01', icon: 'waves' },
  { id: 'v10', title: 'Beauveria bassiana – Pest Infection', category: 'Mode of Action', duration: '4:55', icon: 'bacteria' },
  { id: 'v11', title: 'K-Guard – Nematode Control', category: 'Product', duration: '2:33', icon: 'leaf' },
  { id: 'v12', title: 'Kriya Manufacturing Facility Tour', category: 'Manufacturing', duration: '9:20', icon: 'factory' },
  { id: 'v13', title: 'Product Packaging & Dispatch', category: 'Shipping', duration: '3:40', icon: 'package-variant-closed' },
  { id: 'v14', title: 'Cold Chain Logistics', category: 'Shipping', duration: '4:15', icon: 'truck-delivery' },
  { id: 'v15', title: 'Export Shipment Process', category: 'Shipping', duration: '5:05', icon: 'airplane-takeoff' },
];

// ─── Build complete photo gallery from all product images ─────
const buildPhotos = () => {
  const photos = [];
  let idx = 1;

  // All ProductHero images
  PRODUCTS.forEach(p => {
    const img = getHeroImage(p.name);
    if (img) {
      photos.push({
        id: `ph-${idx++}`,
        title: p.name,
        category: 'Product',
        image: img,
        productName: p.name,
      });
    }
  });

  // All unique MOA images (deduplicated — families share the same image)
  const seenMoa = new Set();
  PRODUCTS.forEach(p => {
    const img = getMoaImage(p.name);
    if (img && !seenMoa.has(img)) {
      seenMoa.add(img);
      photos.push({
        id: `moa-${idx++}`,
        title: `${p.name} – Mode of Action`,
        category: 'Mode of Action',
        image: img,
        productName: p.name,
      });
    }
  });

  // Manufacturing & Technology images
  photos.push(
    { id: `mfg-${idx++}`, title: 'Manufacturing Facility', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/manufacturing.jpeg'), navTarget: 'Profile' },
    { id: `mfg-${idx++}`, title: 'R&D Laboratory', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/rnd.jpeg'), navTarget: 'Profile' },
    { id: `mfg-${idx++}`, title: 'Quality Control Lab', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/quality.jpeg'), navTarget: 'Profile' },
    { id: `mfg-${idx++}`, title: 'Wynn Fermentation Platform', category: 'Manufacturing', image: require('../assets/images/TechnologyImages/wynn.jpeg'), navTarget: 'Technology' },
    { id: `mfg-${idx++}`, title: 'Karyo Formulation Platform', category: 'Manufacturing', image: require('../assets/images/TechnologyImages/karyo.jpeg'), navTarget: 'Technology' },
    { id: `mfg-${idx++}`, title: 'Microvate Activation Platform', category: 'Manufacturing', image: require('../assets/images/TechnologyImages/microvate.jpeg'), navTarget: 'Technology' },
  );

  // Shipping photos (6 items = 2 full rows of 3)
  photos.push(
    { id: `shp-${idx++}`, title: 'Product Packaging', category: 'Shipping', image: require('../assets/images/shipping/shipping01.jpeg') },
    { id: `shp-${idx++}`, title: 'Warehouse Dispatch', category: 'Shipping', image: require('../assets/images/shipping/shipping02.jpeg') },
    { id: `shp-${idx++}`, title: 'Export Shipment', category: 'Shipping', image: require('../assets/images/shipping/shipping03.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipping Logistics', category: 'Shipping', image: require('../assets/images/shipping/shipping04.jpeg') },
    { id: `shp-${idx++}`, title: 'Dispatch Ready', category: 'Shipping', image: require('../assets/images/shipping/shipping05.jpeg') },
    { id: `shp-${idx++}`, title: 'Container Loading', category: 'Shipping', image: require('../assets/images/shipping/shipping01.jpeg') },
  );

  return photos;
};

const PHOTOS = buildPhotos();

const CAT_COLORS = {
  Product: '#2196F3',
  Manufacturing: '#FF9800',
  'Mode of Action': '#9C27B0',
  Shipping: '#00897B',
};

// ═══════════════════════════════════════════════════════════════
// SCREEN
// ═══════════════════════════════════════════════════════════════
const VideosScreen = ({ navigation }) => {
  const { width: winW } = useWindowDimensions();
  const COLS = 3;
  const THUMB_W = (winW - 48) / COLS;

  const [mediaType, setMediaType] = useState('Photos');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewerImage, setViewerImage] = useState(null);

  const isPhotos = mediaType === 'Photos';
  const sourceData = isPhotos ? PHOTOS : VIDEOS;

  const filtered = useMemo(() => {
    const data = activeCategory === 'All' ? sourceData : sourceData.filter(item => item.category === activeCategory);
    // Pad incomplete last row with invisible fillers so space-between doesn't leave gaps
    const remainder = data.length % COLS;
    if (remainder === 0) return data;
    const fillers = Array.from({ length: COLS - remainder }, (_, i) => ({
      id: `filler-${i}`,
      _filler: true,
    }));
    return [...data, ...fillers];
  }, [mediaType, activeCategory, sourceData]);

  // Reset category when switching media type
  const switchMediaType = (type) => {
    setMediaType(type);
    setActiveCategory('All');
  };

  // Navigate to relevant page or open image viewer
  const handlePhotoPress = (item) => {
    if (item.productName) {
      const product = PRODUCTS.find(p => p.name === item.productName);
      if (product) {
        navigation.navigate('ProductDetail', { product });
        return;
      }
    }
    if (item.navTarget) {
      navigation.navigate(item.navTarget);
      return;
    }
    if (item.image) {
      setViewerImage(item.image);
    }
  };

  const thumbH = THUMB_W * 0.75;

  // ─── Video Card ──────────────────────────────────────────────
  const renderVideo = ({ item }) => {
    if (item._filler) return <View style={{ width: THUMB_W }} />;
    return (
    <TouchableOpacity
      style={[styles.videoCard, { width: THUMB_W }]}
      activeOpacity={0.75}
      onPress={() => Alert.alert(item.title, `Duration: ${item.duration}\nCategory: ${item.category}\n\nVideo player would launch here with the bundled video file.`)}>
      <View style={[styles.thumbnail, { height: thumbH, backgroundColor: (CAT_COLORS[item.category] || '#455') + '15' }]}>
        <Icon name={item.icon} size={32} color={CAT_COLORS[item.category] || theme.colors.primary} />
        <View style={styles.playOverlay}>
          <Icon name="play-circle" size={36} color="rgba(0,0,0,0.5)" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={[styles.catBadge, { backgroundColor: (CAT_COLORS[item.category] || '#757') + '15' }]}>
          <Text style={[styles.catText, { color: CAT_COLORS[item.category] || theme.colors.primary }]}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  // ─── Photo Card ──────────────────────────────────────────────
  const renderPhoto = ({ item }) => {
    if (item._filler) return <View style={{ width: THUMB_W }} />;
    return (
    <TouchableOpacity
      style={[styles.videoCard, { width: THUMB_W }]}
      activeOpacity={0.75}
      onPress={() => handlePhotoPress(item)}>
      <View style={[styles.thumbnail, { height: thumbH, backgroundColor: (CAT_COLORS[item.category] || '#455') + '15' }]}>
        {item.image ? (
          <Image source={item.image} style={styles.photoImage} resizeMode="contain" />
        ) : (
          <Icon name={item.icon || 'image'} size={32} color={CAT_COLORS[item.category] || theme.colors.primary} />
        )}
        <View style={styles.photoBadge}>
          <Icon name="image" size={12} color="#FFF" />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={[styles.catBadge, { backgroundColor: (CAT_COLORS[item.category] || '#757') + '15' }]}>
          <Text style={[styles.catText, { color: CAT_COLORS[item.category] || theme.colors.primary }]}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Gallery" subtitle={`${filtered.filter(i => !i._filler).length} ${mediaType.toLowerCase()}`} onBack={() => navigation.goBack()} />

      {/* ═══ Level 1 — Media Type Toggle ═══════════════════════ */}
      <View style={styles.mediaTypeBar}>
        {['Photos', 'Videos'].map(type => {
          const active = mediaType === type;
          const iconName = type === 'Photos' ? 'image-outline' : 'play-box-outline';
          return (
            <TouchableOpacity
              key={type}
              style={[styles.mediaTypeBtn, active && styles.mediaTypeBtnActive]}
              onPress={() => switchMediaType(type)}
              activeOpacity={0.7}>
              <Icon name={iconName} size={18} color={active ? '#FFF' : theme.colors.textSecondary} />
              <Text style={[styles.mediaTypeTxt, active && styles.mediaTypeTxtActive]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ═══ Level 2 — Category Filter ═════════════════════════ */}
      <View style={styles.catListWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            const label = cat === 'All' ? `All ${mediaType}` : `${cat} ${mediaType}`;
            const color = CAT_COLORS[cat] || theme.colors.primary;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catTab, active && { backgroundColor: color, borderColor: color }]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.7}>
                <Text style={[styles.catTabText, active && styles.catTabTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ═══ Media Grid ════════════════════════════════════════ */}
      <FlatList
        data={filtered}
        renderItem={isPhotos ? renderPhoto : renderVideo}
        keyExtractor={item => item.id}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={COLS > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name={isPhotos ? 'image-off-outline' : 'video-off-outline'} size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No {mediaType.toLowerCase()} in this category</Text>
          </View>
        }
      />
      <ImageViewer
        visible={!!viewerImage}
        imageSource={viewerImage}
        onClose={() => setViewerImage(null)}
      />
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // ─── Level 1: Media Type Toggle ──────────────────────────────
  mediaTypeBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
    backgroundColor: '#FFF',
  },
  mediaTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  mediaTypeBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  mediaTypeTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  mediaTypeTxtActive: {
    color: '#FFF',
  },

  // ─── Level 2: Category Filter ────────────────────────────────
  catListWrap: {
    flexShrink: 0,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    paddingVertical: 10,
  },
  catList: { paddingHorizontal: 16, paddingRight: 24, alignItems: 'center', gap: 8 },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catTabText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  catTabTextActive: { color: '#FFF' },

  // ─── Media Grid ──────────────────────────────────────────────
  grid: { padding: 12, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  videoCard: { marginBottom: 14, borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFF', ...theme.shadows.sm },
  thumbnail: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  playOverlay: { position: 'absolute' },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  photoBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  videoInfo: { padding: 8 },
  videoTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.text, lineHeight: 18 },
  catBadge: { marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  catText: { fontSize: 10, fontWeight: '600' },

  // ─── Empty State ─────────────────────────────────────────────
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: theme.colors.textLight, marginTop: 12 },
});

export default VideosScreen;
