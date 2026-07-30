import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { PRODUCTS } from '../constants/productData';
import { getHeroImage, getMoaImage } from '../constants/productImages';
import CLIENT_VISIT_IMAGES from '../constants/clientVisitImages';
import FACTORY_IMAGES from '../constants/factoryImages';
import LAB_IMAGES from '../constants/labImages';

// ═══════════════════════════════════════════════════════════════
// MEDIA DATA
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = ['Manufacturing', 'Client Visit', 'Shipping'];

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
    { id: `mfg-${idx++}`, title: 'Manufacturing Facility', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/manufacturing.jpeg'), _isFolder: true, _isManufacturing: true, _folderName: 'factories', _folderCount: Object.keys(FACTORY_IMAGES).length },
    { id: `mfg-${idx++}`, title: 'R&D Laboratory', category: 'Manufacturing', image: require('../assets/images/KriyaProfile/rnd.jpeg'), _isFolder: true, _isLab: true, _folderName: 'lab', _folderCount: LAB_IMAGES.length },
  );

  // Client Visit — folder entries (one per client). Some clients use a
  // nested { year: images[] } shape; flatten for cover image / count.
  Object.entries(CLIENT_VISIT_IMAGES).forEach(([clientName, entry]) => {
    const isNested = entry && !Array.isArray(entry) && typeof entry === 'object';
    const allImages = isNested ? Object.values(entry).flat() : entry;
    photos.push({
      id: `cvf-${idx++}`,
      title: clientName,
      category: 'Client Visit',
      image: allImages[0],
      _isFolder: true,
      _folderName: clientName,
      _folderCount: isNested ? Object.keys(entry).length : allImages.length,
      _isNestedClient: isNested,
    });
  });

  return photos;
};

