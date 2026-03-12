import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Process flow labels for each platform (derived from JSON pillar order)
const PROCESS_FLOWS = {
  wynn: ['Discover', 'Decode', 'Optimize', 'Recover', 'Stabilize', 'Validate'],
  karyo: ['Protect', 'Encapsulate', 'Combine', 'Deliver', 'Adapt', 'Perform'],
  microvate: ['Separate', 'Protect', 'Trigger', 'Activate', 'Interact', 'Perform'],
};

const TechnologyDetailScreen = ({ route, navigation }) => {
  const { tech } = route.params;
  const processFlow = PROCESS_FLOWS[tech.id] || [];

  // ─── Hero Banner ──────────────────────────────────────────
  const renderHero = () => (
    <View>
      <View style={[styles.heroBanner, { backgroundColor: tech.color }]}>
        {/* Image placeholder: hero visual */}
        <View style={styles.heroImagePlaceholder}
          accessibilityLabel={`${tech.name} hero visual`}>
          <Icon name={tech.icon} size={56} color="rgba(255,255,255,0.9)" />
          <Text style={styles.heroPlaceholderLabel}>{tech.id}-hero-visual.jpg</Text>
        </View>
        <Text style={styles.heroTitle}>{tech.name}</Text>
        <Text style={styles.heroSubtitle}>{tech.tagline}</Text>
      </View>
    </View>
  );

  // ─── Platform Overview ────────────────────────────────────
  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.bodyText}>{tech.description}</Text>
      {tech.overview && (
        <View style={styles.overviewCard}>
          <View style={styles.overviewIconWrap}>
            <Icon name="information-outline" size={18} color={tech.color} />
          </View>
          <Text style={styles.overviewText}>{tech.overview}</Text>
        </View>
      )}
    </View>
  );

  // ─── Core Positioning ─────────────────────────────────────
  const renderCorePositioning = () => {
    if (!tech.corePositioning) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Positioning</Text>
        <View style={[styles.positioningCard, { borderLeftColor: tech.color }]}>
          <Icon name="bullseye-arrow" size={22} color={tech.color} style={styles.positioningIcon} />
          <Text style={styles.positioningText}>{tech.corePositioning}</Text>
        </View>
      </View>
    );
  };

  // ─── Six-Pillar Architecture ──────────────────────────────
  const renderPillars = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Six-Pillar Architecture</Text>
      {/* Image placeholder: six-pillar diagram */}
      <View style={[styles.diagramPlaceholder, { borderColor: tech.color + '40' }]}
        accessibilityLabel={`${tech.name} six-pillar architecture diagram`}>
        <Icon name="view-grid-outline" size={28} color={tech.color} />
        <Text style={styles.placeholderLabel}>{tech.id}-six-pillar-diagram.jpg</Text>
      </View>
      <View style={styles.pillarGrid}>
        {tech.features.map((f, i) => (
          <View key={i} style={styles.pillarCard}>
            <View style={[styles.pillarIconWrap, { backgroundColor: tech.color + '12' }]}>
              <Icon name={f.icon || 'star'} size={22} color={tech.color} />
            </View>
            <View style={styles.pillarContent}>
              <Text style={styles.pillarNumber}>{String(i + 1).padStart(2, '0')}</Text>
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
        {/* Image placeholder: process visual */}
        <View style={[styles.diagramPlaceholder, { borderColor: tech.color + '40' }]}
          accessibilityLabel={`${tech.name} process flow diagram`}>
          <Icon name="arrow-right-bold-outline" size={28} color={tech.color} />
          <Text style={styles.placeholderLabel}>{tech.id}-how-it-works.jpg</Text>
        </View>
        <View style={styles.flowContainer}>
          {processFlow.map((step, i) => (
            <View key={i} style={styles.flowStepWrap}>
              <View style={[styles.flowStep, { backgroundColor: tech.color }]}>
                <Text style={styles.flowStepNum}>{i + 1}</Text>
              </View>
              <Text style={[styles.flowStepLabel, { color: tech.color }]}>{step}</Text>
              {i < processFlow.length - 1 && (
                <View style={styles.flowArrow}>
                  <Icon name="chevron-right" size={16} color={tech.color + '80'} />
                </View>
              )}
            </View>
          ))}
        </View>
        {/* Link steps back to pillar detail */}
        <Text style={styles.flowCaption}>
          Each step corresponds to a pillar in the {tech.name} architecture above.
        </Text>
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
              <Icon name="check-circle" size={18} color={theme.colors.primary} />
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
              <Icon name="close-circle-outline" size={18} color={theme.colors.textLight} />
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
        {/* Image placeholder: future roadmap */}
        <View style={[styles.diagramPlaceholder, { borderColor: tech.color + '40' }]}
          accessibilityLabel={`${tech.name} future roadmap visual`}>
          <Icon name="road-variant" size={28} color={tech.color} />
          <Text style={styles.placeholderLabel}>{tech.id}-future-roadmap.jpg</Text>
        </View>
        <View style={[styles.futureCard, { borderLeftColor: tech.color }]}>
          <Icon name="rocket-launch-outline" size={20} color={tech.color} style={styles.futureIcon} />
          <Text style={styles.futureText}>{tech.futurePotential}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 32 },

  // ─── Hero ─────────────────────────────────────────────────
  heroBanner: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroPlaceholderLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // ─── Section ──────────────────────────────────────────────
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 23,
    marginBottom: 16,
  },

  // ─── Overview ─────────────────────────────────────────────
  overviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    ...theme.shadows.sm,
  },
  overviewIconWrap: {
    marginBottom: 8,
  },
  overviewText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // ─── Core Positioning ─────────────────────────────────────
  positioningCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...theme.shadows.sm,
  },
  positioningIcon: {
    marginTop: 2,
  },
  positioningText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: '500',
  },

  // ─── Pillar Grid ──────────────────────────────────────────
  diagramPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  placeholderLabel: {
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
  pillarGrid: {
    gap: 10,
  },
  pillarCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    ...theme.shadows.sm,
  },
  pillarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarContent: {
    flex: 1,
  },
  pillarNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textLight,
    letterSpacing: 1,
    marginBottom: 2,
  },
  pillarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  pillarDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 3,
    lineHeight: 19,
  },

  // ─── Process Flow ─────────────────────────────────────────
  flowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    gap: 4,
    ...theme.shadows.sm,
  },
  flowStepWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  flowStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepNum: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  flowStepLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  flowArrow: {
    marginHorizontal: 2,
  },
  flowCaption: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

  // ─── Differentiators ──────────────────────────────────────
  diffCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  diffAccent: {
    width: 4,
  },
  diffContent: {
    flex: 1,
    padding: 14,
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
  },

  // ─── Scope ────────────────────────────────────────────────
  scopeCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    ...theme.shadows.sm,
  },
  scopeBlock: {
    gap: 6,
  },
  scopeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
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
    paddingLeft: 6,
  },
  scopeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  scopeItemText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 19,
  },
  scopeDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 14,
  },

  // ─── Future Potential ─────────────────────────────────────
  futureCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...theme.shadows.sm,
  },
  futureIcon: {
    marginTop: 2,
  },
  futureText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // ─── Closing ──────────────────────────────────────────────
  closingSection: {
    padding: 16,
  },
  closingCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  closingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  closingBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    textAlign: 'center',
  },

  // ─── Back to Stack ────────────────────────────────────────
  backToStack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    ...theme.shadows.sm,
  },
  backToStackText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default TechnologyDetailScreen;
