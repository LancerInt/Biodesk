import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const COLS = isTablet ? 3 : 2;
const THUMB_W = (width - 48) / COLS;

const VIDEO_CATEGORIES = ['All', 'Product Videos', 'Manufacturing', 'Mode of Action'];

const VIDEOS = [
  { id: 'v1', title: 'Ecoza Max – Product Overview', category: 'Product Videos', duration: '3:24', icon: 'leaf' },
  { id: 'v2', title: 'Mycova – How It Works', category: 'Mode of Action', duration: '4:12', icon: 'bacteria' },
  { id: 'v3', title: 'Wynn Platform – Fermentation Facility', category: 'Manufacturing', duration: '6:45', icon: 'factory' },
  { id: 'v4', title: 'IGreen NPK – Application Demo', category: 'Product Videos', duration: '2:58', icon: 'sprout' },
  { id: 'v5', title: 'Karyo Platform – Formulation Process', category: 'Manufacturing', duration: '5:30', icon: 'beaker' },
  { id: 'v6', title: 'MargoShine – Mode of Action', category: 'Mode of Action', duration: '3:15', icon: 'flask' },
  { id: 'v7', title: 'Biota-H – Root Disease Control', category: 'Product Videos', duration: '2:44', icon: 'bacteria' },
  { id: 'v8', title: 'Microvate Platform Overview', category: 'Manufacturing', duration: '7:10', icon: 'lightning-bolt' },
  { id: 'v9', title: 'Blooma – Seaweed Biostimulant', category: 'Product Videos', duration: '3:01', icon: 'waves' },
  { id: 'v10', title: 'Beauveria bassiana – Pest Infection', category: 'Mode of Action', duration: '4:55', icon: 'bacteria' },
  { id: 'v11', title: 'K-Guard – Nematode Control', category: 'Product Videos', duration: '2:33', icon: 'leaf' },
  { id: 'v12', title: 'Kriya Manufacturing Facility Tour', category: 'Manufacturing', duration: '9:20', icon: 'factory' },
];

const CAT_COLORS = {
  'Product Videos': '#2196F3',
  'Manufacturing': '#FF9800',
  'Mode of Action': '#9C27B0',
};

const VideosScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === activeCategory);

  const renderVideo = ({ item }) => (
    <TouchableOpacity
      style={[styles.videoCard, { width: THUMB_W }]}
      activeOpacity={0.75}
      onPress={() => Alert.alert(item.title, `Duration: ${item.duration}\nCategory: ${item.category}\n\nVideo player would launch here with the bundled video file.`)}>
      <View style={[styles.thumbnail, { backgroundColor: (CAT_COLORS[item.category] || '#455') + '15' }]}>
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

  return (
    <View style={styles.container}>
      <Header title="Videos" subtitle={`${filtered.length} videos`} onBack={() => navigation.goBack()} />

      <FlatList
        data={VIDEO_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catTab, activeCategory === item && styles.catTabActive]}
            onPress={() => setActiveCategory(item)}>
            <Text style={[styles.catTabText, activeCategory === item && styles.catTabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={i => i}
        contentContainerStyle={styles.catList}
        style={styles.catListWrap}
      />

      <View style={styles.mediaBanner}>
        <Icon name="download-circle-outline" size={18} color={theme.colors.secondary} />
        <Text style={styles.mediaBannerText}>Download media packs from Sync & Backup for offline video playback</Text>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderVideo}
        keyExtractor={item => item.id}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={COLS > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  catListWrap: { maxHeight: 56 },
  catList: { paddingHorizontal: 16, paddingVertical: 10 },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catTabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  catTabText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  catTabTextActive: { color: '#FFF' },
  mediaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary + '12',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  mediaBannerText: { flex: 1, fontSize: 12, color: theme.colors.secondary, fontWeight: '500' },
  grid: { padding: 12, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  videoCard: { marginBottom: 14, borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFF', ...theme.shadows.sm },
  thumbnail: {
    height: THUMB_W * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
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
  videoInfo: { padding: 8 },
  videoTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.text, lineHeight: 18 },
  catBadge: { marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  catText: { fontSize: 10, fontWeight: '600' },
});

export default VideosScreen;