// ─── Shipping sub-folders (drill-down from "Shipping Photos" chip) ─
const SHIPPING_FOLDERS = {
  'BioTrop Packing': [
    require('../assets/images/shipping/shipping06.jpeg'),
    require('../assets/images/shipping/shipping07.jpeg'),
    require('../assets/images/shipping/shipping08.jpeg'),
    require('../assets/images/shipping/shipping09.jpeg'),
    require('../assets/images/shipping/shipping10.jpeg'),
    require('../assets/images/shipping/shipping11.jpeg'),
  ],
  'Esnad Packing': [
    require('../assets/images/shipping/shipping12.jpeg'),
    require('../assets/images/shipping/shipping13.jpeg'),
    require('../assets/images/shipping/shipping14.jpeg'),
  ],
  'Shipment Photos': [
    require('../assets/images/shipping/shipping01.jpeg'),
    require('../assets/images/shipping/shipping02.jpeg'),
    require('../assets/images/shipping/shipping03.jpeg'),
    require('../assets/images/shipping/shipping04.jpeg'),
    require('../assets/images/shipping/shipping05.jpeg'),
    require('../assets/images/shipping/shipping15.jpeg'),
    require('../assets/images/shipping/shipping16.jpeg'),
    require('../assets/images/shipping/shipping17.jpeg'),
    require('../assets/images/shipping/shipping18.jpeg'),
    require('../assets/images/shipping/shipping19.jpeg'),
    require('../assets/images/shipping/shipping20.jpeg'),
    require('../assets/images/shipping/shipping21.jpeg'),
    require('../assets/images/shipping/shipping22.jpeg'),
    require('../assets/images/shipping/shipping23.jpeg'),
    require('../assets/images/shipping/shipping24.jpeg'),
    require('../assets/images/shipping/shipping25.jpeg'),
    require('../assets/images/shipping/shipping26.jpeg'),
    require('../assets/images/shipping/shipping27.jpeg'),
    require('../assets/images/shipping/shipping28.jpeg'),
    require('../assets/images/shipping/shipping29.jpeg'),
    require('../assets/images/shipping/shipping30.jpeg'),
    require('../assets/images/shipping/shipping31.jpeg'),
    require('../assets/images/shipping/shipping32.jpeg'),
    require('../assets/images/shipping/shipping33.jpeg'),
    require('../assets/images/shipping/shipping34.jpeg'),
    require('../assets/images/shipping/shipping35.jpeg'),
    require('../assets/images/shipping/shipping36.jpeg'),
    require('../assets/images/shipping/shipping37.jpeg'),
    require('../assets/images/shipping/shipping38.jpeg'),
    require('../assets/images/shipping/shipping39.jpeg'),
    require('../assets/images/shipping/shipping40.jpeg'),
    require('../assets/images/shipping/shipping41.jpeg'),
    require('../assets/images/shipping/shipping42.jpeg'),
    require('../assets/images/shipping/shipping43.jpeg'),
  ],
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

  const [activeCategory, setActiveCategory] = useState('Manufacturing');
  const [viewerImage, setViewerImage] = useState(null);
  const [clientVisitFolder, setClientVisitFolder] = useState(null); // null = show folders, string = show that folder's images
  // Manufacturing drill-down:
  //   null            -> top-level Manufacturing grid (3 cards)
  //   'factories'     -> show factory folder cards (SEP + TVP)
  //   <factory-slug>  -> show that factory's images
  const [manufacturingFolder, setManufacturingFolder] = useState(null);
  // Shipping drill-down: null -> show folder tiles, string -> that folder's photos
  const [shippingFolder, setShippingFolder] = useState(null);
  // Optional 3rd level for client visits that have year sub-folders (e.g. Glover Ghana)
  const [clientYearFolder, setClientYearFolder] = useState(null);

  const padWithFillers = (data) => {
    const remainder = data.length % COLS;
    if (remainder === 0) return data;
    const fillers = Array.from({ length: COLS - remainder }, (_, i) => ({
      id: `filler-${i}`,
      _filler: true,
    }));
    return [...data, ...fillers];
  };

  const filtered = useMemo(() => {
    // When inside a client visit folder
    if (activeCategory === 'Client Visit' && clientVisitFolder) {
      const entry = CLIENT_VISIT_IMAGES[clientVisitFolder];

      // Nested object → first show year sub-folder tiles, then photos for the picked year
      if (entry && !Array.isArray(entry) && typeof entry === 'object') {
        if (!clientYearFolder) {
          const data = Object.keys(entry).map((year) => ({
            id: `cv-year-${clientVisitFolder}-${year}`,
            title: year,
            category: 'Client Visit',
            image: entry[year][0],
            _isFolder: true,
            _isClientYear: true,
            _folderName: year,
            _folderCount: entry[year].length,
          }));
          return padWithFillers(data);
        }
        const images = entry[clientYearFolder] || [];
        const data = images.map((img, i) => ({
          id: `cvi-${clientVisitFolder}-${clientYearFolder}-${i}`,
          title: `${clientVisitFolder} ${clientYearFolder}`,
          category: 'Client Visit',
          image: img,
        }));
        return padWithFillers(data);
      }

      // Flat array → just show the photos
      const images = Array.isArray(entry) ? entry : [];
      const data = images.map((img, i) => ({
        id: `cvi-${clientVisitFolder}-${i}`,
        title: clientVisitFolder,
        category: 'Client Visit',
        image: img,
      }));
      return padWithFillers(data);
    }

    // Manufacturing > Manufacturing Facility > factory selector
    if (activeCategory === 'Manufacturing' && manufacturingFolder === 'factories') {
      const data = Object.keys(FACTORY_IMAGES).map((slug) => ({
        id: `factory-folder-${slug}`,
        title: slug,
        category: 'Manufacturing',
        image: FACTORY_IMAGES[slug][0],
        _isFolder: true,
        _isFactory: true,
        _folderName: slug,
        _folderCount: FACTORY_IMAGES[slug].length,
      }));
      return padWithFillers(data);
    }

    // Manufacturing > Manufacturing Facility > <factory> photos
    if (activeCategory === 'Manufacturing' && manufacturingFolder && FACTORY_IMAGES[manufacturingFolder]) {
      const data = FACTORY_IMAGES[manufacturingFolder].map((img, i) => ({
        id: `fac-${manufacturingFolder}-${i}`,
        title: `${manufacturingFolder} Facility`,
        category: 'Manufacturing',
        image: img,
      }));
      return padWithFillers(data);
    }

    // Manufacturing > R&D Laboratory photos
    if (activeCategory === 'Manufacturing' && manufacturingFolder === 'lab') {
      const data = LAB_IMAGES.map((img, i) => ({
        id: `lab-${i}`,
        title: 'R&D Laboratory',
        category: 'Manufacturing',
        image: img,
      }));
      return padWithFillers(data);
    }

    // Shipping > folder selector
    if (activeCategory === 'Shipping' && !shippingFolder) {
      const data = Object.keys(SHIPPING_FOLDERS).map((name) => ({
        id: `shipping-folder-${name}`,
        title: name,
        category: 'Shipping',
        image: SHIPPING_FOLDERS[name][0],
        _isFolder: true,
        _isShipping: true,
        _folderName: name,
        _folderCount: SHIPPING_FOLDERS[name].length,
      }));
      return padWithFillers(data);
    }

    // Shipping > <folder> photos
    if (activeCategory === 'Shipping' && shippingFolder && SHIPPING_FOLDERS[shippingFolder]) {
      const data = SHIPPING_FOLDERS[shippingFolder].map((img, i) => ({
        id: `shp-${shippingFolder}-${i}`,
        title: shippingFolder,
        category: 'Shipping',
        image: img,
      }));
      return padWithFillers(data);
    }

    const data = activeCategory === 'All' ? PHOTOS : PHOTOS.filter(item => item.category === activeCategory);
    return padWithFillers(data);
  }, [activeCategory, clientVisitFolder, clientYearFolder, manufacturingFolder, shippingFolder]);

  // Navigate to relevant page or open image viewer
  const handlePhotoPress = (item) => {
    // Manufacturing Facility tile -> show factory selector
    if (item._isManufacturing && item._isFolder) {
      setManufacturingFolder('factories');
      return;
    }
    // Factory folder tile -> show that factory's photos
    if (item._isFactory && item._isFolder) {
      setManufacturingFolder(item._folderName);
      return;
    }
    // R&D Laboratory tile -> show all lab photos
    if (item._isLab && item._isFolder) {
      setManufacturingFolder('lab');
      return;
    }
    // Shipping folder tile -> drill into it
    if (item._isShipping && item._isFolder) {
      setShippingFolder(item._folderName);
      return;
    }
    // Client visit year folder (e.g. Glover Ghana > 2025/2026)
    if (item._isClientYear && item._isFolder) {
      setClientYearFolder(item._folderName);
      return;
    }
    // Client Visit folder — drill into it (reset any prior year-folder selection)
    if (item._isFolder) {
      setClientVisitFolder(item._folderName);
      setClientYearFolder(null);
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
          <Image source={item.image} style={styles.photoImage} resizeMode="cover" />
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
      <Header
        title="Gallery"
        subtitle={(() => {
          const count = filtered.filter(i => !i._filler).length;
          if (clientYearFolder) return `${clientVisitFolder} ${clientYearFolder} — ${count} photos`;
          if (clientVisitFolder) return `${clientVisitFolder} — ${count} ${count === 1 ? 'item' : 'photos'}`;
          if (manufacturingFolder === 'factories') return `Manufacturing Facility — ${count} factories`;
          if (manufacturingFolder === 'lab') return `R&D Laboratory — ${count} photos`;
          if (manufacturingFolder) return `${manufacturingFolder} — ${count} photos`;
          if (shippingFolder) return `${shippingFolder} — ${count} photos`;
          return `${count} photos`;
        })()}
        onBack={() => {
          if (clientYearFolder) {
            setClientYearFolder(null);
          } else if (shippingFolder) {
            setShippingFolder(null);
          } else if (manufacturingFolder === 'lab') {
            setManufacturingFolder(null);
          } else if (manufacturingFolder && manufacturingFolder !== 'factories') {
            setManufacturingFolder('factories');
          } else if (manufacturingFolder === 'factories') {
            setManufacturingFolder(null);
          } else if (clientVisitFolder) {
            setClientVisitFolder(null);
          } else {
            navigation.goBack();
          }
        }}
      />

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
                onPress={() => { setActiveCategory(cat); setClientVisitFolder(null); setClientYearFolder(null); setManufacturingFolder(null); setShippingFolder(null); }}
                activeOpacity={0.7}>
                <Text style={[styles.catTabText, active && styles.catTabTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ═══ Media Grid ════════════════════════════════════════ */}
      <Animated.View
        key={`${activeCategory}-${clientVisitFolder || ''}-${clientYearFolder || ''}-${manufacturingFolder || ''}-${shippingFolder || ''}`}
        entering={FadeIn.duration(220)}
        style={{ flex: 1 }}>
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
      </Animated.View>
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
