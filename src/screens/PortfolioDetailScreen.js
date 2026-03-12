import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { getPortfolioVariants } from '../constants/productData';
import { getCategoryColor, getFormulationColor } from '../utils/helpers';

const TABS = ['Overview', 'Agronomy', 'Highlights', 'Media', 'Documents'];

const PortfolioDetailScreen = ({ route, navigation }) => {
  const { family } = route.params;
  const variants = useMemo(() => getPortfolioVariants(family.id), [family.id]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVariant = variants[selectedIndex] || null;
  const catColor = getCategoryColor(family.category);


  // ─── Overview Tab ───────────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      {/* Hero Card */}
      <View style={[styles.heroCard, { borderLeftColor: family.color }]}>
        <View style={[styles.heroIconWrap, { backgroundColor: family.color + '15', overflow: 'hidden' }]}>
          {family.imageUrl ? (
            <Image
              source={typeof family.imageUrl === 'string' ? { uri: family.imageUrl } : family.imageUrl}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              resizeMode="cover"
            />
          ) : (
            <Icon name={family.icon} size={48} color={family.color} />
          )}
        </View>
        <Text style={styles.heroName}>{family.name}</Text>
        <Text style={styles.heroTagline}>{family.tagline}</Text>
        <View style={[styles.aiBadge, { backgroundColor: family.color + '18' }]}>
          <Icon name="flask" size={14} color={family.color} />
          <Text style={[styles.aiBadgeText, { color: family.color }]}>{family.activeIngredient}</Text>
        </View>
      </View>

      {/* Family Overview */}
      {family.overview ? (
        <Text style={styles.description}>{family.overview}</Text>
      ) : null}

      {/* Variant Selector */}
      <Text style={styles.sectionTitle}>Choose the Right Variant</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.variantScroll}
      >
        {variants.map((v, i) => {
          const isActive = i === selectedIndex;
          const formColor = getFormulationColor(v.formulation);
          return (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.variantCard,
                isActive && { borderColor: family.color, borderWidth: 2 },
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedIndex(i)}
            >
              <Text
                style={[styles.variantName, isActive && { color: family.color }]}
                numberOfLines={1}
              >
                {v.name}
              </Text>
              <View style={[styles.formBadge, { backgroundColor: formColor + '18' }]}>
                <Text style={[styles.formBadgeText, { color: formColor }]}>{v.formulation}</Text>
              </View>
              <Text style={styles.variantConc}>{v.concentration}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Technical Profile of selected variant */}
      {selectedVariant && (
        <>
          <Text style={styles.sectionTitle}>Technical Profile</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="flask" label="Active Ingredient" value={selectedVariant.activeIngredient} />
            {selectedVariant.concentration ? (
              <InfoRow icon="percent" label="Concentration" value={selectedVariant.concentration} />
            ) : null}
            <InfoRow icon="beaker" label="Formulation" value={selectedVariant.formulation} />
            {selectedVariant.strainStrength ? (
              <InfoRow icon="dna" label="Strain / Active Strength" value={selectedVariant.strainStrength} />
            ) : null}
          </View>
        </>
      )}

      {/* Technical Profile Images */}
      {selectedVariant?.technicalImages && selectedVariant.technicalImages.length > 0 ? (
        <View style={styles.techImagesWrap}>
          {selectedVariant.technicalImages.map((img, i) => (
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
      {selectedVariant?.packSizes && selectedVariant.packSizes.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Pack Sizes</Text>
          <View style={styles.packSizes}>
            {selectedVariant.packSizes.map((size, i) => (
              <View key={i} style={styles.packChip}>
                <Icon name="package-variant" size={16} color={theme.colors.primary} />
                <Text style={styles.packText}>{size}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Technical Positioning */}
      {selectedVariant?.technicalSummary ? (
        <>
          <Text style={styles.sectionTitle}>Technical Positioning</Text>
          <View style={styles.summaryCard}>
            <Icon name="bullseye-arrow" size={20} color={theme.colors.secondary} style={styles.summaryIcon} />
            <Text style={styles.summaryText}>{selectedVariant.technicalSummary}</Text>
          </View>
        </>
      ) : null}

      {/* Compare Formulations */}
      {variants.length > 1 && (
        <>
          <Text style={styles.sectionTitle}>Compare Formulations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compareScroll}
          >
            {variants.map((v) => {
              const formColor = getFormulationColor(v.formulation);
              const firstDose = v.dosageTable?.[0]?.dose_per_acre || '-';
              return (
                <View key={v.id} style={styles.compareCard}>
                  <Text style={styles.compareName} numberOfLines={1}>{v.name}</Text>
                  <View style={[styles.formBadge, { backgroundColor: formColor + '18', alignSelf: 'flex-start' }]}>
                    <Text style={[styles.formBadgeText, { color: formColor }]}>{v.formulation}</Text>
                  </View>
                  <View style={styles.compareRow}>
                    <Text style={styles.compareLabel}>Concentration</Text>
                    <Text style={styles.compareValue}>{v.concentration}</Text>
                  </View>
                  <View style={styles.compareRow}>
                    <Text style={styles.compareLabel}>Dosage</Text>
                    <Text style={styles.compareValue} numberOfLines={2}>{firstDose}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );

  // ─── Agronomy Tab ───────────────────────────────────────────
  const renderAgronomy = () => {
    const v = selectedVariant;
    if (!v) return renderEmptyTab();

    return (
      <View style={styles.section}>
        {/* Variant indicator */}
        <View style={styles.variantIndicator}>
          <Icon name="information-outline" size={16} color={family.color} />
          <Text style={[styles.variantIndicatorText, { color: family.color }]}>
            Showing data for {v.name}
          </Text>
        </View>

        {/* Target Crops */}
        {v.targetCrops && v.targetCrops.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Target Crops</Text>
            <View style={styles.chipRow}>
              {v.targetCrops.map((crop, i) => (
                <View key={i} style={[styles.chip, { backgroundColor: '#E8F5E9' }]}>
                  <Icon name="sprout" size={14} color="#2E7D32" />
                  <Text style={[styles.chipText, { color: '#2E7D32' }]}>{crop}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Targets (pests/diseases) */}
        {v.targets && v.targets.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Target Pests / Diseases</Text>
            <View style={styles.chipRow}>
              {v.targets.map((target, i) => (
                <View key={i} style={[styles.chip, { backgroundColor: '#FFF3E0' }]}>
                  <Icon name="bug" size={14} color="#E65100" />
                  <Text style={[styles.chipText, { color: '#E65100' }]}>{target}</Text>
                </View>
              ))}
            </View>
          </>
        ) : v.targetPests && v.targetPests.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Target Pests / Diseases</Text>
            <View style={styles.chipRow}>
              {v.targetPests.map((pest, i) => (
                <View key={i} style={[styles.chip, { backgroundColor: '#FFF3E0' }]}>
                  <Icon name="bug" size={14} color="#E65100" />
                  <Text style={[styles.chipText, { color: '#E65100' }]}>{pest}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Dosage & Application Table */}
        {v.dosageTable && v.dosageTable.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Dosage & Application</Text>
            {v.dosageTable.map((entry, i) => (
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
        {v.repeatability && v.repeatability.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Application Schedule</Text>
            {v.repeatability.map((entry, i) => (
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
      </View>
    );
  };

  // ─── Highlights Tab ─────────────────────────────────────────
  const renderHighlights = () => {
    const v = selectedVariant;
    if (!v) return renderEmptyTab();

    const hasContent = (v.highlights || v.keyBenefits) ||
      (v.mechanismOfAction || v.modeOfAction || family.mechanismOfAction) ||
      (v.problemSolutions && v.problemSolutions.length > 0) ||
      (v.compatibilityStatement || v.compatibility) ||
      (v.shelfLife || v.storageSafety);

    if (!hasContent) return renderEmptyTab();

    return (
      <View style={styles.section}>
        {/* Variant indicator */}
        <View style={styles.variantIndicator}>
          <Icon name="information-outline" size={16} color={family.color} />
          <Text style={[styles.variantIndicatorText, { color: family.color }]}>
            Showing data for {v.name}
          </Text>
        </View>

        {/* Key Benefits */}
        {(v.highlights || v.keyBenefits) ? (
          <>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            {(v.highlights || v.keyBenefits || []).map((item, i) => (
              <View key={i} style={styles.benefitRow}>
                <View style={styles.benefitDot}>
                  <Icon name="check-circle" size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </>
        ) : null}

        {/* Mechanism of Action */}
        {(v.mechanismOfAction || v.modeOfAction || family.mechanismOfAction) ? (
          <>
            <Text style={styles.sectionTitle}>Mechanism of Action</Text>
            <View style={styles.moaCard}>
              <Icon name="cog" size={20} color={theme.colors.secondary} />
              <Text style={styles.moaText}>
                {v.mechanismOfAction || v.modeOfAction || family.mechanismOfAction}
              </Text>
            </View>
          </>
        ) : null}

        {/* Problem & Solution */}
        {v.problemSolutions && v.problemSolutions.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Problem & Solution</Text>
            {v.problemSolutions.map((ps, i) => (
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
        {(v.compatibilityStatement || v.compatibility) ? (
          <>
            <Text style={styles.sectionTitle}>Compatibility</Text>
            <View style={styles.moaCard}>
              <Icon name="handshake" size={20} color={theme.colors.info} />
              <Text style={styles.moaText}>{v.compatibilityStatement || v.compatibility}</Text>
            </View>
          </>
        ) : null}

        {/* Shelf Life & Storage */}
        {(v.shelfLife || v.storageSafety) ? (
          <>
            <Text style={styles.sectionTitle}>Shelf Life & Storage</Text>
            <View style={styles.storageCard}>
              {v.shelfLife ? (
                <View style={styles.storageRow}>
                  <Icon name="clock-outline" size={18} color={theme.colors.secondary} />
                  <View style={styles.storageContent}>
                    <Text style={styles.storageLabel}>Shelf Life</Text>
                    <Text style={styles.storageValue}>{v.shelfLife}</Text>
                  </View>
                </View>
              ) : null}
              {v.shelfLife && v.storageSafety ? (
                <View style={styles.storageDivider} />
              ) : null}
              {v.storageSafety ? (
                <View style={styles.storageRow}>
                  <Icon name="warehouse" size={18} color={theme.colors.secondary} />
                  <View style={styles.storageContent}>
                    <Text style={styles.storageLabel}>Storage</Text>
                    <Text style={styles.storageValue}>{v.storageSafety}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };

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
    const displayName = selectedVariant ? selectedVariant.name : family.name;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Documents</Text>
        {docs.map((doc, i) => (
          <TouchableOpacity key={i} style={styles.docRow}>
            <View style={[styles.docIcon, { backgroundColor: doc.color + '15' }]}>
              <Icon name={doc.icon} size={22} color={doc.color} />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>{displayName} - {doc.type}</Text>
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

  // ─── Empty tab fallback ─────────────────────────────────────
  const renderEmptyTab = () => (
    <View style={styles.emptyTab}>
      <Icon name="information-outline" size={36} color={theme.colors.textLight} />
      <Text style={styles.emptyTabTitle}>Content coming soon</Text>
      <Text style={styles.emptyTabText}>No information available for this section yet.</Text>
    </View>
  );

  const tabContent = [renderOverview, renderAgronomy, renderHighlights, renderMedia, renderDocuments];

  return (
    <View style={styles.container}>
      <Header
        title={family.name}
        subtitle={family.tagline}
        onBack={() => navigation.goBack()}
      />

      {/* Tab Bar */}
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

// ─── Sub-components ─────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={18} color={theme.colors.primary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Tab bar (matches ProductDetailScreen)
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
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroName: { fontSize: 26, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  heroTagline: { fontSize: 14, fontWeight: '500', color: theme.colors.textSecondary, textAlign: 'center', marginTop: 4 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 12, gap: 6 },
  aiBadgeText: { fontSize: 13, fontWeight: '600' },

  // Description
  description: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 23, marginBottom: 16 },

  // Variant Selector
  variantScroll: { paddingRight: 16, gap: 10 },
  variantCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  variantName: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 6, textAlign: 'center' },
  formBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginBottom: 6 },
  formBadgeText: { fontSize: 11, fontWeight: '700' },
  variantConc: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },

  // Variant indicator
  variantIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 4,
  },
  variantIndicatorText: { fontSize: 13, fontWeight: '600' },

  // Info grid (Technical Profile)
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
  packChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  packText: { fontSize: 14, fontWeight: '600', color: '#2E7D32' },

  // Technical Summary
  summaryCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, ...theme.shadows.sm },
  summaryIcon: { marginTop: 2 },
  summaryText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 21 },

  // Compare Formulations
  compareScroll: { gap: 10, paddingRight: 16 },
  compareCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, width: 160, ...theme.shadows.sm },
  compareName: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 6 },
  compareRow: { marginTop: 8 },
  compareLabel: { fontSize: 11, color: theme.colors.textLight, fontWeight: '500' },
  compareValue: { fontSize: 13, color: theme.colors.text, fontWeight: '600', marginTop: 1 },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  chipText: { fontSize: 13, fontWeight: '500' },

  // Dosage cards
  dosageCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, overflow: 'hidden', ...theme.shadows.sm },
  dosageHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '0A', paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  dosageStage: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.colors.text },
  dosageBody: { paddingHorizontal: 14, paddingVertical: 10 },
  dosageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dosageLabel: { width: 60, fontSize: 12, fontWeight: '600', color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  dosageValue: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.text, lineHeight: 20 },
  dosageDivider: { height: 1, backgroundColor: theme.colors.divider },

  // Schedule cards
  scheduleCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, overflow: 'hidden', ...theme.shadows.sm },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  scheduleIndex: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  scheduleIndexText: { fontSize: 13, fontWeight: '700' },
  scheduleTiming: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.colors.text },
  scheduleBody: { paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  scheduleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  scheduleLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },
  scheduleValue: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.text, lineHeight: 20 },

  // Benefits
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  benefitDot: { marginRight: 10, marginTop: 2 },
  benefitText: { flex: 1, fontSize: 15, color: theme.colors.text, lineHeight: 22 },

  // MOA / Compatibility
  moaCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, gap: 10, alignItems: 'flex-start', ...theme.shadows.sm },
  moaText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 21 },

  // Problem & Solution
  psContainer: { marginBottom: 16 },
  psCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, alignItems: 'flex-start', gap: 10, ...theme.shadows.sm },
  psIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  psContent: { flex: 1 },
  psLabel: { fontSize: 11, fontWeight: '700', color: '#D32F2F', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  psText: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
  psArrow: { alignItems: 'center', paddingVertical: 4 },

  // Storage
  storageCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, ...theme.shadows.sm },
  storageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  storageContent: { flex: 1 },
  storageLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  storageValue: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
  storageDivider: { height: 1, backgroundColor: theme.colors.divider, marginVertical: 6 },

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
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  docIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  docMeta: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  docBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docBadgeText: { fontSize: 11, color: theme.colors.success, fontWeight: '500' },

  // Empty tab
  emptyTab: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTabTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: 12 },
  emptyTabText: { fontSize: 14, color: theme.colors.textLight, marginTop: 4, textAlign: 'center' },
});

export default PortfolioDetailScreen;
