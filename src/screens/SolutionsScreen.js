import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { translateBioTerm } from '../i18n/bioTerms';
import { useTechText } from '../i18n/useTechText';
import Header from '../components/common/Header';
import ProductName from '../components/common/ProductName';
import theme from '../constants/theme';
import {
  getCropSections, getGrowthStages, getCategories, getAbioticStresses,
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
  nutrientDeficiencies: 'flask-round-bottom-empty',
  weeds: 'grass',
  abioticStresses: 'weather-lightning',
};

// One-line subtitles shown on the browse cards — resolved via t()
const BROWSE_SUBTITLE_KEYS = {
  crop: 'solutions.browseCards.crop',
  problem: 'solutions.browseCards.problem',
  growthStage: 'solutions.browseCards.stage',
  stress: 'solutions.browseCards.stress',
  category: 'solutions.browseCards.product',
};

const SolutionsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const tt = useTechText();
  const [view, setView] = useState(VIEW.LANDING);
  const [browseSection, setBrowseSection] = useState(null);
  const [cropGroup, setCropGroup] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const browseScrollRef = useRef(null);
  // One saved offset per level, so drilling into a crop group no longer
  // overwrites the position of the list you came from.
  const scrollPositions = useRef({});
  // Offset to apply once the next list has finished laying out.
  const pendingRestore = useRef(null);

  // Key identifying the list currently on screen.
  const levelKey = view === VIEW.BROWSE
    ? `browse:${browseSection?.id || ''}:${cropGroup?.id || ''}`
    : view;

  const rememberScroll = (e) => {
    scrollPositions.current[levelKey] = e.nativeEvent.contentOffset.y;
  };

  // Restoring on a fixed timer raced the layout on long lists and landed at
  // the top; wait for the content to be measured instead.
  const restoreOnLayout = () => {
    if (pendingRestore.current == null) return;
    const y = pendingRestore.current;
    pendingRestore.current = null;
    if (y > 0) browseScrollRef.current?.scrollTo({ y, animated: false });
  };

  const queueRestore = (key) => {
    pendingRestore.current = scrollPositions.current[key] || 0;
  };

  // ─── Data ────────────────────────────────────────────────────
  const browseSections = useMemo(() => getBrowseSections(), []);
  const problemSections = useMemo(() => getProblemSections(), []);
  const cropSections = useMemo(() => getCropSections(), []);
  const growthStages = useMemo(() => getGrowthStages(), []);
  const abioticStresses = useMemo(() => getAbioticStresses(), []);
  const categories = useMemo(() => getCategories(), []);

  // ─── Search ──────────────────────────────────────────────────
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchAll(searchQuery, i18n.language);
    // language is a dependency: switching it changes what the query matches
  }, [searchQuery, i18n.language]);

  // ─── Matched Recommendations ─────────────────────────────────
  const results = useMemo(() => {
    if (view !== VIEW.RESULTS) return { primary: [], secondary: [] };
    return matchRecommendations(filters);
  }, [view, filters]);

  // ─── Deep link ───────────────────────────────────────────────
  // Search hands us { filterKey, filterId, label } to open a result
  // directly instead of dropping the user on the landing screen.
  const deepLink = route?.params?.filterKey ? route.params : null;
  useEffect(() => {
    if (!deepLink) return;
    setFilters({ [deepLink.filterKey]: [deepLink.filterId] });
    setSelectedLabel(deepLink.label || '');
    setBrowseSection(browseSections.find(s => s.id === deepLink.section) || null);
    setCropGroup(null);
    setView(VIEW.RESULTS);
  }, [route?.params]);

  // ─── Navigation helpers ──────────────────────────────────────
  const goBack = () => {
    if (view === VIEW.RESULTS) {
      // Opened straight from search — there is no browse grid behind us.
      if (!browseSection) {
        setFilters({});
        setView(VIEW.LANDING);
        return;
      }
      // Back to the list these results came from, at the offset it was left at.
      queueRestore(`browse:${browseSection?.id || ''}:${cropGroup?.id || ''}`);
      setView(VIEW.BROWSE);
      setFilters({});
    } else if (view === VIEW.BROWSE && cropGroup) {
      // Group sub-list → the section list that contains the group.
      queueRestore(`browse:${browseSection?.id || ''}:`);
      setCropGroup(null);
    } else if (view === VIEW.BROWSE) {
      queueRestore(VIEW.LANDING);
      setView(VIEW.LANDING);
      setBrowseSection(null);
      setCropGroup(null);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  const atTopLevel = view === VIEW.LANDING;

  // Android hardware back button.
  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        if (!atTopLevel) {
          goBack();
          return true; // consume the event so RN doesn't pop the screen
        }
        return false; // at landing → let RN pop back to the previous screen
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
      return () => sub.remove();
    }, [view, cropGroup, browseSection])
  );

  // The swipe/predictive back gesture does not always raise hardwareBackPress,
  // so React Navigation would pop straight out to Home from an inner list.
  // Intercept the removal and step back one level instead.
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e) => {
        if (atTopLevel) return;      // let it leave the screen normally
        e.preventDefault();
        goBack();
      };
      // v7: addListener returns its own unsubscribe (removeListener is gone).
      const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);
      return unsubscribe;
    }, [navigation, view, cropGroup, browseSection])
  );

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
    ? t('solutions.landing')
    : view === VIEW.BROWSE
      ? (cropGroup ? translateBioTerm(cropGroup.title) : browseSection?.title || t('solutions.browse'))
      : selectedLabel || t('solutions.recommendations');

  // ═══════════════════════════════════════════════════════════════
  // LANDING VIEW
  // ═══════════════════════════════════════════════════════════════
  const renderLanding = () => (
    <ScrollView
      ref={browseScrollRef}
      contentContainerStyle={styles.landingContent}
      showsVerticalScrollIndicator={false}
      onScroll={rememberScroll}
      onContentSizeChange={restoreOnLayout}
      scrollEventThrottle={16}>
      {/* Hero */}
      <LinearGradient
        colors={['#2E7D32', '#1B5E20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>{t('solutions.heroTitle')}</Text>
          <Text style={styles.heroSub}>{t('solutions.heroSub')}</Text>
        </View>
        <View style={styles.heroIconWrap}>
          <Icon name="leaf-circle" size={42} color="#FFF" />
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Icon name="magnify" size={20} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('solutions.searchPlaceholder')}
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
              {r.item.image ? (
                <ExpoImage
                  source={r.item.image}
                  style={styles.searchResultImage}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={0}
                  recyclingKey={`${r.type}-${r.item.id}`}
                />
              ) : (
                <Icon name={getSearchIcon(r.type)} size={18} color={theme.colors.primary} />
              )}
              <View style={styles.searchResultText}>
                {r.type === 'product' ? (
                  <ProductName name={r.item.brandName || r.item.name} style={styles.searchResultName} />
                ) : (
                  <Text style={styles.searchResultName}>{translateBioTerm(r.item.name || r.item.brandName)}</Text>
                )}
                <Text style={styles.searchResultType}>{t(`solutions.types.${formatTypeKey(r.type)}`, formatType(r.type))}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <View style={styles.noResults}>
          <Icon name="magnify-close" size={32} color={theme.colors.textLight} />
          <Text style={styles.noResultsText}>{t('solutions.noMatches')}</Text>
        </View>
      )}

      {/* Browse Sections */}
      {searchQuery.length < 2 && (
        <>
          <Text style={styles.sectionTitle}>{t('solutions.browseBy')}</Text>
          <View style={styles.browseGrid}>
            {browseSections.map((section) => {
              const sub = BROWSE_SUBTITLE_KEYS[section.id] ? t(BROWSE_SUBTITLE_KEYS[section.id]) : '';
              return (
                <TouchableOpacity
                  key={section.id}
                  style={styles.browseCard}
                  activeOpacity={0.85}
                  onPress={() => { setBrowseSection(section); setCropGroup(null); setView(VIEW.BROWSE); }}>
                  <LinearGradient
                    colors={[section.color + '14', section.color + '02']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.browseGradient}
                  />
                  <View style={[styles.browseAccent, { backgroundColor: section.color }]} />
                  <View style={[styles.browseIconCircle, { backgroundColor: section.color + '18' }]}>
                    <Icon name={section.icon} size={26} color={section.color} />
                  </View>
                  <Text style={styles.browseTitle}>{tt(section.title)}</Text>
                  <Text style={styles.browseSubtitle} numberOfLines={2}>{sub}</Text>
                  <View style={styles.browseFooter}>
                    <View style={[styles.browseCountChip, { backgroundColor: section.color + '15' }]}>
                      <Text style={[styles.browseCountText, { color: section.color }]}>{section.count}</Text>
                    </View>
                    <Icon name="arrow-right" size={16} color={section.color} />
                  </View>
                </TouchableOpacity>
              );
            })}
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
      case 'crop': return renderCropBrowse();
      case 'problem': return renderProblemBrowse();
      case 'growthStage': return renderItemGrid(growthStages, 'growthStageIds', 'flower');
      case 'stress': return renderItemGrid(abioticStresses, 'abioticStressIds', 'weather-sunny-alert', styles.itemImageStress);
      case 'category': return renderCategoryList();
      default: return null;
    }
  };

  const renderItemGrid = (items, filterKey, fallbackIcon, imageStyle) => (
    <ScrollView
      ref={browseScrollRef}
      contentContainerStyle={styles.itemGrid}
      showsVerticalScrollIndicator={false}
      onScroll={rememberScroll}
      onContentSizeChange={restoreOnLayout}
      scrollEventThrottle={16}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.itemCard}
          activeOpacity={0.7}
          onPress={() => selectItem(filterKey, item.id, translateBioTerm(item.name))}>
          <View style={[styles.itemIconWrap, { backgroundColor: item.image ? 'transparent' : browseSection.color + '12' }]}>
            {item.image ? (
              <ExpoImage
                source={item.image}
                style={[styles.itemImage, imageStyle, item.imageZoom === 'medium' && styles.itemImageMedium]}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={0}
                recyclingKey={item.id}
              />
            ) : (
              <Icon name={item.icon || fallbackIcon} size={28} color={browseSection.color} />
            )}
          </View>
          <Text style={styles.itemName}>{translateBioTerm(item.name)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const PROBLEM_COLORS = {
    pests: '#D32F2F',
    diseases: '#f4c39a',
    nutrientDeficiencies: '#E65100',
    weeds: '#2E7D32',
  };

  // One reusable card — used for crops, and for groups that drill in.
  const renderCropCard = (key, item, color, fallbackIcon, onPress, groupCount) => (
    <TouchableOpacity key={key} style={styles.itemCard} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.itemIconWrap, { backgroundColor: item.image ? 'transparent' : color + '12' }]}>
        {item.image ? (
          <ExpoImage
            source={item.image}
            style={styles.itemImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={key}
          />
        ) : (
          <Icon name={item.icon || fallbackIcon} size={28} color={color} />
        )}
      </View>
      <Text style={styles.itemName}>{translateBioTerm(item.title || item.name)}</Text>
      {groupCount > 0 && (
        <View style={styles.groupHint}>
          <Text style={[styles.groupHintText, { color }]}>{groupCount}</Text>
          <Icon name="chevron-right" size={14} color={color} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Crop browse. Top level shows the master-list categories with one card per
  // group; tapping a multi-crop group (Citrus, Millets, …) opens just that
  // group, while a single-crop group goes straight to its recommendations.
  const renderCropBrowse = () => {
    const color = browseSection?.color || theme.colors.primary;

    if (cropGroup) {
      return (
        <ScrollView
          ref={browseScrollRef}
          contentContainerStyle={styles.itemGrid}
          showsVerticalScrollIndicator={false}
          onScroll={rememberScroll}
          onContentSizeChange={restoreOnLayout}
          scrollEventThrottle={16}>
          <View style={styles.gridSectionHeader}>
            {cropGroup.image ? (
              <ExpoImage
                source={cropGroup.image}
                style={styles.gridSectionImage}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={0}
              />
            ) : (
              <Icon name={cropGroup.icon} size={18} color={color} />
            )}
            <Text style={[styles.gridSectionTitle, { color }]}>{translateBioTerm(cropGroup.title)}</Text>
            <View style={[styles.gridSectionBadge, { backgroundColor: color + '14' }]}>
              <Text style={[styles.gridSectionCount, { color }]}>{cropGroup.crops.length}</Text>
            </View>
          </View>
          {cropGroup.crops.map((crop) => renderCropCard(
            crop.id, crop, color, cropGroup.icon,
            () => selectItem('cropIds', crop.id, translateBioTerm(crop.name)),
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView
        ref={browseScrollRef}
        contentContainerStyle={styles.itemGrid}
        showsVerticalScrollIndicator={false}
        onScroll={rememberScroll}
      onContentSizeChange={restoreOnLayout}
        scrollEventThrottle={16}>
        {cropSections.map((section) => (
          <React.Fragment key={section.id}>
            <View style={styles.gridSectionHeader}>
              <Icon name={section.icon} size={18} color={color} />
              <Text style={[styles.gridSectionTitle, { color }]}>{translateBioTerm(section.title)}</Text>
              <View style={[styles.gridSectionBadge, { backgroundColor: color + '14' }]}>
                <Text style={[styles.gridSectionCount, { color }]}>{section.entries.length}</Text>
              </View>
            </View>
            {section.entries.map((entry) => renderCropCard(
              entry.id, entry, color, section.icon,
              entry.kind === 'group'
                ? () => setCropGroup(entry)
                : () => selectItem('cropIds', entry.id, translateBioTerm(entry.name)),
              entry.kind === 'group' ? entry.crops.length : 0,
            ))}
          </React.Fragment>
        ))}
      </ScrollView>
    );
  };

  const renderProblemBrowse = () => (
    <ScrollView
      ref={browseScrollRef}
      contentContainerStyle={styles.itemGrid}
      showsVerticalScrollIndicator={false}
      onScroll={rememberScroll}
      onContentSizeChange={restoreOnLayout}
      scrollEventThrottle={16}>
      {problemSections.map((section) => {
        const sectionColor = PROBLEM_COLORS[section.id] || theme.colors.error;
        const filterKey = section.id === 'pests' ? 'pestIds'
          : section.id === 'diseases' ? 'diseaseIds'
            : section.id === 'nutrientDeficiencies' ? 'nutrientDeficiencyIds'
              : section.id === 'weeds' ? 'weedIds'
                : 'abioticStressIds';
        return (
          <React.Fragment key={section.id}>
            <View style={styles.gridSectionHeader}>
              <Icon name={PROBLEM_ICONS[section.id] || 'alert'} size={18} color={sectionColor} />
              <Text style={[styles.gridSectionTitle, { color: sectionColor }]}>{tt(section.title)}</Text>
              <View style={[styles.gridSectionBadge, { backgroundColor: sectionColor + '14' }]}>
                <Text style={[styles.gridSectionCount, { color: sectionColor }]}>{section.data.length}</Text>
              </View>
            </View>
            {section.data.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                activeOpacity={0.7}
                onPress={() => selectItem(filterKey, item.id, translateBioTerm(item.name))}>
                <View style={[styles.itemIconWrap, { backgroundColor: item.image ? 'transparent' : sectionColor + '12' }]}>
                  {item.image ? (
                    <ExpoImage
                      source={item.image}
                      style={styles.itemImage}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                      transition={0}
                      recyclingKey={item.id}
                    />
                  ) : (
                    <Icon name={item.icon || PROBLEM_ICONS[section.id] || 'alert'} size={28} color={sectionColor} />
                  )}
                </View>
                <Text style={styles.itemName}>{translateBioTerm(item.name)}</Text>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        );
      })}
    </ScrollView>
  );

  const renderCategoryList = () => (
    <ScrollView
      ref={browseScrollRef}
      contentContainerStyle={styles.itemGrid}
      showsVerticalScrollIndicator={false}
      onScroll={rememberScroll}
      onContentSizeChange={restoreOnLayout}
      scrollEventThrottle={16}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.itemCard}
          activeOpacity={0.7}
          onPress={() => selectItem('categoryIds', cat.id, cat.name)}>
          <View style={[styles.itemIconWrap, { backgroundColor: cat.image ? 'transparent' : (cat.color || '#7B1FA2') + '12' }]}>
            {cat.image ? (
              <ExpoImage
                source={cat.image}
                style={styles.itemImage}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={0}
                recyclingKey={cat.id}
              />
            ) : (
              <Icon name={cat.icon || 'shape'} size={28} color={cat.color || '#7B1FA2'} />
            )}
          </View>
          <Text style={styles.itemName}>{cat.name}</Text>
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
            <Text style={styles.noResultsTitle}>{t('solutions.emptyTitle')}</Text>
            <Text style={styles.noResultsText}>{t('solutions.emptySub')}</Text>
          </View>
        )}

        {/* Primary Recommendations (Packages) */}
        {primary.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>{t('solutions.recommendedSolutions')}</Text>
            {primary.map((r, i) => renderResultCard(r, i, true))}
          </View>
        )}

        {/* Secondary Recommendations */}
        {secondary.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>{t('solutions.additionalRecommendations')}</Text>
            {secondary.map((r, i) => renderResultCard(r, i, false))}
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
              {isPackage ? t('solutions.package') : t('solutions.productBadge')}
            </Text>
          </View>
          {rec.priority === 1 && (
            <View style={styles.priorityBadge}>
              <Icon name="star" size={12} color="#F57C00" />
              <Text style={styles.priorityText}>{t('solutions.topPick')}</Text>
            </View>
          )}
        </View>

        {isPackage ? (
          <Text style={styles.resultName}>{name}</Text>
        ) : (
          <ProductName name={name} style={styles.resultName} />
        )}
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
            <Text style={styles.rolesSectionTitle}>{t('solutions.productsInPackage')}</Text>
            {resolved.productRoles.map((role, ri) => (
              <View key={ri} style={styles.roleRow}>
                <View style={styles.roleInfo}>
                  {role.products && role.products.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      {role.products.map((p, pi) => (
                        <React.Fragment key={p.id}>
                          {pi > 0 && <Text style={styles.roleName}>{' + '}</Text>}
                          <ProductName name={p.brandName} style={styles.roleName} />
                        </React.Fragment>
                      ))}
                    </View>
                  ) : role.product ? (
                    <ProductName name={role.product.brandName} style={styles.roleName} />
                  ) : (
                    <Text style={styles.roleName}>{role.productId}</Text>
                  )}
                  <Text style={styles.roleDesc}>{role.role}</Text>
                  {role.dosage && (
                    <Text style={styles.roleDosage}>{t('solutions.dosageLabel')}{role.dosage}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Detail Rows */}
        {rec.dosage && <DetailRow icon="eyedropper" label={t('solutions.detailRows.dosage')} value={rec.dosage} />}
        {rec.applicationStage && <DetailRow icon="calendar-clock" label={t('solutions.detailRows.stage')} value={Array.isArray(rec.applicationStage) ? rec.applicationStage.join(', ') : rec.applicationStage} />}
        {rec.season && <DetailRow icon="weather-sunny" label={t('solutions.detailRows.season')} value={Array.isArray(rec.season) ? rec.season.join(', ') : rec.season} />}
        {rec.region && <DetailRow icon="map-marker" label={t('solutions.detailRows.region')} value={Array.isArray(rec.region) ? rec.region.join(', ') : rec.region} />}
        {rec.compliance && <DetailRow icon="shield-check" label={t('solutions.detailRows.compliance')} value={rec.compliance} />}

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
        subtitle={t('solutions.subtitle')}
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

// Maps rec/search types to solutions.types.* keys in translations
const formatTypeKey = (type) => {
  const map = {
    crop: 'crop', pest: 'pest', disease: 'disease',
    nutrientDeficiency: 'nutrient', growthStage: 'stage',
    weed: 'weed', abioticStress: 'abiotic',
    product: 'product', package: 'package',
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
  searchResultImage: { width: 28, height: 28 },
  searchResultName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  searchResultType: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  noResults: { alignItems: 'center', paddingVertical: 40 },
  noResultsTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: 12 },
  noResultsText: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },

  // ─── Hero ──────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  heroLeft: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
    marginTop: 6,
  },
  browseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  browseCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    paddingTop: 18,
    marginBottom: 14,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  browseGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  browseAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  browseIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  browseTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  browseSubtitle: { fontSize: 11.5, color: theme.colors.textLight, marginTop: 4, lineHeight: 16, minHeight: 32 },
  browseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  browseCountChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  browseCountText: { fontSize: 12, fontWeight: '700' },

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
  itemImage: { width: 42, height: 45, transform: [{ scale: 1.5 }] },
  itemImageStress: { width: 55, height: 55, transform: [{ scale: 1.9 }] },
  itemImageMedium: { width: 47, height: 47 },
  itemName: { fontSize: 14, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },
  // Count + chevron on a card that opens a sub-list rather than results
  groupHint: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  groupHintText: { fontSize: 11, fontWeight: '700' },
  gridSectionImage: { width: 22, height: 22 },

  // ─── Problem Section Headers ────────────────────────────────
  gridSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  gridSectionTitle: { flex: 1, fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  gridSectionBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  gridSectionCount: { fontSize: 12, fontWeight: '700' },

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
  roleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
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
