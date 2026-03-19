import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import theme from '../constants/theme';
import { PRODUCTS } from '../constants/productData';
import { getAllDocuments, getProductDocuments } from '../constants/documentData';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const DOC_TYPES = ['All', 'Presentation', 'Brochure', 'COA', 'TDS', 'Label', 'SDS/MSDS'];

const DOC_META = {
  Presentation: { icon: 'file-presentation-box', color: '#FF9800', label: 'Company Presentation' },
  Brochure: { icon: 'file-presentation-box', color: '#FF9800', label: 'Product Brochure' },
  COA: { icon: 'file-certificate', color: '#4CAF50', label: 'Certificate of Analysis' },
  TDS: { icon: 'file-document-outline', color: '#2196F3', label: 'Technical Data Sheet' },
  Label: { icon: 'label', color: '#9C27B0', label: 'Product Label' },
  'SDS/MSDS': { icon: 'file-alert', color: '#F44336', label: 'Safety Data Sheet' },
};

// ─── Presentations (add more entries here for multiple presentations) ────
const PRESENTATIONS = [
  {
    id: 'pres-1',
    productName: 'Kriya Biosys',
    docType: 'Presentation',
    hasAsset: true,
    asset: require('../assets/documents/KriyaPresentation.pdf'),
    title: 'Kriya Presentation',
    subtitle: 'Company Overview & Product Portfolio',
  },
  {
    id: 'pres-2',
    productName: 'Kriya Biosys',
    docType: 'Presentation',
    hasAsset: true,
    asset: require('../assets/documents/KriyaPresentation_v4.pdf'),
    title: 'Kriya Presentation v4',
    subtitle: 'Updated Company Overview & Portfolio',
  },
  {
    id: 'pres-3',
    productName: 'Kriya Biosys',
    docType: 'Presentation',
    hasAsset: true,
    asset: require('../assets/documents/MicrobialTechnology.pdf'),
    title: 'Microbial Products & Manufacturing',
    subtitle: 'Advanced Microbial Solutions & Technology Platforms',
  },
  {
    id: 'pres-4',
    productName: 'Kriya Biosys',
    docType: 'Presentation',
    hasAsset: true,
    asset: require('../assets/documents/Ag Nova.pdf'),
    title: 'Kriya AgNova',
    subtitle: 'AgNova Technology & Innovation Platform',
  },
];

// Real MSDS/COA documents from bundled PDFs
const REAL_DOCS = getAllDocuments();

// Build full doc list from real files + placeholders
const buildDocList = () => {
  const docs = [];

  // Add presentations
  PRESENTATIONS.forEach(pres => {
    docs.push({ ...pres, category: 'Presentation' });
  });

  // Add real Brochure, COA and MSDS documents
  REAL_DOCS.forEach(doc => {
    const product = PRODUCTS.find(p => p.name === doc.productName);
    docs.push({
      ...doc,
      category: product?.category || '',
      hasAsset: true,
    });
  });

  // Add placeholder entries for doc types without real files yet
  PRODUCTS.forEach(p => {
    ['Label'].forEach(type => {
      docs.push({
        id: `${p.id}-${type}`,
        productName: p.name,
        category: p.category,
        docType: type,
        hasAsset: false,
        asset: null,
      });
    });
  });

  return docs;
};

const ALL_DOCS = buildDocList();

