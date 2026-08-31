import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Keyboard, ScrollView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import ProductName from '../components/common/ProductName';
import theme from '../constants/theme';
import { PRODUCTS, PORTFOLIO_FAMILIES, EXCEL_CATEGORY_INFO, getPortfolioForProduct, getPortfolioVariants, getProductsByExcelCategory } from '../constants/productData';
import { getHeroImage, getFamilyIconImage } from '../constants/productImages';
import { searchAll, getCropCategoryTitle } from '../utils/recommendationEngine';
import { translateBioTerm } from '../i18n/bioTerms';
import { getCategoryColor, debounce } from '../utils/helpers';

const BROWSE_CATEGORIES = ['Botanical Pesticides', 'Microbial Pesticides', 'Bio Stimulants', 'Microbial Fertilizer'];

const SearchScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const doSearch = useCallback(
    debounce((text) => {
      if (!text || text.length < 2) { setResults([]); return; }
      const q = text.toLowerCase();

      // Track which portfolio families already matched to avoid duplicates
      const seenFamilies = new Set();

      const productMatches = PRODUCTS.filter(p =>
        p.subcategory !== 'Substrate' && (
          p.name.toLowerCase().includes(q) ||
          p.activeIngredient.toLowerCase().includes(q) ||
          p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
          p.targets.some(t => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
        )
      ).reduce((acc, p) => {
        const portfolio = getPortfolioForProduct(p.id);
        if (portfolio) {
          // Show one result per portfolio family, route to PortfolioDetail
          if (!seenFamilies.has(portfolio.id)) {
            seenFamilies.add(portfolio.id);
            const variants = getPortfolioVariants(portfolio.id);
            const firstVariant = variants[0];
            acc.push({
              id: 'pf-' + portfolio.id, type: 'Portfolio',
              title: portfolio.name,
              subtitle: `${variants.length} variants · ${portfolio.activeIngredient}`,
              badge: portfolio.category,
              badgeColor: getCategoryColor(portfolio.category),
              icon: portfolio.icon || 'leaf',
              image: getFamilyIconImage(portfolio.id) || (firstVariant ? getHeroImage(firstVariant.name) : null),
              data: portfolio,
              screen: 'PortfolioDetail',
              params: { family: portfolio },
            });
          }
        } else {
          // Standalone product
          acc.push({
            id: 'p-' + p.id, type: 'Product',
            title: p.name,
            subtitle: p.activeIngredient,
            badge: p.category,
            badgeColor: getCategoryColor(p.category),
            icon: 'leaf',
            image: getHeroImage(p.name),
            data: p,
            screen: 'ProductDetail',
            params: { product: p },
          });
        }
        return acc;
      }, []);

      // BioIntel library — crops, pests, diseases, deficiencies, stages,
      // weeds and stresses. Each result carries the filter that opens it.
      const BIO_TYPES = {
        crop:               { label: 'Crop',                filterKey: 'cropIds',               section: 'crop',        icon: 'sprout' },
        pest:               { label: 'Pest',                filterKey: 'pestIds',               section: 'problem',     icon: 'bug' },
        disease:            { label: 'Disease',             filterKey: 'diseaseIds',            section: 'problem',     icon: 'virus' },
        nutrientDeficiency: { label: 'Nutrient Deficiency', filterKey: 'nutrientDeficiencyIds', section: 'problem',     icon: 'flask-empty' },
        growthStage:        { label: 'Growth Stage',        filterKey: 'growthStageIds',        section: 'growthStage', icon: 'flower' },
        weed:               { label: 'Weed',                filterKey: 'weedIds',               section: 'problem',     icon: 'grass' },
        abioticStress:      { label: 'Abiotic Stress',      filterKey: 'abioticStressIds',      section: 'stress',      icon: 'weather-sunny-alert' },
      };

      const bioMatches = searchAll(text, i18n.language)
        .filter(r => BIO_TYPES[r.type])
        .map(({ type, item }) => {
          const meta = BIO_TYPES[type];
          const name = translateBioTerm(item.name);
          // Crops say which category they sit in; everything else names its kind
          const category = type === 'crop' ? getCropCategoryTitle(item.id) : null;
          return {
            id: 'bio-' + item.id, type: meta.label,
            title: name,
            subtitle: category ? translateBioTerm(category) : meta.label,
            badge: 'BioIntel',
            badgeColor: theme.colors.secondary,
            icon: item.icon || meta.icon,
            image: item.image || null,
            data: item,
            screen: 'Solutions',
            params: { filterKey: meta.filterKey, filterId: item.id, label: name, section: meta.section },
          };
        });
      setResults([...productMatches, ...bioMatches]);
    }, 300),
    // language is a dependency: switching it changes what the query matches
    [i18n.language]
  );

  const handleChange = (text) => {
    setQuery(text);
    doSearch(text);
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      activeOpacity={0.7}
      onPress={() => { Keyboard.dismiss(); navigation.navigate(item.screen, item.params); }}>
      <View style={[styles.resultIcon, { backgroundColor: item.image ? 'transparent' : item.badgeColor + '15' }]}>
        {item.image ? (
          <ExpoImage
            source={item.image}
            style={styles.resultImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={item.id}
          />
        ) : (
          <Icon name={item.icon} size={22} color={item.badgeColor} />
        )}
      </View>
      <View style={styles.resultInfo}>
        {(item.type === 'Product' || item.type === 'Portfolio') ? (
          <ProductName name={item.title} style={styles.resultTitle} />
        ) : (
          <Text style={styles.resultTitle}>{item.title}</Text>
        )}
        <Text style={styles.resultSub} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: item.badgeColor + '15' }]}>
        <Text style={[styles.typeBadgeText, { color: item.badgeColor }]}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  const SUGGESTIONS = ['Azadirachtin', 'Beauveria', 'Biocontrol', 'Ecoza', 'Spinosad', 'Trichoderma', 'Biostimulant', 'Home & Garden'];

  const browseTiles = useMemo(() =>
    BROWSE_CATEGORIES.map(cat => ({
      key: cat,
      info: EXCEL_CATEGORY_INFO[cat],
      count: getProductsByExcelCategory(cat).length,
    })),
    []
  );

  const shortLabel = (name) => name.replace('Microbial Fertilizer', 'Biofertilizers');

  return (
    <View style={styles.container}>
      <Header title={t('screens.search')} onBack={() => navigation.goBack()} />

      {/* Search input */}
      <View style={styles.inputWrap}>
        <Icon name="magnify" size={22} color={theme.colors.textLight} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={handleChange}
          placeholder={t('common.searchPlaceholder')}
          placeholderTextColor={theme.colors.textLight}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <Icon name="close-circle" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {query.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyState} showsVerticalScrollIndicator={false}>
          <View style={styles.suggestions}>
            <Text style={styles.suggestLabel}>{t('search.quickSearches')}</Text>
            <View style={styles.suggestRow}>
              {SUGGESTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestChip}
                  onPress={() => { setQuery(s); doSearch(s); }}>
                  <Text style={styles.suggestText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.browseWrap}>
            <Text style={styles.suggestLabel}>{t('search.browseByCategory')}</Text>
            <View style={styles.browseGrid}>
              {browseTiles.map(({ key, info, count }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.browseTile, { borderColor: info.color + '33' }]}
                  activeOpacity={0.85}
                  onPress={() => { Keyboard.dismiss(); navigation.navigate('Products', { initialCategory: key }); }}>
                  <View style={[styles.browseIconWrap, { backgroundColor: info.color + '18' }]}>
                    <Icon name={info.icon} size={26} color={info.color} />
                  </View>
                  <Text style={styles.browseTitle} numberOfLines={2}>{shortLabel(key)}</Text>
                  <Text style={[styles.browseCount, { color: info.color }]}>{count} products</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultCount}>{t('search.resultsFor', { count: results.length, query })}</Text>
            ) : null
          }
          ListEmptyComponent={
            query.length >= 2 ? (
              <View style={styles.empty}>
                <Icon name="magnify-remove-outline" size={48} color={theme.colors.textLight} />
                <Text style={styles.emptyText}>{t('common.noResultsFor', { query })}</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    ...theme.shadows.sm,
  },
  input: { flex: 1, fontSize: 16, color: theme.colors.text },
  emptyState: { paddingBottom: 24 },
  suggestions: { paddingHorizontal: 16 },
  suggestLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 10 },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  browseWrap: { paddingHorizontal: 16, marginTop: 22 },
  browseGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  browseTile: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  browseIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  browseTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text, minHeight: 36 },
  browseCount: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  resultCount: { fontSize: 13, color: theme.colors.textLight, marginBottom: 8, paddingHorizontal: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...theme.shadows.sm,
    gap: 10,
  },
  resultIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  resultImage: { width: 38, height: 38 },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  resultSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 15, color: theme.colors.textLight, marginTop: 10 },
});

export default SearchScreen;
