import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { PRODUCTS } from '../constants/productData';
import { getHeroImage, getMoaImage } from '../constants/productImages';
import CLIENT_VISIT_IMAGES from '../constants/clientVisitImages';

// ═══════════════════════════════════════════════════════════════
// MEDIA DATA
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = ['Product', 'Manufacturing', 'Mode of Action', 'Client Visit', 'Shipping'];

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
    { id: `mfg-${idx++}`, title: 'Manufacturing Facility', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/manufacturing.jpeg'), navTarget: 'Profile', navParams: { sectionIndex: 2 } },
    { id: `mfg-${idx++}`, title: 'R&D Laboratory', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/rnd.jpeg'), navTarget: 'Profile', navParams: { sectionIndex: 3 } },
    { id: `mfg-${idx++}`, title: 'Quality Control Lab', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/quality.jpeg'), navTarget: 'Profile', navParams: { sectionIndex: 4 } },
  );

  // Client Visit — folder entries (one per client)
  Object.entries(CLIENT_VISIT_IMAGES).forEach(([clientName, images]) => {
    photos.push({
      id: `cvf-${idx++}`,
      title: clientName,
      category: 'Client Visit',
      image: images[0],
      _isFolder: true,
      _folderName: clientName,
      _folderCount: images.length,
    });
  });

  // Shipping photos
  photos.push(
    { id: `shp-${idx++}`, title: 'Product Packaging', category: 'Shipping', image: require('../assets/images/shipping/shipping01.jpeg') },
    { id: `shp-${idx++}`, title: 'Warehouse Dispatch', category: 'Shipping', image: require('../assets/images/shipping/shipping02.jpeg') },
    { id: `shp-${idx++}`, title: 'Export Shipment', category: 'Shipping', image: require('../assets/images/shipping/shipping03.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipping Logistics', category: 'Shipping', image: require('../assets/images/shipping/shipping04.jpeg') },
    { id: `shp-${idx++}`, title: 'Dispatch Ready', category: 'Shipping', image: require('../assets/images/shipping/shipping05.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 1L Packing (1)', category: 'Shipping', image: require('../assets/images/shipping/shipping06.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 1L Packing (2)', category: 'Shipping', image: require('../assets/images/shipping/shipping07.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 1L Packing (3)', category: 'Shipping', image: require('../assets/images/shipping/shipping08.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 5L Packing (1)', category: 'Shipping', image: require('../assets/images/shipping/shipping09.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 5L Packing (2)', category: 'Shipping', image: require('../assets/images/shipping/shipping10.jpeg') },
    { id: `shp-${idx++}`, title: 'BioTrop 5L Packing (3)', category: 'Shipping', image: require('../assets/images/shipping/shipping11.jpeg') },
    { id: `shp-${idx++}`, title: 'Esnad 1L Packing (1)', category: 'Shipping', image: require('../assets/images/shipping/shipping12.jpeg') },
    { id: `shp-${idx++}`, title: 'Esnad 1L Packing (2)', category: 'Shipping', image: require('../assets/images/shipping/shipping13.jpeg') },
    { id: `shp-${idx++}`, title: 'Esnad 1L Packing (3)', category: 'Shipping', image: require('../assets/images/shipping/shipping14.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 1', category: 'Shipping', image: require('../assets/images/shipping/shipping15.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 2', category: 'Shipping', image: require('../assets/images/shipping/shipping16.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 3', category: 'Shipping', image: require('../assets/images/shipping/shipping17.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 4', category: 'Shipping', image: require('../assets/images/shipping/shipping18.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 5', category: 'Shipping', image: require('../assets/images/shipping/shipping19.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 6', category: 'Shipping', image: require('../assets/images/shipping/shipping20.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 7', category: 'Shipping', image: require('../assets/images/shipping/shipping21.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 8', category: 'Shipping', image: require('../assets/images/shipping/shipping22.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 9', category: 'Shipping', image: require('../assets/images/shipping/shipping23.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 10', category: 'Shipping', image: require('../assets/images/shipping/shipping24.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 11', category: 'Shipping', image: require('../assets/images/shipping/shipping25.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 12', category: 'Shipping', image: require('../assets/images/shipping/shipping26.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 13', category: 'Shipping', image: require('../assets/images/shipping/shipping27.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 14', category: 'Shipping', image: require('../assets/images/shipping/shipping28.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 15', category: 'Shipping', image: require('../assets/images/shipping/shipping29.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 16', category: 'Shipping', image: require('../assets/images/shipping/shipping30.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 17', category: 'Shipping', image: require('../assets/images/shipping/shipping31.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 18', category: 'Shipping', image: require('../assets/images/shipping/shipping32.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 19', category: 'Shipping', image: require('../assets/images/shipping/shipping33.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 20', category: 'Shipping', image: require('../assets/images/shipping/shipping34.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 21', category: 'Shipping', image: require('../assets/images/shipping/shipping35.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 22', category: 'Shipping', image: require('../assets/images/shipping/shipping36.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 23', category: 'Shipping', image: require('../assets/images/shipping/shipping37.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 24', category: 'Shipping', image: require('../assets/images/shipping/shipping38.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 25', category: 'Shipping', image: require('../assets/images/shipping/shipping39.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 26', category: 'Shipping', image: require('../assets/images/shipping/shipping40.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 27', category: 'Shipping', image: require('../assets/images/shipping/shipping41.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 28', category: 'Shipping', image: require('../assets/images/shipping/shipping42.jpeg') },
    { id: `shp-${idx++}`, title: 'Shipment Photo 29', category: 'Shipping', image: require('../assets/images/shipping/shipping43.jpeg') },
  );

  return photos;
};

const PHOTOS = buildPhotos();

const CAT_COLORS = {
  Product: '#2196F3',
  Manufacturing: '#FF9800',
  'Mode of Action': '#9C27B0',
  'Client Visit': '#E65100',
  Shipping: '#00897B',
};

// ═══════════════════════════════════════════════════════════════
// SCREEN
// ═══════════════════════════════════════════════════════════════
const VideosScreen = ({ navigation }) => {
  const { width: winW } = useWindowDimensions();
  const COLS = 3;
  const THUMB_W = (winW - 48) / COLS;

  const [activeCategory, setActiveCategory] = useState('Product');
  const [viewerImage, setViewerImage] = useState(null);
  const [clientVisitFolder, setClientVisitFolder] = useState(null); // null = show folders, string = show that folder's images

  const filtered = useMemo(() => {
    // When inside a client visit folder, show that folder's images
    if (activeCategory === 'Client Visit' && clientVisitFolder) {
      const images = CLIENT_VISIT_IMAGES[clientVisitFolder] || [];
      const data = images.map((img, i) => ({
        id: `cvi-${clientVisitFolder}-${i}`,
        title: `${clientVisitFolder} (${i + 1})`,
        category: 'Client Visit',
        image: img,
      }));
      const remainder = data.length % COLS;
      if (remainder === 0) return data;
      const fillers = Array.from({ length: COLS - remainder }, (_, i) => ({
        id: `filler-${i}`,
        _filler: true,
      }));
      return [...data, ...fillers];
    }

    const data = activeCategory === 'All' ? PHOTOS : PHOTOS.filter(item => item.category === activeCategory);
    // Pad incomplete last row with invisible fillers so space-between doesn't leave gaps
    const remainder = data.length % COLS;
    if (remainder === 0) return data;
    const fillers = Array.from({ length: COLS - remainder }, (_, i) => ({
      id: `filler-${i}`,
      _filler: true,
    }));
    return [...data, ...fillers];
  }, [activeCategory, clientVisitFolder]);

  // Navigate to relevant page or open image viewer
  const handlePhotoPress = (item) => {
    // Client Visit folder — drill into it
    if (item._isFolder) {
      setClientVisitFolder(item._folderName);
      return;
    }
    if (item.productName) {
      const product = PRODUCTS.find(p => p.name === item.productName);
      if (product) {
        navigation.navigate('ProductDetail', { product });
        return;
      }
    }
    if (item.navTarget) {
      navigation.navigate(item.navTarget, item.navParams || {});
      return;
    }
    if (item.image) {
      setViewerImage(item.image);
    }
  };

  const thumbH = THUMB_W * 0.75;

  // ─── Photo Card ──────────────────────────────────────────────
  const renderPhoto = ({ item }) => {
    if (item._filler) return <View style={{ width: THUMB_W }} />;

    // Folder card for Client Visit
    if (item._isFolder) {
      return (
        <TouchableOpacity
          style={[styles.videoCard, { width: THUMB_W }]}
          activeOpacity={0.75}
          onPress={() => handlePhotoPress(item)}>
          <View style={[styles.thumbnail, { height: thumbH, backgroundColor: '#FFF3E0' }]}>
            {item.image ? (
              <Image source={item.image} style={[styles.photoImage, { opacity: 0.6 }]} resizeMode="cover" />
            ) : null}
            <View style={styles.folderOverlay}>
              <Icon name="folder" size={36} color="#E65100" />
            </View>
            <View style={styles.folderCountBadge}>
              <Text style={styles.folderCountText}>{item._folderCount}</Text>
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    }

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
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Gallery" subtitle={clientVisitFolder ? `${clientVisitFolder} — ${filtered.filter(i => !i._filler).length} photos` : `${filtered.filter(i => !i._filler).length} photos`} onBack={() => {
        if (clientVisitFolder) { setClientVisitFolder(null); }
        else { navigation.goBack(); }
      }} />

      {/* ═══ Category Filter ══════════════════════════════════ */}
      <View style={styles.catListWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            const label = cat === 'All' ? 'All Photos' : `${cat} Photos`;
            const color = CAT_COLORS[cat] || theme.colors.primary;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catTab, active && { backgroundColor: color, borderColor: color }]}
                onPress={() => { setActiveCategory(cat); setClientVisitFolder(null); }}
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
        renderItem={renderPhoto}
        keyExtractor={item => item.id}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={COLS > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="image-off-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No photos in this category</Text>
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

  // ─── Category Filter ──────────────────────────────────────────
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

  // ─── Folder Style ────────────────────────────────────────────
  folderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  folderCountBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: '#E65100',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  folderCountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // ─── Empty State ─────────────────────────────────────────────
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: theme.colors.textLight, marginTop: 12 },
});

export default VideosScreen;
