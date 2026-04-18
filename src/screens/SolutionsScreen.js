import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import {
  getCrops, getGrowthStages, getCategories, getAbioticStresses,
  getBrowseSections, getProblemSections,
  matchRecommendations, searchAll,
} from '../utils/recommendationEngine';

// ═══════════════════════════════════════════════════════════════
// VIEW STATES
// ═══════════════════════════════════════════════════════════════
const VIEW = { LANDING: 'LANDING', BROWSE: 'BROWSE', RESULTS: 'RESULTS' };

// Icons for problem sub-sections
const PROBLEM_ICONS = {
  pests: 'bug',
  diseases: 'virus',
  nutrientDeficiencies: 'flask-empty',
  weeds: 'grass',
  abioticStresses: 'weather-sunny-alert',
};

const SolutionsScreen = ({ navigation }) => {
  const [view, setView] = useState(VIEW.LANDING);
  const [browseSection, setBrowseSection] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  // ─── Data ────────────────────────────────────────────────────
  const browseSections = useMemo(() => getBrowseSections(), []);
  const problemSections = useMemo(() => getProblemSections(), []);
  const crops = useMemo(() => getCrops(), []);
  const growthStages = useMemo(() => getGrowthStages(), []);
  const abioticStresses = useMemo(() => getAbioticStresses(), []);
  const categories = useMemo(() => getCategories(), []);

  // ─── Search ──────────────────────────────────────────────────
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchAll(searchQuery);
  }, [searchQuery]);

  // ─── Matched Recommendations ─────────────────────────────────
  const results = useMemo(() => {
    if (view !== VIEW.RESULTS) return { primary: [], secondary: [] };
    return matchRecommendations(filters);
  }, [view, filters]);

  // ─── Navigation helpers ──────────────────────────────────────
  const goBack = () => {
    if (view === VIEW.RESULTS) {
      setView(VIEW.BROWSE);
      setFilters({});
    } else if (view === VIEW.BROWSE) {
      setView(VIEW.LANDING);
      setBrowseSection(null);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  const selectItem = (filterKey, id, label) => {
    setFilters({ [filterKey]: [id] });
    setSelectedLabel(label);
    setView(VIEW.RESULTS);
  };

  const handleSearchSelect = (result) => {
    const typeMap = {
      crop: 'cropIds',
      pest: 'pestIds',
      disease: 'diseaseIds',
      nutrientDeficiency: 'nutrientDeficiencyIds',
      growthStage: 'growthStageIds',
      weed: 'weedIds',
      abioticStress: 'abioticStressIds',
    };
    const key = typeMap[result.type];
    if (key) {
      selectItem(key, result.item.id, result.item.name);
    }
  };

  // ─── Header title ────────────────────────────────────────────
  const headerTitle = view === VIEW.LANDING
    ? 'Solutions'
    : view === VIEW.BROWSE
      ? browseSection?.title || 'Browse'
      : selectedLabel || 'Recommendations';

  // ═══════════════════════════════════════════════════════════════
  // LANDING VIEW
  // ═══════════════════════════════════════════════════════════════
  const renderLanding = () => (
    <ScrollView contentContainerStyle={styles.landingContent} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Icon name="magnify" size={20} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops, pests, diseases..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {searchQuery.length >= 2 && searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.slice(0, 8).map((r, i) => (
            <TouchableOpacity
              key={`${r.type}-${r.item.id}-${i}`}
              style={styles.searchResultItem}
              onPress={() => handleSearchSelect(r)}>
              <Icon name={getSearchIcon(r.type)} size={18} color={theme.colors.primary} />
              <View style={styles.searchResultText}>
                <Text style={styles.searchResultName}>{r.item.name || r.item.brandName}</Text>
                <Text style={styles.searchResultType}>{formatType(r.type)}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <View style={styles.noResults}>
          <Icon name="magnify-close" size={32} color={theme.colors.textLight} />
          <Text style={styles.noResultsText}>No matches found</Text>
        </View>
      )}

      {/* Browse Sections */}
      {searchQuery.length < 2 && (
        <>
          <Text style={styles.sectionTitle}>Browse by</Text>
          <View style={styles.browseGrid}>
            {browseSections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[styles.browseCard, { borderLeftColor: section.color }]}
                activeOpacity={0.7}
                onPress={() => { setBrowseSection(section); setView(VIEW.BROWSE); }}>
                <View style={[styles.browseIconCircle, { backgroundColor: section.color + '15' }]}>
                  <Icon name={section.icon} size={28} color={section.color} />
                </View>
                <Text style={styles.browseTitle}>{section.title}</Text>
                <Text style={styles.browseCount}>{section.count} items</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );

  // ═══════════════════════════════════════════════════════════════
  // BROWSE VIEW
  // ═══════════════════════════════════════════════════════════════
  const renderBrowse = () => {
    if (!browseSection) return null;
    switch (browseSection.id) {
      case 'crop': return renderItemGrid(crops, 'cropIds', 'sprout');
      case 'problem': return renderProblemBrowse();
      case 'growthStage': return renderItemGrid(growthStages, 'growthStageIds', 'flower');
      case 'stress': return renderItemGrid(abioticStresses, 'abioticStressIds', 'weather-sunny-alert');
      case 'category': return renderCategoryList();
      default: return null;
    }
  };

  const renderItemGrid = (items, filterKey, icon) => (
    <ScrollView contentContainerStyle={styles.itemGrid} showsVerticalScrollIndicator={false}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.itemCard}
          activeOpacity={0.7}
          onPress={() => selectItem(filterKey, item.id, item.name)}>
          <View style={[styles.itemIconWrap, { backgroundColor: browseSection.color + '12' }]}>
            <Icon name={icon} size={28} color={browseSection.color} />
          </View>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProblemBrowse = () => (
    <ScrollView contentContainerStyle={styles.problemBrowse} showsVerticalScrollIndicator={false}>
      {problemSections.map((section) => (
        <View key={section.id} style={styles.problemGroup}>
          <View style={styles.problemGroupHeader}>
            <Icon name={PROBLEM_ICONS[section.id] || 'alert'} size={20} color={theme.colors.error} />
            <Text style={styles.problemGroupTitle}>{section.title}</Text>
            <Text style={styles.problemGroupCount}>{section.data.length}</Text>
          </View>
          {section.data.map((item) => {
            const filterKey = section.id === 'pests' ? 'pestIds'
              : section.id === 'diseases' ? 'diseaseIds'
                : section.id === 'nutrientDeficiencies' ? 'nutrientDeficiencyIds'
                  : section.id === 'weeds' ? 'weedIds'
                    : 'abioticStressIds';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.problemItem}
                activeOpacity={0.7}
                onPress={() => selectItem(filterKey, item.id, item.name)}>
                <Text style={styles.problemItemName}>{item.name}</Text>
                <Icon name="chevron-right" size={18} color={theme.colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );

  const renderCategoryList = () => (
    <ScrollView contentContainerStyle={styles.categoryList} showsVerticalScrollIndicator={false}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.categoryCard}
          activeOpacity={0.7}
          onPress={() => selectItem('categoryIds', cat.id, cat.name)}>
          <View style={[styles.categoryIconWrap, { backgroundColor: (cat.color || '#7B1FA2') + '15' }]}>
            <Icon name="tag" size={22} color={cat.color || '#7B1FA2'} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{cat.name}</Text>
            {cat.description && (
              <Text style={styles.categoryDesc} numberOfLines={2}>{cat.description}</Text>
            )}
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // ═══════════════════════════════════════════════════════════════
  // RESULTS VIEW
  // ═══════════════════════════════════════════════════════════════
  const renderResults = () => {
    const { primary, secondary } = results;
    const hasResults = primary.length > 0 || secondary.length > 0;

    return (
      <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
        {/* Selected filter banner */}
        <View style={styles.filterBanner}>
          <Icon name="filter-variant" size={18} color={theme.colors.primary} />
          <Text style={styles.filterBannerText}>{selectedLabel}</Text>
        </View>

        {!hasResults && (
          <View style={styles.noResults}>
            <Icon name="flask-empty-outline" size={48} color={theme.colors.textLight} />
            <Text style={styles.noResultsTitle}>No recommendations found</Text>
            <Text style={styles.noResultsText}>Try browsing a different category</Text>
          </View>
        )}

        {/* Primary Recommendations (Packages) */}
        {primary.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Recommended Solutions</Text>
            {primary.map((r, i) => renderResultCard(r, i, true))}
          </View>
        )}

      </ScrollView>
    );
  };

  const renderResultCard = (r, index, isPrimary) => {
    const { recommendation: rec, type, resolved, crossSellProducts, upSellItems } = r;
    if (!resolved) return null;

    const isPackage = type === 'package';
    const name = isPackage ? resolved.name : resolved.brandName;
    const subtitle = isPackage ? resolved.objective : resolved.activeIngredient;
    const cardColor = isPrimary ? theme.colors.primary : theme.colors.secondary;

    return (
      <View key={`${rec.id}-${index}`} style={[styles.resultCard, { borderLeftColor: cardColor }]}>
        {/* Header */}
        <View style={styles.resultCardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: cardColor + '15' }]}>
            <Icon
              name={isPackage ? 'package-variant' : 'leaf'}
              size={14}
              color={cardColor}
            />
            <Text style={[styles.typeBadgeText, { color: cardColor }]}>
              {isPackage ? 'Package' : 'Product'}
            </Text>
          </View>
          {rec.priority === 1 && (
            <View style={styles.priorityBadge}>
              <Icon name="star" size={12} color="#F57C00" />
              <Text style={styles.priorityText}>Top Pick</Text>
            </View>
          )}
        </View>

        <Text style={styles.resultName}>{name}</Text>
        <Text style={styles.resultSubtitle}>{subtitle}</Text>

        {/* Reason */}
        {rec.reason && (
          <View style={styles.reasonWrap}>
            <Icon name="information-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.reasonText}>{rec.reason}</Text>
          </View>
        )}

        {/* Package Product Roles */}
        {isPackage && resolved.productRoles && (
          <View style={styles.rolesSection}>
            <Text style={styles.rolesSectionTitle}>Products in Package</Text>
            {resolved.productRoles.map((role, ri) => (
              <View key={ri} style={styles.roleRow}>
                <View style={styles.roleDot} />
                <View style={styles.roleInfo}>
                  <Text style={styles.roleName}>
                    {role.product ? role.product.brandName : role.productId}
                  </Text>
                  <Text style={styles.roleDesc}>{role.role}</Text>
                  {role.dosage && (
                    <Text style={styles.roleDosage}>Dosage: {role.dosage}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Detail Rows */}
        {rec.dosage && <DetailRow icon="eyedropper" label="Dosage" value={rec.dosage} />}
        {rec.applicationStage && <DetailRow icon="calendar-clock" label="Stage" value={Array.isArray(rec.applicationStage) ? rec.applicationStage.join(', ') : rec.applicationStage} />}
        {rec.season && <DetailRow icon="weather-sunny" label="Season" value={Array.isArray(rec.season) ? rec.season.join(', ') : rec.season} />}
        {rec.region && <DetailRow icon="map-marker" label="Region" value={Array.isArray(rec.region) ? rec.region.join(', ') : rec.region} />}
        {rec.compliance && <DetailRow icon="shield-check" label="Compliance" value={rec.compliance} />}

      </View>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <Header
        title={headerTitle}
        subtitle="Discover recommendations"
        onBack={goBack}
      />
      {view === VIEW.LANDING && renderLanding()}
      {view === VIEW.BROWSE && renderBrowse()}
      {view === VIEW.RESULTS && renderResults()}
    </View>
  );
};

// ─── Detail Row Component ──────────────────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={14} color={theme.colors.textLight} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// ─── Helpers ───────────────────────────────────────────────────
const getSearchIcon = (type) => {
  const map = {
    crop: 'sprout', pest: 'bug', disease: 'virus',
    nutrientDeficiency: 'flask-empty', growthStage: 'flower',
    weed: 'grass', abioticStress: 'weather-sunny-alert',
    product: 'leaf', package: 'package-variant',
  };
  return map[type] || 'magnify';
};

const formatType = (type) => {
  const map = {
    crop: 'Crop', pest: 'Pest', disease: 'Disease',
    nutrientDeficiency: 'Nutrient Deficiency', growthStage: 'Growth Stage',
    weed: 'Weed', abioticStress: 'Abiotic Stress',
    product: 'Product', package: 'Package',
  };
  return map[type] || type;
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // ─── Landing ──────────────────────────────────────────────
  landingContent: { padding: 16, paddingBottom: 32 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 10,
    paddingVertical: 0,
  },
  searchResults: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  searchResultText: { flex: 1, marginLeft: 12 },
  searchResultName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  searchResultType: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  noResults: { alignItems: 'center', paddingVertical: 40 },
  noResultsTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: 12 },
  noResultsText: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
    marginTop: 8,
  },
  browseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  browseCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  browseIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  browseTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  browseCount: { fontSize: 12, color: theme.colors.textLight, marginTop: 3 },

  // ─── Browse Item Grid ─────────────────────────────────────
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  itemIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemName: { fontSize: 14, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },

  // ─── Problem Browse ───────────────────────────────────────
  problemBrowse: { padding: 16, paddingBottom: 32 },
  problemGroup: { marginBottom: 16 },
  problemGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  problemGroupTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: theme.colors.text },
  problemGroupCount: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
  problemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    ...theme.shadows.sm,
  },
  problemItemName: { flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.text },

  // ─── Category List ────────────────────────────────────────
  categoryList: { padding: 16, paddingBottom: 32 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  categoryDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 3 },

  // ─── Results ──────────────────────────────────────────────
  resultsContent: { padding: 16, paddingBottom: 32 },
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  filterBannerText: { fontSize: 15, fontWeight: '600', color: theme.colors.primary },

  resultSection: { marginBottom: 20 },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },

  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: { fontSize: 11, fontWeight: '700', color: '#F57C00' },

  resultName: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  resultSubtitle: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 10 },

  reasonWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  reasonText: { flex: 1, fontSize: 13, color: theme.colors.text, lineHeight: 19 },

  // ─── Package Roles ────────────────────────────────────────
  rolesSection: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  rolesSectionTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  roleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: 10,
  },
  roleInfo: { flex: 1 },
  roleName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  roleDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  roleDosage: { fontSize: 12, color: theme.colors.primary, marginTop: 2, fontWeight: '500' },

  // ─── Detail Rows ──────────────────────────────────────────
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  detailLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textLight },
  detailValue: { flex: 1, fontSize: 13, color: theme.colors.text },

  // ─── Cross-Sell ───────────────────────────────────────────
  crossSellSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.divider,
  },
  crossSellTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  crossSellRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  crossSellChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  crossSellChipText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

  // ─── Up-Sell ──────────────────────────────────────────────
  upSellSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.divider,
  },
  upSellTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  upSellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    gap: 8,
  },
  upSellName: { flex: 1, fontSize: 13, fontWeight: '600', color: theme.colors.text },
});

export default SolutionsScreen;
