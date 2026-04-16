import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import theme from '../constants/theme';
import {
  EXCEL_CATEGORIES,
  EXCEL_CATEGORY_INFO,
  getProductsByExcelCategory,
  groupProductsByExcelCategory,
} from '../constants/productData';
import { getFormulationColor } from '../utils/helpers';
import { getHeroImage } from '../constants/productImages';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

// ═══════════════════════════════════════════════════════════════
// PRODUCTS SCREEN
// Category-based listing from Excel "List of Products"
// ═══════════════════════════════════════════════════════════════

const ProductsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Filtered + grouped data ─────────────────────────────────
  const sections = useMemo(() => {
    let products = getProductsByExcelCategory(activeCategory);

    // Apply search filter
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.activeIngredient.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
        (p.targets && p.targets.some(t =>
          (typeof t === 'string' ? t : '').toLowerCase().includes(q)
        ))
      );
    }

    // Group by Excel category (preserves grouping even with search)
    return groupProductsByExcelCategory(products);
  }, [activeCategory, searchQuery]);

  const totalCount = sections.reduce((sum, s) => sum + s.data.length, 0);

  // ─── Filter chips ────────────────────────────────────────────
  const renderCategoryChip = (item) => {
    const isActive = activeCategory === item;
    const info = EXCEL_CATEGORY_INFO[item];
    const chipColor = info?.color || theme.colors.primary;
    return (
      <TouchableOpacity
        key={item}
        style={[styles.chip, isActive && { backgroundColor: chipColor, borderColor: chipColor }]}
        onPress={() => setActiveCategory(item)}
        activeOpacity={0.7}>
        {isActive && info?.icon ? (
          <Icon name={info.icon} size={14} color="#FFF" style={{ marginRight: 5 }} />
        ) : null}
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── Section header ──────────────────────────────────────────
  const renderSectionHeader = ({ section }) => {
    if (section.data.length === 0) return null;
    const catColor = section.color;
    return (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconCircle, { backgroundColor: catColor + '14' }]}>
          <Icon name={section.icon} size={16} color={catColor} />
        </View>
        <Text style={[styles.sectionTitle, { color: catColor }]}>{section.title}</Text>
        <View style={[styles.sectionCount, { backgroundColor: catColor + '14' }]}>
          <Text style={[styles.sectionCountText, { color: catColor }]}>
            {section.data.length}
          </Text>
        </View>
      </View>
    );
  };

  // ─── Product card ────────────────────────────────────────────
  const renderProductCard = ({ item, section }) => {
    const catColor = section.color;
    const formColor = getFormulationColor(item.formulation);
    const heroImg = getHeroImage(item.name);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        {/* Left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: catColor }]} />

        <View style={styles.cardBody}>
          {/* Product image or fallback icon */}
          {heroImg ? (
            <View style={styles.cardImageWrap}>
              <Image source={heroImg} style={styles.cardImage} contentFit="contain" transition={150} />
            </View>
          ) : (
            <View style={[styles.cardIcon, { backgroundColor: catColor + '10' }]}>
              <Icon name={section.icon} size={22} color={catColor} />
            </View>
          )}

          {/* Info */}
          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.tmSymbol}>{'\u2122'}</Text>
            </View>
            <Text style={[styles.cardIngredient, item.subcategory === 'Microbial Pesticide' && { fontStyle: 'italic', fontFamily: Platform.OS === 'android' ? 'serif' : undefined }]} numberOfLines={1}>
              {item.activeIngredient}
            </Text>
          </View>

          {/* Arrow */}
          <Icon name="chevron-right" size={20} color="#BDBDBD" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Products"
        subtitle={`${totalCount} product${totalCount !== 1 ? 's' : ''}`}
        onBack={() => navigation.goBack()}
      />

      {/* Search + Filter */}
      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, ingredients, crops..."
          onClear={() => setSearchQuery('')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipBar}>
          {EXCEL_CATEGORIES.map(cat => renderCategoryChip(cat))}
        </ScrollView>
      </View>

      {/* Product Sections */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="magnify-close" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES — Premium Notion/Linear inspired
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  // ─── Filter Section ────────────────────────────────────────
  filterSection: {
    backgroundColor: '#FFF',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  chipBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 18 : 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },

  // ─── Section Headers ───────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  sectionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 10,
    flex: 1,
  },
  sectionCount: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ─── Product List ──────────────────────────────────────────
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // ─── Product Card ──────────────────────────────────────────
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...theme.shadows.sm,
  },
  cardAccent: {
    width: 3.5,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 14,
  },
  cardImageWrap: {
    width: 85,
    height: 85,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  cardImage: {
    width: 81,
    height: 81,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: isTablet ? 17 : 15.5,
    fontWeight: '700',
    color: '#1B1B1B',
    letterSpacing: -0.2,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tmSymbol: { fontSize: 8, fontWeight: '400', marginTop: 2 },
  cardIngredient: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
    lineHeight: 18,
  },
  cardIngredientMicrobial: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
    lineHeight: 18,
    fontStyle: 'italic',
    ...(Platform.OS === 'android' && { fontFamily: 'sans-serif' }),
  },
  cardBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ─── Empty State ───────────────────────────────────────────
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});

export default ProductsScreen;