const DocumentsScreen = ({ navigation }) => {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let docs = activeType === 'All' ? ALL_DOCS : ALL_DOCS.filter(d => d.docType === activeType);
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(d =>
        d.productName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.title && d.title.toLowerCase().includes(q))
      );
    }
    return docs;
  }, [activeType, searchQuery]);

  const openDocument = (item) => {
    if (!item.hasAsset) return;

    // Presentations open in the fullscreen slide viewer
    if (item.docType === 'Presentation') {
      navigation.navigate('PresentationViewer', {
        title: item.title || item.productName,
        asset: item.asset,
      });
      return;
    }

    navigation.navigate('CertificateViewer', {
      certName: `${item.productName} - ${item.docType === 'SDS/MSDS' ? 'MSDS' : item.docType}`,
      authority: DOC_META[item.docType]?.label || item.docType,
      asset: item.asset,
    });
  };

  const renderChip = (type) => {
    const isActive = activeType === type;
    const meta = DOC_META[type];
    return (
      <TouchableOpacity
        key={type}
        style={[styles.chipPill, isActive && styles.chipPillActive]}
        onPress={() => setActiveType(type)}
        activeOpacity={0.7}>
        {isActive && meta?.icon ? (
          <Icon name={meta.icon} size={14} color="#FFF" style={{ marginRight: 5 }} />
        ) : null}
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDoc = ({ item }) => {
    const meta = DOC_META[item.docType];

    // Presentation card — special style with fullscreen button
    if (item.docType === 'Presentation') {
      return (
        <TouchableOpacity
          style={styles.presCard}
          activeOpacity={0.7}
          onPress={() => openDocument(item)}>
          <View style={styles.presAccent} />
          <View style={styles.presContent}>
            <View style={styles.presTop}>
              <View style={[styles.presIcon, { backgroundColor: '#FF9800' + '15' }]}>
                <Icon name="file-presentation-box" size={28} color="#FF9800" />
              </View>
              <View style={styles.presInfo}>
                <Text style={styles.presName}>{item.title || item.productName}</Text>
                {item.subtitle ? (
                  <Text style={styles.presSubtitle}>{item.subtitle}</Text>
                ) : null}
                <View style={styles.offlineBadge}>
                  <Icon name="check-circle" size={12} color={theme.colors.success} />
                  <Text style={styles.offlineText}>Offline</Text>
                </View>
              </View>
            </View>
            <View style={styles.presActions}>
              <View style={styles.presFullscreenBtn}>
                <Icon name="fullscreen" size={18} color="#FFF" />
                <Text style={styles.presFullscreenText}>Full Screen</Text>
              </View>
              <View style={styles.presSlideBadge}>
                <Icon name="gesture-swipe-horizontal" size={14} color={theme.colors.textLight} />
                <Text style={styles.presSlideText}>Swipe to navigate</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.docCard, !item.hasAsset && styles.docCardDisabled]}
        activeOpacity={item.hasAsset ? 0.7 : 1}
        onPress={() => openDocument(item)}>
        <View style={[styles.docIcon, { backgroundColor: meta.color + '12' }]}>
          <Icon name={meta.icon} size={24} color={meta.color} />
        </View>
        <View style={styles.docInfo}>
          <Text style={styles.docName}>{item.productName}</Text>
          <Text style={styles.docType}>{meta.label}</Text>
          <View style={styles.docMeta}>
            {item.hasAsset ? (
              <View style={styles.offlineBadge}>
                <Icon name="check-circle" size={12} color={theme.colors.success} />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            ) : (
              <View style={styles.offlineBadge}>
                <Icon name="clock-outline" size={12} color={theme.colors.textLight} />
                <Text style={[styles.offlineText, { color: theme.colors.textLight }]}>Pending</Text>
              </View>
            )}
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={item.hasAsset ? theme.colors.textLight : theme.colors.border} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Documents" subtitle={`${filtered.length} files`} onBack={() => navigation.goBack()} />

      {/* Search + Filter Bar */}
      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search documents..."
          onClear={() => setSearchQuery('')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipBar}>
          {DOC_TYPES.map(type => renderChip(type))}
        </ScrollView>
      </View>

      {/* Document List */}
      <FlatList
        data={filtered}
        renderItem={renderDoc}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="file-search-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No documents found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ─── Filter Section ─────────────────────────────────────────
  filterSection: {
    backgroundColor: '#FFF',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  chipBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 8,
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },

  // ─── Presentation Card ────────────────────────────────────────
  presCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    ...theme.shadows.md,
  },
  presAccent: {
    height: 3,
    backgroundColor: '#FF9800',
  },
  presContent: {
    padding: isTablet ? 18 : 16,
  },
  presTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presIcon: {
    width: isTablet ? 56 : 50,
    height: isTablet ? 56 : 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  presInfo: {
    flex: 1,
  },
  presName: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  presSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  presActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  presFullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  presFullscreenText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  presSlideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  presSlideText: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },

  // ─── Document List ──────────────────────────────────────────
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: isTablet ? 16 : 14,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  docCardDisabled: {
    opacity: 0.5,
  },
  docIcon: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  docType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  offlineText: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 11,
    color: theme.colors.textLight,
  },

  // ─── Empty State ────────────────────────────────────────────
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 12,
  },
});

export default DocumentsScreen;
