import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { getPortfolioVariants } from '../constants/productData';
import { getCategoryColor, getFormulationColor } from '../utils/helpers';
import { getHeroImage, getMoaImage } from '../constants/productImages';
import { getProductDocuments } from '../constants/documentData';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const TABS = ['Overview', 'Agronomy', 'Highlights', 'Documents'];

const PortfolioDetailScreen = ({ route, navigation }) => {
  const { family } = route.params;
  const variants = useMemo(() => getPortfolioVariants(family.id), [family.id]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVariant = variants[selectedIndex] || null;
  const catColor = getCategoryColor(family.category);
  const heroImage = selectedVariant ? getHeroImage(selectedVariant.name) : null;
  const moaImage = selectedVariant ? getMoaImage(selectedVariant.name) : null;

  // ─── Overview Tab ───────────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      {/* Premium Hero Card */}
      <View style={styles.heroCard}>
        <View style={[styles.heroAccent, { backgroundColor: family.color }]} />
        <View style={styles.heroCardInner}>
          <View style={styles.heroCardLeft}>
            <Text style={styles.heroName}>{family.name}</Text>
            <Text style={styles.heroIngredient}>{family.activeIngredient}</Text>
            <Text style={styles.heroTagline}>{family.tagline}</Text>
            <View style={styles.heroBadges}>
              <View style={[styles.heroPill, { backgroundColor: family.color + '10', borderColor: family.color + '30' }]}>
                <Text style={[styles.heroPillText, { color: family.color }]}>{family.category}</Text>
              </View>
              {family.subcategory ? (
                <View style={[styles.heroPill, { backgroundColor: family.color + '08', borderColor: family.color + '20' }]}>
                  <Text style={[styles.heroPillText, { color: family.color }]}>{family.subcategory}</Text>
                </View>
              ) : null}
            </View>
          </View>
          {heroImage ? (
            <View style={styles.heroImageWrap}>
              <Image source={heroImage} style={styles.heroProductImage} contentFit="contain" transition={200} />
            </View>
          ) : (
            <View style={[styles.heroFallbackIcon, { backgroundColor: family.color + '08' }]}>
              <Icon name={family.icon} size={44} color={family.color} />
            </View>
          )}
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
                isActive && {
                  borderWidth: 2,
                  borderColor: family.color,
                  backgroundColor: family.color + '08',
                },
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
              <View style={[styles.formBadge, { backgroundColor: formColor + '10' }]}>
                <Text style={[styles.formBadgeText, { color: formColor }]}>{v.formulation}</Text>
              </View>
              {v.concentration ? (
                <Text style={[styles.variantConc, isActive && { color: family.color }]}>{v.concentration}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mode of Action Diagram */}
      <Text style={styles.sectionTitle}>Mode of Action</Text>
      {moaImage ? (
        <View style={styles.moaDiagramCard}>
          <Image source={moaImage} style={styles.moaDiagramImage} contentFit="contain" transition={200} />
        </View>
      ) : (
        <View style={styles.moaDiagramPlaceholder}>
          <Icon name="cog-outline" size={32} color={theme.colors.textLight} />
          <Text style={styles.moaDiagramPlaceholderText}>Mode of Action diagram coming soon</Text>
        </View>
      )}

      {/* Technical Profile — Clean Spec Card */}
      {selectedVariant ? (
        <View style={styles.specCard}>
          <View style={styles.specCardHeader}>
            <Icon name="flask-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.specCardTitle}>Technical Profile</Text>
          </View>
          <View style={styles.specCardBody}>
            <InfoRow icon="flask" label="Active Ingredient" value={selectedVariant.activeIngredient} />
            {selectedVariant.concentration ? (
              <InfoRow icon="percent" label="Concentration" value={selectedVariant.concentration} />
            ) : null}
            <InfoRow icon="beaker" label="Formulation" value={selectedVariant.formulation} />
            {selectedVariant.strainStrength ? (
              <InfoRow icon="dna" label="Strain / Active Strength" value={selectedVariant.strainStrength} />
            ) : null}
          </View>
        </View>
      ) : null}

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
                contentFit="contain"
                transition={200}
              />
            </View>
          ))}
        </View>
      ) : null}

      {/* Pack Sizes — Pill Style */}
      {selectedVariant?.packSizes && selectedVariant.packSizes.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Pack Sizes</Text>
          <View style={styles.packSizes}>
            {selectedVariant.packSizes.map((size, i) => (
              <View key={i} style={styles.packPill}>
                <Text style={styles.packPillText}>{size}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Technical Positioning — Insight Card */}
      {selectedVariant?.technicalSummary ? (
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Icon name="bullseye-arrow" size={20} color={theme.colors.secondary} />
            <Text style={styles.insightTitle}>Technical Positioning</Text>
          </View>
          <Text style={styles.insightText}>{selectedVariant.technicalSummary}</Text>
        </View>
      ) : null}
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

  // ─── Documents Tab ──────────────────────────────────────────
  const renderDocuments = () => {
    const DOC_ICON_MAP = {
      'COA': { icon: 'file-certificate', color: '#4CAF50', label: 'Certificate of Analysis' },
      'SDS/MSDS': { icon: 'file-alert', color: '#F44336', label: 'Safety Data Sheet' },
      'TDS': { icon: 'file-document', color: '#2196F3', label: 'Technical Data Sheet' },
      'Brochure': { icon: 'file-presentation-box', color: '#FF9800', label: 'Product Brochure' },
      'Product Label': { icon: 'label', color: '#9C27B0', label: 'Product Label' },
    };

    const displayName = selectedVariant ? selectedVariant.name : family.name;
    const realDocs = selectedVariant ? getProductDocuments(selectedVariant.name) : [];
    const placeholderTypes = ['TDS', 'Brochure', 'Product Label'];

    const openDoc = (doc) => {
      navigation.navigate('CertificateViewer', {
        certName: `${displayName} - ${doc.docType === 'SDS/MSDS' ? 'MSDS' : doc.docType}`,
        authority: DOC_ICON_MAP[doc.docType]?.label || doc.docType,
        asset: doc.asset,
      });
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Documents</Text>
        {realDocs.map((doc) => {
          const meta = DOC_ICON_MAP[doc.docType];
          return (
            <TouchableOpacity key={doc.id} style={styles.docRow} activeOpacity={0.7} onPress={() => openDoc(doc)}>
              <View style={[styles.docIcon, { backgroundColor: meta.color + '15' }]}>
                <Icon name={meta.icon} size={22} color={meta.color} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{displayName} - {doc.docType === 'SDS/MSDS' ? 'SDS / MSDS' : doc.docType}</Text>
                <Text style={styles.docMeta}>PDF document</Text>
              </View>
              <View style={styles.docBadge}>
                <Icon name="check-circle" size={14} color={theme.colors.success} />
                <Text style={styles.docBadgeText}>Offline</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {placeholderTypes.map((type) => {
          const meta = DOC_ICON_MAP[type];
          return (
            <TouchableOpacity key={type} style={[styles.docRow, { opacity: 0.5 }]} activeOpacity={1}>
              <View style={[styles.docIcon, { backgroundColor: meta.color + '15' }]}>
                <Icon name={meta.icon} size={22} color={meta.color} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{displayName} - {type}</Text>
                <Text style={styles.docMeta}>PDF document</Text>
              </View>
              <View style={styles.docBadge}>
                <Icon name="clock-outline" size={14} color={theme.colors.textLight} />
                <Text style={[styles.docBadgeText, { color: theme.colors.textLight }]}>Pending</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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

  const tabContent = [renderOverview, renderAgronomy, renderHighlights, renderDocuments];

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
const InfoRow = React.memo(({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <Icon name={icon} size={16} color={theme.colors.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
));

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Tab bar
  tabBar: { backgroundColor: '#FFF', ...theme.shadows.sm },
  tabScroll: { paddingHorizontal: 16 },
  tab: { paddingHorizontal: 18, paddingVertical: 14 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: theme.colors.textLight, letterSpacing: 0.2 },
  tabTextActive: { color: theme.colors.primary, fontWeight: '700' },

  // Section
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 28,
    marginBottom: 14,
  },

  // Premium Hero
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.lg,
    marginBottom: 20,
  },
  heroAccent: {
    height: 3,
    width: '100%',
  },
  heroCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 32 : 28,
  },
  heroCardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  heroName: {
    fontSize: isTablet ? 28 : 26,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  heroIngredient: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  heroTagline: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textLight,
    marginTop: 2,
    lineHeight: 18,
  },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 8 },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroPillText: { fontSize: 12, fontWeight: '600' },
  heroImageWrap: {
    width: isTablet ? 180 : 160,
    height: isTablet ? 260 : 240,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroProductImage: {
    width: '100%',
    height: '100%',
  },
  heroFallbackIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },

  // Description
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 4,
    letterSpacing: 0.1,
  },

  // Variant Selector — Apple-style (no elevation to avoid Android double-edge)
  variantScroll: { paddingRight: 20, gap: 10 },
  variantCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: isTablet ? 136 : 120,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  variantName: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 6, textAlign: 'center' },
  formBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 5,
  },
  formBadgeText: { fontSize: 11, fontWeight: '600' },
  variantConc: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },

  // Variant indicator
  variantIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 4,
  },
  variantIndicatorText: { fontSize: 13, fontWeight: '600' },

  // Spec Card (Technical Profile)
  specCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 28,
    ...theme.shadows.md,
  },
  specCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.primary + '06',
  },
  specCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  specCardBody: {
    padding: 4,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '0C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: theme.colors.textLight, fontWeight: '500', letterSpacing: 0.3 },
  infoValue: { fontSize: 15, color: theme.colors.text, fontWeight: '600', marginTop: 3 },

  // Technical images
  techImagesWrap: { marginTop: 12, gap: 10 },
  techImageCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
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

  // Pack sizes — pill style
  packSizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  packPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '35',
    backgroundColor: '#FFF',
  },
  packPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },

  // Insight card (Technical Positioning)
  insightCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
    padding: 20,
    marginTop: 28,
    ...theme.shadows.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  insightText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  // Mode of Action diagram
  moaDiagramCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  moaDiagramImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 2,
  },
  moaDiagramPlaceholder: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  moaDiagramPlaceholderText: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 10,
    fontStyle: 'italic',
  },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  chipText: { fontSize: 13, fontWeight: '500' },

  // Dosage cards
  dosageCard: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 10, overflow: 'hidden', ...theme.shadows.sm },
  dosageHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '0A', paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  dosageStage: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.colors.text },
  dosageBody: { paddingHorizontal: 14, paddingVertical: 10 },
  dosageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dosageLabel: { width: 60, fontSize: 12, fontWeight: '600', color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  dosageValue: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.text, lineHeight: 20 },
  dosageDivider: { height: 1, backgroundColor: theme.colors.divider },

  // Schedule cards
  scheduleCard: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 10, overflow: 'hidden', ...theme.shadows.sm },
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
  moaCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 16, gap: 10, alignItems: 'flex-start', ...theme.shadows.sm },
  moaText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },

  // Problem & Solution
  psContainer: { marginBottom: 16 },
  psCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 14, alignItems: 'flex-start', gap: 10, ...theme.shadows.sm },
  psIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  psContent: { flex: 1 },
  psLabel: { fontSize: 11, fontWeight: '700', color: '#D32F2F', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  psText: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
  psArrow: { alignItems: 'center', paddingVertical: 4 },

  // Storage
  storageCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, ...theme.shadows.sm },
  storageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  storageContent: { flex: 1 },
  storageLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  storageValue: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
  storageDivider: { height: 1, backgroundColor: theme.colors.divider, marginVertical: 6 },

  // Documents
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  docIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
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
