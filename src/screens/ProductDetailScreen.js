import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { getCategoryColor, getFormulationColor } from '../utils/helpers';
import { getPortfolioForProduct, getRelatedProducts } from '../constants/productData';
import { getHeroImage, getMoaImage } from '../constants/productImages';
import { getProductDocuments } from '../constants/documentData';

const TABS = ['Overview', 'Agronomy', 'Highlights', 'Documents'];

const ProductDetailScreen = ({ route, navigation }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const isLandscape = screenWidth > screenHeight;

  const { product, fromPortfolio } = route.params;
  const [activeTab, setActiveTab] = useState(0);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const catColor = getCategoryColor(product.category);
  const heroImage = getHeroImage(product.name);
  const moaImage = getMoaImage(product.name);
  const relatedProducts = getRelatedProducts(product);

  // ─── Overview Tab ───────────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      {/* ═══ Premium Hero Zone — soft biotech gradient background ═══ */}
      <View style={styles.heroZoneBg}>
        <LinearGradient
          colors={['#DCF0E4', '#E5F2EA', '#EDF5F0', theme.colors.background]}
          locations={[0, 0.3, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />
        <View style={styles.heroDecor3} />
      </View>

      {/* Premium Hero Card — elevated above gradient */}
      <View style={styles.heroCard}>
        <View style={[styles.heroAccent, { backgroundColor: catColor }]} />

        {/* ── Inner botanical gradient background ── */}
        <LinearGradient
          colors={[catColor + '0A', '#DFF3EA22', '#E8F5EC15', '#FFFFFF']}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* ── Decorative organic shapes (very subtle) ── */}
        <View style={[styles.heroOrganic1, { backgroundColor: catColor + '08' }]} />
        <View style={[styles.heroOrganic2, { backgroundColor: catColor + '06' }]} />
        <View style={[styles.heroOrganic3, { backgroundColor: catColor + '05' }]} />

        <View style={[styles.heroCardInner, {
          padding: isTablet ? 32 : 24,
          minHeight: isLandscape ? 340 : undefined,
        }]}>
          <View style={[styles.heroCardLeft, {
            flex: isLandscape ? undefined : 1,
            width: isLandscape ? '60%' : undefined,
            paddingRight: isLandscape ? 28 : (isTablet ? 16 : 0),
          }]}>
            <View style={styles.nameRow}>
              <Text style={[styles.heroName, { fontSize: isTablet ? (isLandscape ? 32 : 28) : 24 }]}>{product.name}</Text>
              <Text style={styles.tmSymbol}>{'\u2122'}</Text>
            </View>
            <Text style={styles.heroIngredient}>{product.activeIngredient}</Text>
            <View style={styles.heroBadges}>
              <View style={[styles.heroPill, { backgroundColor: catColor + '10', borderColor: catColor + '30' }]}>
                <Text style={[styles.heroPillText, { color: catColor }]}>{product.category}</Text>
              </View>
              {product.subcategory ? (
                <View style={[styles.heroPill, { backgroundColor: catColor + '08', borderColor: catColor + '20' }]}>
                  <Text style={[styles.heroPillText, { color: catColor }]}>{product.subcategory}</Text>
                </View>
              ) : null}
              <View style={[styles.heroPill, { backgroundColor: getFormulationColor(product.formulation) + '10', borderColor: getFormulationColor(product.formulation) + '30' }]}>
                <Text style={[styles.heroPillText, { color: getFormulationColor(product.formulation) }]}>{product.formulation}</Text>
              </View>
            </View>
          </View>
          {heroImage ? (
            <View style={[styles.heroImageWrap, isLandscape ? {
              width: '38%',
              height: 320,
              marginLeft: 0,
            } : {
              width: isTablet ? screenWidth * 0.32 : screenWidth * 0.38,
              height: isTablet ? 300 : 260,
            }]}>
              {/* Radial glow behind product image */}
              <View style={[styles.heroImageGlow, { backgroundColor: catColor + '0C' }]} />
              <TouchableOpacity activeOpacity={0.8} onPress={() => setZoomImage(heroImage)} style={StyleSheet.absoluteFill}>
                <Image source={heroImage} style={styles.heroProductImage} contentFit="contain" transition={200} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.heroFallbackIcon, { backgroundColor: catColor + '08' }]}>
              <Icon name="leaf" size={44} color={catColor} />
            </View>
          )}
        </View>
      </View>

      {/* Product Overview */}
      {product.overview ? (
        <Text style={styles.description}>{product.overview}</Text>
      ) : product.description ? (
        <Text style={styles.description}>{product.description}</Text>
      ) : null}

      {/* Choose the Right Variant */}
      {product.portfolioId && !fromPortfolio ? (
        <>
          <Text style={styles.sectionTitle}>Choose the Right Variant</Text>
          <TouchableOpacity
            style={[styles.variantBtn, { borderColor: catColor }]}
            onPress={() => {
              const family = getPortfolioForProduct(product.id);
              if (family) {
                navigation.navigate('PortfolioDetail', { family });
              }
            }}
            activeOpacity={0.7}>
            <Icon name="view-grid-outline" size={20} color={catColor} />
            <Text style={[styles.variantBtnText, { color: catColor }]}>View Full Range</Text>
            <Icon name="chevron-right" size={18} color={catColor} />
          </TouchableOpacity>
        </>
      ) : null}

      {/* Mode of Action Diagram */}
      <Text style={styles.sectionTitle}>Mode of Action</Text>
      {moaImage ? (
        <TouchableOpacity style={styles.moaDiagramCard} activeOpacity={0.8} onPress={() => setZoomImage(moaImage)}>
          <Image source={moaImage} style={styles.moaDiagramImage} contentFit="contain" transition={200} />
        </TouchableOpacity>
      ) : (
        <View style={styles.moaDiagramPlaceholder}>
          <Icon name="cog-outline" size={32} color={theme.colors.textLight} />
          <Text style={styles.moaDiagramPlaceholderText}>Mode of Action diagram coming soon</Text>
        </View>
      )}

      {/* Technical Profile — Clean Spec Card */}
      <View style={styles.specCard}>
        <View style={styles.specCardHeader}>
          <Icon name="flask-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.specCardTitle}>Technical Profile</Text>
        </View>
        <View style={styles.specCardBody}>
          <InfoRow icon="flask" label="Active Ingredient" value={product.activeIngredient} />
          {product.concentration ? (
            <InfoRow icon="percent" label="Concentration" value={product.concentration} />
          ) : null}
          <InfoRow icon="beaker" label="Formulation" value={product.formulation} />
          {product.strainStrength ? (
            <InfoRow icon="dna" label="Strain / Active Strength" value={product.strainStrength} />
          ) : null}
        </View>
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
                contentFit="contain"
                transition={200}
              />
            </View>
          ))}
        </View>
      ) : null}

      {/* Pack Sizes — Pill Style */}
      {product.packSizes && product.packSizes.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Pack Sizes</Text>
          <View style={styles.packSizes}>
            {product.packSizes.map((size, i) => (
              <View key={i} style={styles.packPill}>
                <Text style={styles.packPillText}>{size}</Text>
              </View>
            ))}
            <View style={styles.packPill}>
              <Text style={styles.packPillText}>Bulk Packing</Text>
            </View>
          </View>
        </>
      ) : null}

      {/* Technical Positioning — Insight Card */}
      {product.technicalSummary ? (
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Icon name="bullseye-arrow" size={20} color={theme.colors.secondary} />
            <Text style={styles.insightTitle}>Technical Positioning</Text>
          </View>
          <Text style={styles.insightText}>{product.technicalSummary}</Text>
        </View>
      ) : null}

      {/* Related Products — Shopify Style */}
      {relatedProducts.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>You May Also Like</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScroll}>
            {relatedProducts.map((rp) => {
              const rpImage = getHeroImage(rp.name);
              const rpColor = getCategoryColor(rp.category);
              return (
                <Pressable
                  key={rp.id}
                  style={styles.relatedCard}
                  onPress={() => navigation.push('ProductDetail', { product: rp })}
                  onLongPress={() => setPreviewProduct(rp)}>
                  <View style={[styles.relatedImageWrap, { backgroundColor: rpColor + '06' }]}>
                    {rpImage ? (
                      <Image source={rpImage} style={styles.relatedImage} contentFit="contain" transition={150} />
                    ) : (
                      <Icon name="leaf" size={32} color={rpColor} />
                    )}
                  </View>
                  <Text style={styles.relatedName} numberOfLines={2}>{rp.name}</Text>
                  <Text style={styles.relatedFormulation}>{rp.formulation}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
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
                  <Text style={styles.dosageLabel}>Water</Text>
                  <Text style={styles.dosageValue}>{entry.water_volume}</Text>
                </View>
                <View style={styles.dosageDivider} />
                <View style={styles.dosageRow}>
                  <Text style={styles.dosageLabel}>Dose</Text>
                  <Text style={styles.dosageValue}>{entry.dose_per_acre}</Text>
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

      {/* Mode of Action — Visual Numbered Steps */}
      {(product.mechanismOfAction || product.modeOfAction) ? (() => {
        const moaText = product.mechanismOfAction || product.modeOfAction;
        const steps = moaText
          .split(/(?<=\.)\s+/)
          .map(s => s.trim())
          .filter(s => s.length > 10);
        return (
          <>
            <Text style={styles.sectionTitle}>Mode of Action</Text>
            <View style={styles.moaStepsCard}>
              <View style={styles.moaStepsHeader}>
                <Icon name="cog-transfer-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.moaStepsTitle}>How It Works</Text>
              </View>
              {steps.map((step, i) => (
                <View key={i} style={styles.moaStepRow}>
                  <View style={styles.moaStepNumCol}>
                    <View style={[styles.moaStepNum, { backgroundColor: theme.colors.primary + '15' }]}>
                      <Text style={[styles.moaStepNumTxt, { color: theme.colors.primary }]}>{i + 1}</Text>
                    </View>
                    {i < steps.length - 1 && <View style={styles.moaStepLine} />}
                  </View>
                  <View style={styles.moaStepContent}>
                    <Text style={styles.moaStepText}>{step.replace(/\.$/, '')}</Text>
                  </View>
                </View>
              ))}
            </View>
            {moaImage && (
              <View style={styles.moaDiagramCard}>
                <Image source={moaImage} style={styles.moaDiagramImage} contentFit="contain" transition={200} />
              </View>
            )}
          </>
        );
      })() : null}

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

  // ─── Documents Tab ──────────────────────────────────────────
  const renderDocuments = () => {
    const DOC_ICON_MAP = {
      'COA': { icon: 'file-certificate', color: '#4CAF50', label: 'Certificate of Analysis' },
      'SDS/MSDS': { icon: 'file-alert', color: '#F44336', label: 'Safety Data Sheet' },
      'TDS': { icon: 'file-document-outline', color: '#2196F3', label: 'Technical Data Sheet' },
      'Brochure': { icon: 'file-presentation-box', color: '#FF9800', label: 'Product Brochure' },
      'Product Label': { icon: 'label', color: '#9C27B0', label: 'Product Label' },
    };

    // Real documents from bundled PDFs
    const realDocs = getProductDocuments(product.name);

    // Placeholder entries for doc types without real files
    const placeholderTypes = ['Product Label'];

    const openDoc = (doc) => {
      navigation.navigate('CertificateViewer', {
        certName: `${product.name} - ${doc.docType === 'SDS/MSDS' ? 'MSDS' : doc.docType}`,
        authority: DOC_ICON_MAP[doc.docType]?.label || doc.docType,
        asset: doc.asset,
      });
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Documents</Text>
        {realDocs.map((doc, i) => {
          const meta = DOC_ICON_MAP[doc.docType];
          return (
            <TouchableOpacity key={doc.id} style={styles.docRow} activeOpacity={0.7} onPress={() => openDoc(doc)}>
              <View style={[styles.docIcon, { backgroundColor: meta.color + '15' }]}>
                <Icon name={meta.icon} size={22} color={meta.color} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{product.name} - {doc.docType === 'SDS/MSDS' ? 'SDS / MSDS' : doc.docType}</Text>
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
                <Text style={styles.docTitle}>{product.name} - {type}</Text>
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

  const tabContent = [renderOverview, renderAgronomy, renderHighlights, renderDocuments];

  return (
    <View style={styles.container}>
      <Header title={`${product.name}\u2122`} subtitle={product.category} onBack={() => navigation.goBack()} />

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

      {/* Product Preview Modal (long press) */}
      <Modal
        visible={!!previewProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewProduct(null)}>
        <Pressable style={styles.previewOverlay} onPress={() => setPreviewProduct(null)}>
          <View style={styles.previewCard}>
            {previewProduct ? (
              <>
                <View style={styles.previewHeader}>
                  {getHeroImage(previewProduct.name) ? (
                    <Image
                      source={getHeroImage(previewProduct.name)}
                      style={styles.previewImage}
                      contentFit="contain"
                      transition={200}
                    />
                  ) : (
                    <View style={[styles.previewFallback, { backgroundColor: getCategoryColor(previewProduct.category) + '12' }]}>
                      <Icon name="leaf" size={32} color={getCategoryColor(previewProduct.category)} />
                    </View>
                  )}
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewName}>{previewProduct.name}</Text>
                    <Text style={styles.previewDetail}>{previewProduct.activeIngredient}</Text>
                    {previewProduct.concentration ? (
                      <Text style={styles.previewDetail}>{previewProduct.concentration}</Text>
                    ) : null}
                    <View style={[styles.previewPill, { backgroundColor: getFormulationColor(previewProduct.formulation) + '15' }]}>
                      <Text style={[styles.previewPillText, { color: getFormulationColor(previewProduct.formulation) }]}>
                        {previewProduct.formulation}
                      </Text>
                    </View>
                  </View>
                </View>
                {previewProduct.technicalSummary ? (
                  <Text style={styles.previewSummary} numberOfLines={3}>{previewProduct.technicalSummary}</Text>
                ) : previewProduct.overview ? (
                  <Text style={styles.previewSummary} numberOfLines={3}>{previewProduct.overview}</Text>
                ) : null}
                <TouchableOpacity
                  style={[styles.previewBtn, { backgroundColor: getCategoryColor(previewProduct.category) }]}
                  onPress={() => {
                    setPreviewProduct(null);
                    navigation.push('ProductDetail', { product: previewProduct });
                  }}>
                  <Text style={styles.previewBtnText}>View Details</Text>
                  <Icon name="chevron-right" size={18} color="#FFF" />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </Pressable>
      </Modal>

      <ImageViewer
        visible={!!zoomImage}
        imageSource={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Premium Hero Zone — biotech gradient background
  heroZoneBg: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 440,
    overflow: 'hidden',
  },
  heroDecor1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(46,125,50,0.05)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: 60,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(76,175,80,0.035)',
  },
  heroDecor3: {
    position: 'absolute',
    top: 80,
    right: '30%',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,137,123,0.025)',
  },

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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.06)',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  heroAccent: {
    height: 3,
    width: '100%',
  },
  heroOrganic1: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  heroOrganic2: {
    position: 'absolute',
    bottom: -30,
    left: '20%',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  heroOrganic3: {
    position: 'absolute',
    top: '40%',
    right: '35%',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  heroCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  heroName: {
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tmSymbol: { fontSize: 9, fontWeight: '400', marginTop: 2 },
  heroIngredient: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
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
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageGlow: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 999,
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

  // Description / Overview text
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 4,
    letterSpacing: 0.1,
    textAlign: 'justify',
  },

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
    textAlign: 'justify',
  },

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
    textAlign: 'justify',
  },

  // Apple-style variant button
  variantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: '#FFF',
    gap: 10,
    ...theme.shadows.sm,
  },
  variantBtnText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  // Benefits
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  benefitDot: { marginRight: 10, marginTop: 2 },
  benefitText: { flex: 1, fontSize: 15, color: theme.colors.text, lineHeight: 22, textAlign: 'justify' },

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

  // MOA Visual Steps
  moaStepsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  moaStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.primary + '06',
  },
  moaStepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  moaStepRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  moaStepNumCol: {
    alignItems: 'center',
    width: 36,
    paddingTop: 14,
  },
  moaStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moaStepNumTxt: {
    fontSize: 13,
    fontWeight: '800',
  },
  moaStepLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.primary + '18',
    marginVertical: 4,
  },
  moaStepContent: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 10,
    paddingRight: 4,
  },
  moaStepText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    letterSpacing: 0.1,
    textAlign: 'justify',
  },

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
  moaText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 21, textAlign: 'justify' },

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
    textAlign: 'justify',
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
    textAlign: 'justify',
  },
  storageDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 6,
  },

  // Related Products — Shopify style
  relatedScroll: { paddingRight: 20, gap: 14 },
  relatedCard: {
    width: 170,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  relatedImageWrap: {
    width: 120,
    height: 140,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  relatedFormulation: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textLight,
    marginTop: 4,
  },

  // Preview Modal
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  previewCard: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 24,
    ...theme.shadows.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  previewImage: {
    width: 80,
    height: 110,
  },
  previewFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
    marginLeft: 16,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  previewDetail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  previewPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  previewPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewSummary: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    paddingTop: 12,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  previewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

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
