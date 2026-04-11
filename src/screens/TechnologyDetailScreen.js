import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { getHeroDetailImage, getPillarImage, getProcessImage, getImageAspectRatio, titleFromFilename } from '../constants/technologyImages';

// Process flow labels for each platform (derived from JSON pillar order)
const PROCESS_FLOWS = {
  wynn: ['Discover', 'Decode', 'Optimize', 'Recover', 'Stabilize', 'Validate'],
  karyo: ['Protect', 'Encapsulate', 'Combine', 'Deliver', 'Adapt', 'Perform'],
  microvate: ['Separate', 'Protect', 'Trigger', 'Activate', 'Interact', 'Perform'],
};

const TechnologyDetailScreen = ({ route, navigation }) => {
  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= 768;

  const { tech } = route.params;
  const processFlow = PROCESS_FLOWS[tech.id] || [];
  const heroImage = getHeroDetailImage(tech.id);
  const pillarImage = getPillarImage(tech.id);
  const processImage = getProcessImage(tech.id);
  const imageTitle = titleFromFilename(tech.id);

  const [zoomImage, setZoomImage] = useState(null);

  // Compute image heights: fill width, respect aspect ratio, cap at 45% screen height
  const heroAspect = getImageAspectRatio('heroDetail', tech.id);
  const pillarAspect = getImageAspectRatio('pillar');
  const processAspect = getImageAspectRatio('process');
  const maxImgH = winH * 0.5;
  const pillarH = Math.min(winW / pillarAspect, maxImgH);
  const processH = Math.min(winW / processAspect, maxImgH);

  // ─── Hero Section ─────────────────────────────────────────
  const renderHero = () => (
    <View>
      {/* Image banner or colored fallback */}
      {heroImage ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => setZoomImage(heroImage)}>
          <View style={[styles.heroImageBanner, { aspectRatio: heroAspect }]}>
            <Image
              source={heroImage}
              style={styles.responsiveImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.heroFallbackBanner, { backgroundColor: tech.color }]}>
          <View style={styles.heroIconCircle}>
            <Icon name={tech.icon} size={isTablet ? 48 : 40} color="rgba(255,255,255,0.95)" />
          </View>
        </View>
      )}
      {/* Title + tagline below the image */}
      <View style={styles.heroTextBlock}>
        <Text style={[styles.heroTitle, { color: tech.color }]}>{tech.name}</Text>
        <Text style={styles.heroTagline}>{tech.tagline}</Text>
      </View>
    </View>
  );

  // ─── Platform Overview ────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.bodyText}>{tech.description}</Text>
      {tech.overview ? (
        <View style={styles.overviewCard}>
          <View style={styles.overviewAccent} />
          <View style={styles.overviewBody}>
            <Icon name="information-outline" size={18} color={tech.color} />
            <Text style={styles.overviewText}>{tech.overview}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );

  // ─── Core Positioning ─────────────────────────────────────
  const renderCorePositioning = () => {
    if (!tech.corePositioning) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Positioning</Text>
        <View style={styles.positioningCard}>
          <View style={[styles.positioningAccent, { backgroundColor: tech.color }]} />
          <View style={styles.positioningBody}>
            <Icon name="bullseye-arrow" size={22} color={tech.color} />
            <Text style={styles.positioningText}>{tech.corePositioning}</Text>
          </View>
        </View>
      </View>
    );
  };

  // ─── Six-Pillar Architecture ──────────────────────────────
  const renderPillars = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Six-Pillar Architecture</Text>
      {pillarImage ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => setZoomImage(pillarImage)}>
          <View style={[styles.sectionImageWrap, { height: pillarH }]}>
            <Image
              source={pillarImage}
              style={styles.responsiveImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      ) : null}
      <View style={styles.pillarGrid}>
        {tech.features.map((f, i) => (
          <View key={i} style={styles.pillarCard}>
            <View style={[styles.pillarIconWrap, { backgroundColor: tech.color + '0C' }]}>
              <Icon name={f.icon || 'star'} size={22} color={tech.color} />
            </View>
            <View style={styles.pillarContent}>
              <Text style={[styles.pillarNumber, { color: tech.color }]}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.pillarTitle}>{f.title}</Text>
              <Text style={styles.pillarDesc}>{f.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── How It Works (Process Flow) ──────────────────────────
  const renderProcessFlow = () => {
    if (processFlow.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How {tech.name} Works</Text>
        {processImage ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => setZoomImage(processImage)}>
            <View style={[styles.sectionImageWrap, { height: processH }]}>
              <Image
                source={processImage}
                style={styles.responsiveImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ) : null}
        <View style={styles.flowCard}>
          <View style={styles.flowContainer}>
            {processFlow.map((step, i) => (
              <View key={i} style={styles.flowStepWrap}>
                <View style={[styles.flowStep, { backgroundColor: tech.color }]}>
                  <Text style={styles.flowStepNum}>{i + 1}</Text>
                </View>
                <Text style={[styles.flowStepLabel, { color: tech.color }]}>{step}</Text>
                {i < processFlow.length - 1 ? (
                  <View style={styles.flowArrow}>
                    <Icon name="chevron-right" size={16} color={tech.color + '60'} />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
          <Text style={styles.flowCaption}>
            Each step corresponds to a pillar in the {tech.name} architecture above.
          </Text>
        </View>
      </View>
    );
  };

  // ─── What Makes It Different ──────────────────────────────
  const renderDifferentiators = () => {
    if (!tech.differentiators || tech.differentiators.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Makes {tech.name} Different</Text>
        {tech.differentiators.map((d, i) => (
          <View key={i} style={styles.diffCard}>
            <View style={[styles.diffAccent, { backgroundColor: tech.color }]} />
            <View style={styles.diffContent}>
              <Text style={styles.diffTitle}>{d.title}</Text>
              <Text style={styles.diffBody}>{d.body}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ─── Role in the Stack (Scope) ────────────────────────────
  const renderScope = () => {
    if (!tech.scope) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{tech.scope.title}</Text>
        <View style={styles.scopeCard}>
          {/* Owns */}
          <View style={styles.scopeBlock}>
            <View style={styles.scopeHeaderRow}>
              <View style={[styles.scopeIconWrap, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.scopeHeaderText}>Owns</Text>
            </View>
            {tech.scope.owns.map((item, i) => (
              <View key={i} style={styles.scopeItemRow}>
                <View style={[styles.scopeDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.scopeItemText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.scopeDivider} />
          {/* Does Not Own */}
          <View style={styles.scopeBlock}>
            <View style={styles.scopeHeaderRow}>
              <View style={[styles.scopeIconWrap, { backgroundColor: '#F5F5F5' }]}>
                <Icon name="close-circle-outline" size={16} color={theme.colors.textLight} />
              </View>
              <Text style={[styles.scopeHeaderText, { color: theme.colors.textLight }]}>Does Not Own</Text>
            </View>
            {tech.scope.does_not_own.map((item, i) => (
              <View key={i} style={styles.scopeItemRow}>
                <View style={[styles.scopeDot, { backgroundColor: theme.colors.textLight }]} />
                <Text style={[styles.scopeItemText, { color: theme.colors.textLight }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // ─── Future Potential ─────────────────────────────────────
  const renderFuture = () => {
    if (!tech.futurePotential) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Future Potential</Text>
        <View style={styles.futureCard}>
          <View style={[styles.futureAccent, { backgroundColor: tech.color }]} />
          <View style={styles.futureBody}>
            <Icon name="rocket-launch-outline" size={20} color={tech.color} />
            <Text style={styles.futureText}>{tech.futurePotential}</Text>
          </View>
        </View>
      </View>
    );
  };

  // ─── Closing Summary ──────────────────────────────────────
  const renderClosing = () => {
    if (!tech.closing) return null;
    return (
      <View style={styles.closingSection}>
        <View style={[styles.closingCard, { backgroundColor: tech.color }]}>
          <Text style={styles.closingTitle}>{tech.closing.title}</Text>
          <Text style={styles.closingBody}>{tech.closing.body}</Text>
        </View>
      </View>
    );
  };

  // ─── Back to Stack Button ─────────────────────────────────
  const renderBackToStack = () => (
    <TouchableOpacity
      style={styles.backToStack}
      activeOpacity={0.7}
      onPress={() => navigation.goBack()}>
      <Icon name="arrow-left" size={18} color={theme.colors.primary} />
      <Text style={styles.backToStackText}>Back to Technology Stack</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={tech.name} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHero()}
        {renderOverview()}
        {renderCorePositioning()}
        {renderPillars()}
        {renderProcessFlow()}
        {renderDifferentiators()}
        {renderScope()}
        {renderFuture()}
        {renderClosing()}
        {renderBackToStack()}
      </ScrollView>
      <ImageViewer
        visible={!!zoomImage}
        imageSource={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 40 },

  // ─── Responsive image (fills container, preserves ratio) ────
  responsiveImage: {
    width: '100%',
    height: '100%',
  },

  // ─── Hero ─────────────────────────────────────────────────
  heroImageBanner: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  heroFallbackBanner: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroTagline: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: 0.1,
  },

  // ─── Section Image (pillar & process images) ───────────────
  sectionImageWrap: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    ...theme.shadows.md,
  },

  // ─── Section ──────────────────────────────────────────────
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
    letterSpacing: 0.1,
    textAlign: 'justify',
  },

  // ─── Overview ─────────────────────────────────────────────
  overviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  overviewAccent: {
    height: 2,
    backgroundColor: theme.colors.primary + '30',
  },
  overviewBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 18,
  },
  overviewText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
  },

  // ─── Core Positioning ─────────────────────────────────────
  positioningCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  positioningAccent: {
    height: 3,
    width: '100%',
  },
  positioningBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
  },
  positioningText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'justify',
  },

  // ─── Pillar Grid ──────────────────────────────────────────
  pillarGrid: {
    gap: 12,
  },
  pillarCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...theme.shadows.sm,
  },
  pillarIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarContent: {
    flex: 1,
  },
  pillarNumber: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 3,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  pillarDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
    textAlign: 'justify',
  },

  // ─── Process Flow ─────────────────────────────────────────
  flowCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.sm,
  },
  flowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  flowStepWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  flowStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepNum: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  flowStepLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  flowArrow: {
    marginHorizontal: 3,
  },
  flowCaption: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // ─── Differentiators ──────────────────────────────────────
  diffCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  diffAccent: {
    width: 4,
  },
  diffContent: {
    flex: 1,
    padding: 16,
  },
  diffTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  diffBody: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: 'justify',
  },

  // ─── Scope ────────────────────────────────────────────────
  scopeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  },
  scopeBlock: {
    gap: 8,
  },
  scopeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  scopeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scopeItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingLeft: 8,
  },
  scopeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  scopeItemText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: 'justify',
  },
  scopeDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 16,
  },

  // ─── Future Potential ─────────────────────────────────────
  futureCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  futureAccent: {
    height: 3,
    width: '100%',
  },
  futureBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
  },
  futureText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
  },

  // ─── Closing ──────────────────────────────────────────────
  closingSection: {
    padding: 20,
  },
  closingCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  closingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  closingBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // ─── Back to Stack ────────────────────────────────────────
  backToStack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '30',
    ...theme.shadows.sm,
  },
  backToStackText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});

export default TechnologyDetailScreen;
