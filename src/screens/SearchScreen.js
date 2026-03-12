import React, { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Keyboard } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { PRODUCTS, PORTFOLIO_FAMILIES, getPortfolioForProduct, getPortfolioVariants } from '../constants/productData';
import { SOLUTIONS } from '../constants/solutionsData';
import { getCategoryColor, debounce } from '../utils/helpers';

const SearchScreen = ({ navigation }) => {
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
            acc.push({
              id: 'pf-' + portfolio.id, type: 'Portfolio',
              title: portfolio.name,
              subtitle: `${variants.length} variants · ${portfolio.activeIngredient}`,
              badge: portfolio.category,
              badgeColor: getCategoryColor(portfolio.category),
              icon: portfolio.icon || 'leaf',
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
            data: p,
            screen: 'ProductDetail',
            params: { product: p },
          });
        }
        return acc;
      }, []);

      const cropMatches = SOLUTIONS.filter(s =>
        s.crop.toLowerCase().includes(q) ||
        s.problems.some(p => p.name.toLowerCase().includes(q))
      ).map(s => ({
        id: 'c-' + s.id, type: 'Crop Solution',
        title: s.crop,
        subtitle: s.problems.map(p => p.name).join(', '),
        badge: 'Solutions',
        badgeColor: theme.colors.secondary,
        icon: s.icon,
        data: s,
        screen: 'Solutions',
        params: {},
      }));

      setResults([...productMatches, ...cropMatches]);
    }, 300),
    []
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
      <View style={[styles.resultIcon, { backgroundColor: item.badgeColor + '15' }]}>
        <Icon name={item.icon} size={22} color={item.badgeColor} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSub} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: item.badgeColor + '15' }]}>
        <Text style={[styles.typeBadgeText, { color: item.badgeColor }]}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  const SUGGESTIONS = ['Azadirachtin', 'Beauveria', 'Biocontrol', 'Ecoza', 'Spinosad', 'Trichoderma', 'Biostimulant', 'Home & Garden'];

  return (
    <View style={styles.container}>
      <Header title="Search" onBack={() => navigation.goBack()} />

      {/* Search input */}
      <View style={styles.inputWrap}>
        <Icon name="magnify" size={22} color={theme.colors.textLight} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={handleChange}
          placeholder="Search products, crops, ingredients..."
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
        <View style={styles.suggestions}>
          <Text style={styles.suggestLabel}>Quick Searches</Text>
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
              <Text style={styles.resultCount}>{results.length} results for "{query}"</Text>
            ) : null
          }
          ListEmptyComponent={
            query.length >= 2 ? (
              <View style={styles.empty}>
                <Icon name="magnify-remove-outline" size={48} color={theme.colors.textLight} />
                <Text style={styles.emptyText}>No results for "{query}"</Text>
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
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  resultSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 15, color: theme.colors.textLight, marginTop: 10 },
});

export default SearchScreen;
