import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { getCategoryColor, getFormulationColor } from '../utils/helpers';
import { getPortfolioForProduct } from '../constants/productData';

const TABS = ['Overview', 'Agronomy', 'Highlights', 'Media', 'Documents'];

const ProductDetailScreen = ({ route, navigation }) => {
  const { product, fromPortfolio } = route.params;
  const [activeTab, setActiveTab] = useState(0);
  const catColor = getCategoryColor(product.category);

  // ─── Overview Tab ───────────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      {/* Hero Card */}
      <View style={[styles.heroCard, { borderLeftColor: catColor }]}>
        <View style={[styles.heroIcon, { backgroundColor: catColor + '15', overflow: 'hidden' }]}>
          {product.imageUrl ? (
            <Image
              source={typeof product.imageUrl === 'string' ? { uri: product.imageUrl } : product.imageUrl}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              resizeMode="cover"
            />
          ) : (
            <Icon name="leaf" size={48} color={catColor} />
          )}
        </View>
        <Text style={styles.heroName}>{product.name}</Text>
        <View style={styles.heroBadges}>
          <View style={[styles.pill, { backgroundColor: catColor + '18' }]}>
            <Text style={[styles.pillText, { color: catColor }]}>{product.category}</Text>
          </View>
          {product.subcategory ? (
            <View style={[styles.pill, { backgroundColor: catColor + '10' }]}>
              <Text style={[styles.pillText, { color: catColor }]}>{product.subcategory}</Text>
            </View>
          ) : null}
          <View style={[styles.pill, { backgroundColor: getFormulationColor(product.formulation) + '18' }]}>
            <Text style={[styles.pillText, { color: getFormulationColor(product.formulation) }]}>{product.formulation}</Text>
          </View>
        </View>
      </View>

      {/* Product Overview */}
      {product.overview ? (
        <Text style={styles.description}>{product.overview}</Text>
      ) : product.description ? (
        <Text style={styles.description}>{product.description}</Text>
      ) : null}

      {/* Technical Profile */}
      <Text style={styles.sectionTitle}>Technical Profile</Text>
      <View style={styles.infoGrid}>
        <InfoRow icon="flask" label="Active Ingredient" value={product.activeIngredient} />
        {product.concentration ? (
          <InfoRow icon="percent" label="Concentration" value={product.concentration} />
        ) : null}
        <InfoRow icon="beaker" label="Formulation" value={product.formulation} />
        {product.strainStrength ? (
          <InfoRow icon="dna" label="Strain / Active Strength" value={product.strainStrength} />
        ) : null}
      </View>

      {/* Technical Profile Images */}
      {product.technicalImages && product.technicalImages.length > 0 ? (
        <View style={styles.techImagesWrap}>
          {product.technicalImages.map((img, i) => (
            <View key={i} style={styles.techImageCard}>
              {img.label ? (
                <Text style={styles.techImageLabel}>{img.label}</Text>
              ) : null}
              <Image
                source={typeof img.source === 'string' ? { uri: img.source } : img.source}
                style={styles.techImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      ) : null}

      {/* Pack Sizes */}
      {product.packSizes && product.packSizes.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Pack Sizes</Text>
          <View style={styles.packSizes}>
            {product.packSizes.map((size, i) => (
              <View key={i} style={styles.packChip}>
                <Icon name="package-variant" size={16} color={theme.colors.primary} />
                <Text style={styles.packText}>{size}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Technical Positioning Summary */}
      {product.technicalSummary ? (
        <>
          <Text style={styles.sectionTitle}>Technical Positioning</Text>
          <View style={styles.summaryCard}>
            <Icon name="bullseye-arrow" size={20} color={theme.colors.secondary} style={styles.summaryIcon} />
            <Text style={styles.summaryText}>{product.technicalSummary}</Text>
          </View>
        </>
      ) : null}
    </View>
  );

  // ─── Agronomy Tab ───────────────────────────────────────────
  const renderAgronomy = () => (
    <View style={styles.section}>
      {/* Target Crops */}
      {product.targetCrops && product.targetCrops.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Target Crops</Text>
          <View style={styles.chipRow}>
            {product.targetCrops.map((crop, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="sprout" size={14} color="#2E7D32" />
                <Text style={[styles.chipText, { color: '#2E7D32' }]}>{crop}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Targets (pests/diseases) */}
      {product.targets && product.targets.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Target Pests / Diseases</Text>
          <View style={styles.chipRow}>
            {product.targets.map((target, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="bug" size={14} color="#E65100" />
                <Text style={[styles.chipText, { color: '#E65100' }]}>{target}</Text>
              </View>
            ))}
          </View>
        </>
      ) : product.targetPests && product.targetPests.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Target Pests / Diseases</Text>
          <View style={styles.chipRow}>
            {product.targetPests.map((pest, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="bug" size={14} color="#E65100" />
                <Text style={[styles.chipText, { color: '#E65100' }]}>{pest}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Dosage & Application Table */}
      {product.dosageTable && product.dosageTable.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Dosage & Application</Text>
          {product.dosageTable.map((entry, i) => (
            <View key={i} style={styles.dosageCard}>
              <View style={styles.dosageHeader}>
                <Icon name="leaf-circle-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.dosageStage}>{entry.crop_stage}</Text>
              </View>
              <View style={styles.dosageBody}>
                <View style={styles.dosageRow}>
                  <Text style={styles.dosageLabel}>Dose</Text>
                  <Text style={styles.dosageValue}>{entry.dose_per_acre}</Text>
                </View>
                <View style={styles.dosageDivider} />
                <View style={styles.dosageRow}>
                  <Text style={styles.dosageLabel}>Water</Text>
                  <Text style={styles.dosageValue}>{entry.water_volume}</Text>
                </View>
                <View style={styles.dosageDivider} />
                <View style={styles.dosageRow}>
                  <Text style={styles.dosageLabel}>Method</Text>
                  <Text style={styles.dosageValue}>{entry.application_method}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : null}

      {/* Application Schedule */}
      {product.repeatability && product.repeatability.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Application Schedule</Text>
          {product.repeatability.map((entry, i) => (
            <View key={i} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={[styles.scheduleIndex, { backgroundColor: catColor + '18' }]}>
                  <Text style={[styles.scheduleIndexText, { color: catColor }]}>{i + 1}</Text>
                </View>
                <Text style={styles.scheduleTiming}>{entry.application_timing}</Text>
              </View>
              <View style={styles.scheduleBody}>
                <View style={styles.scheduleRow}>
                  <Icon name="repeat" size={15} color={theme.colors.textLight} />
                  <Text style={styles.scheduleLabel}>Frequency:</Text>
                  <Text style={styles.scheduleValue}>{entry.frequency}</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Icon name="information-outline" size={15} color={theme.colors.textLight} />
                  <Text style={styles.scheduleLabel}>Note:</Text>
                  <Text style={styles.scheduleValue}>{entry.recommendation}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : null}

      {/* Portfolio Link */}
      {product.portfolioId && !fromPortfolio ? (
        <>
          <View style={styles.portfolioDivider} />
          <TouchableOpacity
            style={[styles.portfolioBtn, { backgroundColor: catColor }]}
            onPress={() => {
              const family = getPortfolioForProduct(product.id);
              if (family) {
                navigation.navigate('PortfolioDetail', { family });
              }
            }}
            activeOpacity={0.8}>
            <Icon name="view-grid-outline" size={20} color="#FFF" />
            <Text style={styles.portfolioBtnText}>View Full Range</Text>
            <Icon name="chevron-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );

  // ─── Highlights Tab ─────────────────────────────────────────
  const renderHighlights = () => (
    <View style={styles.section}>
      {/* Key Benefits */}
      {(product.highlights || product.keyBenefits) ? (
        <>
          <Text style={styles.sectionTitle}>Key Benefits</Text>
          {(product.highlights || product.keyBenefits || []).map((item, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitDot}>
                <Icon name="check-circle" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.benefitText}>{item}</Text>
            </View>
          ))}
        </>
      ) : null}

      {/* Mode of Action */}
      {(product.mechanismOfAction || product.modeOfAction) ? (
        <>
          <Text style={styles.sectionTitle}>Mode of Action</Text>
          <View style={styles.moaCard}>
            <Icon name="cog" size={20} color={theme.colors.secondary} />
            <Text style={styles.moaText}>{product.mechanismOfAction || product.modeOfAction}</Text>
          </View>
        </>
      ) : null}

      {/* Problem & Solution */}
      {product.problemSolutions && product.problemSolutions.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Problem & Solution</Text>
          {product.problemSolutions.map((ps, i) => (
            <View key={i} style={styles.psContainer}>
              <View style={styles.psCard}>
                <View style={[styles.psIconWrap, { backgroundColor: '#FFEBEE' }]}>
                  <Icon name="alert-circle-outline" size={18} color="#D32F2F" />
                </View>
                <View style={styles.psContent}>
                  <Text style={styles.psLabel}>Problem</Text>
                  <Text style={styles.psText}>{ps.problem}</Text>
                </View>
              </View>
              <View style={styles.psArrow}>
                <Icon name="arrow-down" size={16} color={theme.colors.textLight} />
              </View>
              <View style={styles.psCard}>
                <View style={[styles.psIconWrap, { backgroundColor: '#E8F5E9' }]}>
                  <Icon name="check-circle-outline" size={18} color="#2E7D32" />
                </View>
                <View style={styles.psContent}>
                  <Text style={[styles.psLabel, { color: theme.colors.primary }]}>Solution</Text>
                  <Text style={styles.psText}>{ps.solution}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : null}

      {/* Compatibility */}
      {(product.compatibilityStatement || product.compatibility) ? (
        <>
          <Text style={styles.sectionTitle}>Compatibility</Text>
          <View style={styles.moaCard}>
            <Icon name="handshake" size={20} color={theme.colors.info} />
            <Text style={styles.moaText}>{product.compatibilityStatement || product.compatibility}</Text>
          </View>
        </>
      ) : null}

      {/* Shelf Life & Storage */}
      {(product.shelfLife || product.storageSafety) ? (
        <>
          <Text style={styles.sectionTitle}>Shelf Life & Storage</Text>
          <View style={styles.storageCard}>
            {product.shelfLife ? (
              <View style={styles.storageRow}>
                <Icon name="clock-outline" size={18} color={theme.colors.secondary} />
                <View style={styles.storageContent}>
                  <Text style={styles.storageLabel}>Shelf Life</Text>
                  <Text style={styles.storageValue}>{product.shelfLife}</Text>
                </View>
              </View>
            ) : null}
            {product.shelfLife && product.storageSafety ? (
              <View style={styles.storageDivider} />
            ) : null}
            {product.storageSafety ? (
              <View style={styles.storageRow}>
                <Icon name="warehouse" size={18} color={theme.colors.secondary} />
                <View style={styles.storageContent}>
                  <Text style={styles.storageLabel}>Storage</Text>
                  <Text style={styles.storageValue}>{product.storageSafety}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );

  // ─── Media Tab ──────────────────────────────────────────────
  const renderMedia = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Product Media</Text>
      <View style={styles.mediaGrid}>
        {['Product Image', 'Packaging', 'Label', 'Packshot'].map((type, i) => (
          <View key={i} style={styles.mediaPlaceholder}>
            <Icon name="image-outline" size={32} color={theme.colors.textLight} />
            <Text style={styles.mediaLabel}>{type}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── Documents Tab ──────────────────────────────────────────
  const renderDocuments = () => {
    const docs = [
      { type: 'TDS', icon: 'file-document', color: '#2196F3' },
      { type: 'COA', icon: 'file-certificate', color: '#4CAF50' },
      { type: 'Brochure', icon: 'file-presentation-box', color: '#FF9800' },
      { type: 'Product Label', icon: 'label', color: '#9C27B0' },
      { type: 'SDS / MSDS', icon: 'file-alert', color: '#F44336' },
    ];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Documents</Text>
        {docs.map((doc, i) => (
          <TouchableOpacity key={i} style={styles.docRow}>
            <View style={[styles.docIcon, { backgroundColor: doc.color + '15' }]}>
              <Icon name={doc.icon} size={22} color={doc.color} />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>{product.name} - {doc.type}</Text>
              <Text style={styles.docMeta}>PDF document</Text>
            </View>
            <View style={styles.docBadge}>
              <Icon name="check-circle" size={14} color={theme.colors.success} />
              <Text style={styles.docBadgeText}>Offline</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const tabContent = [renderOverview, renderAgronomy, renderHighlights, renderMedia, renderDocuments];

  return (
    <View style={styles.container}>
      <Header title={product.name} subtitle={product.category} onBack={() => navigation.goBack()} />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tabContent[activeTab]()}
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={18} color={theme.colors.primary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Tab bar
  tabBar: { backgroundColor: '#FFF', ...theme.shadows.sm },
  tabScroll: { paddingHorizontal: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 14 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 14, fontWeight: '500', color: theme.colors.textLight },
  tabTextActive: { color: theme.colors.primary, fontWeight: '700' },

  // Section
  section: { padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text, marginTop: 20, marginBottom: 12 },

  // Hero
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderLeftWidth: 4,
    ...theme.shadows.md,
    marginBottom: 16,
  },
  heroIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroName: { fontSize: 24, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  pillText: { fontSize: 12, fontWeight: '600' },

  // Description / Overview text
  description: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 23, marginBottom: 16 },

  // Info grid
  infoGrid: { backgroundColor: '#FFF', borderRadius: 12, padding: 4, ...theme.shadows.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: theme.colors.divider },
  infoIcon: { marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: theme.colors.textLight, fontWeight: '500' },
  infoValue: { fontSize: 15, color: theme.colors.text, fontWeight: '600', marginTop: 2 },

  // Technical images
  techImagesWrap: { marginTop: 12, gap: 10 },
  techImageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  techImageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  techImage: {
    width: '100%',
    height: 200,
  },

  // Pack sizes
  packSizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  packChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  packText: { fontSize: 14, fontWeight: '600', color: '#2E7D32' },

  // Technical Summary card
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...theme.shadows.sm,
  },
  summaryIcon: { marginTop: 2 },
  summaryText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 21 },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  chipText: { fontSize: 13, fontWeight: '500' },

  // Dosage cards
  dosageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  dosageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '0A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  dosageStage: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dosageBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dosageLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dosageValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    lineHeight: 20,
  },
  dosageDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginHorizontal: 0,
  },

  // Schedule cards
  scheduleCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  scheduleIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleIndexText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleTiming: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scheduleBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  scheduleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  scheduleValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    lineHeight: 20,
  },

  // Portfolio button
  portfolioDivider: { height: 1, backgroundColor: theme.colors.divider, marginVertical: 20 },
  portfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...theme.shadows.md,
  },
  portfolioBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },

  // Benefits
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  benefitDot: { marginRight: 10, marginTop: 2 },
  benefitText: { flex: 1, fontSize: 15, color: theme.colors.text, lineHeight: 22 },

  // MOA / Compatibility card
  moaCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
    ...theme.shadows.sm,
  },
  moaText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 21 },

  // Problem & Solution
  psContainer: {
    marginBottom: 16,
  },
  psCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    gap: 10,
    ...theme.shadows.sm,
  },
  psIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  psContent: { flex: 1 },
  psLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D32F2F',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  psText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  psArrow: {
    alignItems: 'center',
    paddingVertical: 4,
  },

  // Storage card
  storageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    ...theme.shadows.sm,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  storageContent: { flex: 1 },
  storageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  storageValue: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  storageDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 6,
  },

  // Media
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mediaPlaceholder: {
    width: (Dimensions.get('window').width - 56) / 2,
    height: 140,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  mediaLabel: { marginTop: 6, fontSize: 12, color: theme.colors.textLight },

  // Documents
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    ...theme.shadows.sm,
  },
  docIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  docMeta: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  docBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docBadgeText: { fontSize: 11, color: theme.colors.success, fontWeight: '500' },
});

export default ProductDetailScreen;
