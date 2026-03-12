import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import theme from '../constants/theme';
import {
  PRODUCTS,
  CATEGORIES,
  CATEGORY_INFO,
  getProductsByCategory,
  getStandaloneProducts,
  getPortfolioFamiliesByCategory,
  PORTFOLIO_FAMILIES,
} from '../constants/productData';
import { getCategoryColor, getFormulationColor } from '../utils/helpers';

const ProductsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { families, standalones } = useMemo(() => {
    let filteredFamilies = getPortfolioFamiliesByCategory(activeCategory);
    let filteredStandalones = getStandaloneProducts(activeCategory);

    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();

      // Filter families: match on family name, tagline, activeIngredient,
      // or any variant product name
      const matchedFamilyIds = new Set();
      filteredFamilies = filteredFamilies.filter(f => {
        const directMatch =
          f.name.toLowerCase().includes(q) ||
          f.tagline.toLowerCase().includes(q) ||
          f.activeIngredient.toLowerCase().includes(q);
        if (directMatch) {
          matchedFamilyIds.add(f.id);
          return true;
        }
        // Check if any variant product name matches
        const variantMatch = f.variantIds.some(vid => {
          const p = PRODUCTS.find(pr => pr.id === vid);
          return p && (
            p.name.toLowerCase().includes(q) ||
            p.activeIngredient.toLowerCase().includes(q) ||
            p.targetCrops.some(c => c.toLowerCase().includes(q))
          );
        });
        if (variantMatch) {
          matchedFamilyIds.add(f.id);
          return true;
        }
        return false;
      });

      // Filter standalones
      filteredStandalones = filteredStandalones.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.activeIngredient.toLowerCase().includes(q) ||
        p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
        (p.targets && p.targets.some(t =>
          (typeof t === 'string' ? t : '').toLowerCase().includes(q)
        ))
      );
    }

    return { families: filteredFamilies, standalones: filteredStandalones };
  }, [activeCategory, searchQuery]);

  const totalCount = families.length + standalones.length;

  const renderCategoryTab = ({ item }) => {
    const isActive = activeCategory === item;
    return (
      <TouchableOpacity
        style={[styles.catTab, isActive && styles.catTabActive]}
        onPress={() => setActiveCategory(item)}
        activeOpacity={0.7}>
        <Text style={[styles.catTabText, isActive && styles.catTabTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFamilyCard = ({ item }) => {
    const variantCount = item.variantIds.length;
    return (
      <TouchableOpacity
        style={[styles.familyCard, { borderLeftColor: item.color }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('PortfolioDetail', { family: item })}>
        <View style={styles.familyCardContent}>
          <View style={[styles.familyIconCircle, { backgroundColor: item.color + '15' }]}>
            <Icon name={item.icon} size={26} color={item.color} />
          </View>
          <View style={styles.familyInfo}>
            <Text style={styles.familyName}>{item.name}</Text>
            <Text style={styles.familyTagline} numberOfLines={1}>
              {item.tagline}
            </Text>
            <View style={styles.familyMeta}>
              <View style={[styles.variantBadge, { backgroundColor: item.color + '18' }]}>
                <Text style={[styles.variantBadgeText, { color: item.color }]}>
                  {variantCount} variant{variantCount !== 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.familyIngredient} numberOfLines={1}>
                {item.activeIngredient}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={22} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderStandaloneCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <View style={styles.productLeft}>
        <View style={[styles.productIcon, { backgroundColor: getCategoryColor(item.subcategory) + '15' }]}>
          <Icon name="leaf" size={24} color={getCategoryColor(item.subcategory)} />
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productIngredient} numberOfLines={1}>
          {item.activeIngredient}
        </Text>
        <View style={styles.productBadges}>
          <View style={[styles.badge, { backgroundColor: getCategoryColor(item.subcategory) + '18' }]}>
            <Text style={[styles.badgeText, { color: getCategoryColor(item.subcategory) }]}>
              {item.subcategory}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getFormulationColor(item.formulation) + '18' }]}>
            <Text style={[styles.badgeText, { color: getFormulationColor(item.formulation) }]}>
              {item.formulation}
            </Text>
          </View>
          {item.concentration && (
            <View style={[styles.badge, { backgroundColor: '#F5F5F5' }]}>
              <Text style={[styles.badgeText, { color: '#616161' }]}>
                {item.concentration}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Icon name="chevron-right" size={22} color={theme.colors.textLight} />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => {
    if (section.data.length === 0) return null;
    return (
      <View style={styles.sectionHeader}>
        <Icon name={section.icon} size={18} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionCountBadge}>
          <Text style={styles.sectionCountText}>{section.data.length}</Text>
        </View>
      </View>
    );
  };

  const sections = useMemo(() => {
    const result = [];
    if (families.length > 0) {
      result.push({
        title: 'Product Families',
        icon: 'package-variant',
        data: families,
        type: 'family',
      });
    }
    if (standalones.length > 0) {
      result.push({
        title: 'Individual Products',
        icon: 'leaf',
        data: standalones,
        type: 'standalone',
      });
    }
    return result;
  }, [families, standalones]);

  const renderItem = ({ item, section }) => {
    if (section.type === 'family') {
      return renderFamilyCard({ item });
    }
    return renderStandaloneCard({ item });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Products"
        subtitle={`${totalCount} item${totalCount !== 1 ? 's' : ''}`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, ingredients, crops..."
          onClear={() => setSearchQuery('')}
        />
      </View>

      {/* Category Filter Tabs */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryTab}
        keyExtractor={item => item}
        contentContainerStyle={styles.catList}
        style={styles.catListWrap}
      />

      {/* Product Sections */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || `item-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="magnify-close" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search or category
            </Text>
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
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Category Tabs
  catListWrap: {
    maxHeight: 56,
  },
  catList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  catTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  catTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  catTabTextActive: {
    color: '#FFF',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  sectionCountBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Section List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Portfolio Family Cards
  familyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  familyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  familyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  familyTagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  familyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  variantBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  variantBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  familyIngredient: {
    fontSize: 11,
    color: theme.colors.textLight,
    flex: 1,
  },

  // Standalone Product Cards
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  productLeft: {
    marginRight: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  productIngredient: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  productBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Empty State
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});

export default ProductsScreen;
