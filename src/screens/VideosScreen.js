import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { translateBioTerm } from '../i18n/bioTerms';
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
// Manufacturing and Client Visit are hidden for now - their data and
// assets are untouched; add them back here to restore the chips.
const CATEGORIES = ['Shipping'];

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
  // title = the source filename, shown as the caption under each photo.
  'Biotrop Shipment': [
    { image: require('../assets/images/shipping/biotrop01.jpeg'), title: "5 Ltr Carton Box" },
    { image: require('../assets/images/shipping/biotrop02.jpeg'), title: "5 ltr Container - Back" },
    { image: require('../assets/images/shipping/biotrop03.jpeg'), title: "5 ltr Container - Front" },
    { image: require('../assets/images/shipping/biotrop04.jpeg'), title: "5 ltr Container" },
    { image: require('../assets/images/shipping/biotrop05.jpeg'), title: "Container Label" },
    { image: require('../assets/images/shipping/biotrop06.jpeg'), title: "Container Leaflet" },
    { image: require('../assets/images/shipping/biotrop07.jpeg'), title: "IBC Barrel Loading - 1" },
    { image: require('../assets/images/shipping/biotrop08.jpeg'), title: "IBC Barrel Loading - 2" },
    { image: require('../assets/images/shipping/biotrop09.jpeg'), title: "IBC Barrel Loading - 3" },
    { image: require('../assets/images/shipping/biotrop10.jpeg'), title: "IBC Barrel Loading - 4" },
    { image: require('../assets/images/shipping/biotrop11.jpeg'), title: "Loading Picture - 1" },
    { image: require('../assets/images/shipping/biotrop12.jpeg'), title: "Loading Picture - 10" },
    { image: require('../assets/images/shipping/biotrop13.jpeg'), title: "Loading Picture - 11" },
    { image: require('../assets/images/shipping/biotrop14.jpeg'), title: "Loading Picture - 2" },
    { image: require('../assets/images/shipping/biotrop15.jpeg'), title: "Loading Picture - 3" },
    { image: require('../assets/images/shipping/biotrop16.jpeg'), title: "Loading Picture - 4" },
    { image: require('../assets/images/shipping/biotrop17.jpeg'), title: "Loading Picture - 5" },
    { image: require('../assets/images/shipping/biotrop18.jpeg'), title: "Loading Picture - 6" },
    { image: require('../assets/images/shipping/biotrop19.jpeg'), title: "Loading Picture - 7" },
    { image: require('../assets/images/shipping/biotrop20.jpeg'), title: "Loading Picture - 8" },
    { image: require('../assets/images/shipping/biotrop21.jpeg'), title: "Loading Picture - 9" },
    { image: require('../assets/images/shipping/biotrop22.jpeg'), title: "Pallet Arrangement - 1" },
    { image: require('../assets/images/shipping/biotrop23.jpeg'), title: "Pallet Arrangement - 2" },
    { image: require('../assets/images/shipping/biotrop24.jpeg'), title: "Pallet Arrangement - 3" },
  ],
  'Taneem Shipment': [
    { image: require('../assets/images/shipping/taneem01.jpeg'), title: "5 Ltr Box Stacking" },
    { image: require('../assets/images/shipping/taneem02.jpeg'), title: "5 Ltr Container Packing" },
    { image: require('../assets/images/shipping/taneem03.jpeg'), title: "5 Ltr Pallet Loading 1" },
    { image: require('../assets/images/shipping/taneem04.jpeg'), title: "5 Ltr Pallet Loading 2" },
    { image: require('../assets/images/shipping/taneem05.jpeg'), title: "5 Ltr Pallet Loading 3" },
    { image: require('../assets/images/shipping/taneem06.jpeg'), title: "5 Ltr Pallet Loading 4" },
    { image: require('../assets/images/shipping/taneem07.jpeg'), title: "5 Ltr Pallet Loading 5" },
    { image: require('../assets/images/shipping/taneem08.jpeg'), title: "5 Ltr Pallet Loading 6" },
    { image: require('../assets/images/shipping/taneem09.jpeg'), title: "Taneem - 5 Litre Label" },
    { image: require('../assets/images/shipping/taneem10.jpeg'), title: "Taneem - Outer Box Label" },
    { image: require('../assets/images/shipping/taneem11.jpeg'), title: "Taneem Back Label" },
    { image: require('../assets/images/shipping/taneem12.jpeg'), title: "Taneem Front Label" },
    { image: require('../assets/images/shipping/taneem13.jpeg'), title: "Taneem Leaflet" },
  ],
  'Nexxt Shipment': [
    { image: require('../assets/images/shipping/nexxt01.jpeg'), title: "1 Litre Container Stuffing" },
    { image: require('../assets/images/shipping/nexxt02.jpeg'), title: "1 Ltr Container Arrangement" },
    { image: require('../assets/images/shipping/nexxt03.jpeg'), title: "1 Ltr Pallet Loading" },
    { image: require('../assets/images/shipping/nexxt04.jpeg'), title: "Karanjada 1Ltr Container" },
    { image: require('../assets/images/shipping/nexxt05.jpeg'), title: "Karanjada Carton Box Label" },
    { image: require('../assets/images/shipping/nexxt06.jpeg'), title: "Karanjada product label" },
    { image: require('../assets/images/shipping/nexxt07.jpeg'), title: "Pallet Loading" },
    { image: require('../assets/images/shipping/nexxt08.jpeg'), title: "Proneem 1Ltr Container" },
    { image: require('../assets/images/shipping/nexxt09.jpeg'), title: "Proneem Carton Box Label" },
    { image: require('../assets/images/shipping/nexxt10.jpeg'), title: "Proneem product label" },
    { image: require('../assets/images/shipping/nexxt11.jpeg'), title: "Weed X 1Ltr Container" },
    { image: require('../assets/images/shipping/nexxt12.jpeg'), title: "Weedx Carton Box" },
    { image: require('../assets/images/shipping/nexxt13.jpeg'), title: "Weedx Cartoon Box Label" },
    { image: require('../assets/images/shipping/nexxt14.jpeg'), title: "Weedx Product Label" },
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
// Translate a gallery card title at render time. Photo titles are built
// once at module load (English); place names, client names, and product
// brand names inside them stay untranslated — only the descriptive part
// (Facility / Packing / Mode of Action / R&D Laboratory) is localised.
const translateGalleryTitle = (title) => {
  if (!title || typeof title !== 'string') return title;
  // Exact match first (Manufacturing Facility, R&D Laboratory, Shipment Photos…)
  const exact = translateBioTerm(title);
  if (exact !== title) return exact;
  // "<Place> Facility"  → "<Place> <厂区>"
  if (title.endsWith(' Facility')) {
    const place = title.slice(0, -' Facility'.length);
    return `${place} ${translateBioTerm('Facility')}`;
  }
  // "<Brand> Shipment"  → "<Brand> <发货>"
  if (title.endsWith(' Shipment')) {
    const brand = title.slice(0, -' Shipment'.length);
    return `${brand} ${translateBioTerm('Shipment')}`;
  }
  // "<Brand> Packing"   → "<Brand> <包装>"
  if (title.endsWith(' Packing')) {
    const brand = title.slice(0, -' Packing'.length);
    return `${brand} ${translateBioTerm('Packing')}`;
  }
  // "<Product> – Mode of Action"
  if (title.includes(' – Mode of Action')) {
    const product = title.replace(' – Mode of Action', '');
    return `${product} – ${translateBioTerm('Mode of Action')}`;
  }
  return title;
};

// Country tokens that appear inside client-visit folder names.
// Longest-first so "South Korea" is matched before "Korea".
const CLIENT_COUNTRIES = [
  'South Korea', 'Ecuador', 'Germany', 'Brazil', 'France',
  'Ghana', 'Kenya', 'Egypt', 'Turkey', 'UK',
];

const VideosScreen = ({ navigation }) => {
  const { t } = useTranslation();
  // Client folders are named "<Country> <Company>" or "<Company> <Country>".
  // Translate only the country token; company names stay as registered.
  const translateClientName = useCallback((name) => {
    if (!name || typeof name !== 'string') return name;
    for (const country of CLIENT_COUNTRIES) {
      if (name === country) return t(`gallery.countries.${country}`, country);
      if (name.startsWith(country + ' ') || name.endsWith(' ' + country)) {
        return name.replace(country, t(`gallery.countries.${country}`, country));
      }
    }
    return name;
  }, [t]);
  const { width: winW } = useWindowDimensions();
  const COLS = 3;
  const THUMB_W = (winW - 48) / COLS;

  const [activeCategory, setActiveCategory] = useState('Shipping');
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
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
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
      const factoryLabel = manufacturingFolder.charAt(0).toUpperCase() + manufacturingFolder.slice(1);
      const data = FACTORY_IMAGES[manufacturingFolder].map((img, i) => ({
        id: `fac-${manufacturingFolder}-${i}`,
        title: `${factoryLabel} Facility`,
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
        image: SHIPPING_FOLDERS[name][0]?.image,
        _isFolder: true,
        _isShipping: true,
        _folderName: name,
        _folderCount: SHIPPING_FOLDERS[name].length,
      }));
      return padWithFillers(data);
    }

    // Shipping > <folder> photos
    if (activeCategory === 'Shipping' && shippingFolder && SHIPPING_FOLDERS[shippingFolder]) {
      const data = SHIPPING_FOLDERS[shippingFolder].map((photo, i) => ({
        id: `shp-${shippingFolder}-${i}`,
        // Caption comes from the source filename, not the folder name.
        title: photo.title,
        category: 'Shipping',
        image: photo.image,
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
              <ExpoImage
                source={item.image}
                style={[styles.photoImage, { opacity: 0.6 }]}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={0}
                recyclingKey={item.id}
              />
            ) : null}
            <View style={styles.folderOverlay}>
              <Icon name="folder" size={36} color="#E65100" />
            </View>
            <View style={styles.folderCountBadge}>
              <Text style={styles.folderCountText}>{item._folderCount}</Text>
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>{translateClientName(translateGalleryTitle(item.title))}</Text>
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
          <ExpoImage
            source={item.image}
            style={styles.photoImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={item.id}
          />
        ) : (
          <Icon name={item.icon || 'image'} size={32} color={CAT_COLORS[item.category] || theme.colors.primary} />
        )}
        <View style={styles.photoBadge}>
          <Icon name="image" size={12} color="#FFF" />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{translateClientName(translateGalleryTitle(item.title))}</Text>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.gallery')}
        subtitle={(() => {
          const count = filtered.filter(i => !i._filler).length;
          const photosSuffix = t('gallery.headerPhotos', { count });
          if (clientYearFolder) return `${translateClientName(clientVisitFolder)} ${clientYearFolder} — ${photosSuffix}`;
          if (clientVisitFolder) return `${translateClientName(clientVisitFolder)} — ${photosSuffix}`;
          if (manufacturingFolder === 'factories') return t('gallery.headerFactoriesCount', { count });
          if (manufacturingFolder === 'lab') return t('gallery.headerLabPhotos', { count });
          if (manufacturingFolder) {
            const label = manufacturingFolder.charAt(0).toUpperCase() + manufacturingFolder.slice(1);
            return `${label} — ${photosSuffix}`;
          }
          if (shippingFolder) return `${translateGalleryTitle(shippingFolder)} — ${photosSuffix}`;
          return photosSuffix;
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
            const catKey = cat === 'Client Visit' ? 'clientVisit'
              : cat === 'All' ? 'all' : cat.toLowerCase();
            // Dedicated chip labels per language — concatenating a category with
            // a counter word produced broken grammar (e.g. "制造 张照片").
            const label = t(`gallery.chips.${catKey}`, `${cat} Photos`);
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
          // Large folders (Biotrop has 24 photos) mounted every tile at once.
          removeClippedSubviews
          initialNumToRender={9}
          maxToRenderPerBatch={9}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="image-off-outline" size={64} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>{t('gallery.empty')}</Text>
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
