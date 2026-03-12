import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { TECHNOLOGIES, getTechnologyById } from '../constants/technologyData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PLATFORM_IDS = ['wynn', 'karyo', 'microvate'];

const TechnologyScreen = ({ navigation }) => {
  const integrated = getTechnologyById('integrated');
  const platforms = PLATFORM_IDS.map(id => getTechnologyById(id));

  const navigateToDetail = (tech) => {
    navigation.navigate('TechnologyDetail', { tech });
  };

  // ─── Hero Section ─────────────────────────────────────────
  const renderHero = () => (
    <View style={styles.heroSection}>
      {/* Image placeholder: /assets/technology/mobile/stack-hero-integrated-tech.jpg */}
      <View style={styles.heroImagePlaceholder} accessibilityLabel="Integrated technology stack hero visual">
        <Icon name="link-variant" size={48} color={integrated.color} />
        <Text style={styles.placeholderLabel}>stack-hero-integrated-tech.jpg</Text>
      </View>
      <Text style={styles.heroHeadline}>{integrated.tagline}</Text>
      <Text style={styles.heroSubtitle}>{integrated.description}</Text>
    </View>
  );

  // ─── Stack Overview ───────────────────────────────────────
  const renderIntro = () => (
    <View style={styles.introCard}>
      <View style={styles.introIconWrap}>
        <Icon name="information-outline" size={20} color={theme.colors.primary} />
      </View>
      <Text style={styles.introTitle}>{integrated.introSection.title}</Text>
      <Text style={styles.introBody}>{integrated.introSection.body}</Text>
    </View>
  );

  // ─── Platform Cards ───────────────────────────────────────
  const renderPlatformCards = () => (
    <View style={styles.platformSection}>
      <Text style={styles.sectionTitle}>Explore the Stack</Text>
      {platforms.map((tech) => {
        const card = (integrated.platformCards || []).find(c =>
          c.name.replace('™', '').toLowerCase() === tech.id
        );
        return (
          <TouchableOpacity
            key={tech.id}
            style={[styles.platformCard, { borderLeftColor: tech.color }]}
            activeOpacity={0.7}
            onPress={() => navigateToDetail(tech)}>
            {/* Image placeholder for each platform card */}
            <View style={[styles.cardImagePlaceholder, { backgroundColor: tech.color + '08' }]}
              accessibilityLabel={`${tech.name} card visual`}>
              <Icon name={tech.icon} size={36} color={tech.color} />
              <Text style={styles.cardPlaceholderLabel}>
                {tech.id}-card-visual.jpg
              </Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconCircle, { backgroundColor: tech.color + '15' }]}>
                  <Icon name={tech.icon} size={24} color={tech.color} />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardName}>{tech.name}</Text>
                  {card && (
                    <Text style={[styles.cardCategory, { color: tech.color }]}>{card.category}</Text>
                  )}
                </View>
                <Icon name="chevron-right" size={22} color={theme.colors.textLight} />
              </View>
              {card && (
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {card.short_description}
                </Text>
              )}
              {card && (
                <View style={styles.cardRoleWrap}>
                  <Icon name="target" size={14} color={tech.color} />
                  <Text style={[styles.cardRole, { color: tech.color }]} numberOfLines={2}>
                    {card.role_statement}
                  </Text>
                </View>
              )}
              <View style={styles.featuresRow}>
                {tech.features.slice(0, 3).map((f, i) => (
                  <View key={i} style={[styles.featureChip, { backgroundColor: tech.color + '10' }]}>
                    <Text style={[styles.featureChipText, { color: tech.color }]} numberOfLines={1}>
                      {f.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ─── Relationship / Comparison Section ────────────────────
  const renderComparison = () => (
    <View style={styles.comparisonSection}>
      <Text style={styles.sectionTitle}>Role of Each Platform</Text>

      {/* Image placeholder: comparison diagram */}
      <View style={styles.comparisonImagePlaceholder}
        accessibilityLabel="Technology stack relationship diagram">
        <Icon name="sitemap" size={32} color={theme.colors.primary} />
        <Text style={styles.placeholderLabel}>stack-relationship-diagram.jpg</Text>
      </View>

      {/* Comparison cards */}
      {integrated.flow.map((item, i) => (
        <View key={i} style={[styles.comparisonCard, { borderLeftColor: item.color }]}>
          <View style={styles.comparisonHeader}>
            <View style={[styles.comparisonIconCircle, { backgroundColor: item.color + '15' }]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.comparisonHeaderText}>
              <Text style={styles.comparisonName}>{item.title}</Text>
              <View style={[styles.scopeBadge, { backgroundColor: item.color + '15' }]}>
                <Text style={[styles.scopeText, { color: item.color }]}>{item.platform}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.comparisonDesc}>{item.description}</Text>
        </View>
      ))}

      {/* Advanced Comparison Link */}
      <TouchableOpacity
        style={styles.advancedCompareBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TechnologyComparison')}>
        <Icon name="table-column" size={20} color="#FFF" />
        <Text style={styles.advancedCompareBtnText}>Advanced Platform Comparison</Text>
        <Icon name="chevron-right" size={20} color="#FFF" />
      </TouchableOpacity>

      {/* Comparison matrix */}
      <View style={styles.matrixCard}>
        <Text style={styles.matrixTitle}>Scope Comparison</Text>
        {/* Image placeholder: comparison board */}
        <View style={styles.matrixImagePlaceholder}
          accessibilityLabel="Platform scope comparison board">
          <Icon name="table" size={24} color={theme.colors.textLight} />
          <Text style={styles.placeholderLabel}>stack-comparison-board.jpg</Text>
        </View>
        <View style={styles.matrixRow}>
          <View style={styles.matrixHeaderCell}>
            <Text style={styles.matrixHeaderText}>Platform</Text>
          </View>
          <View style={styles.matrixHeaderCell}>
            <Text style={styles.matrixHeaderText}>Scope</Text>
          </View>
        </View>
        {integrated.flow.map((item, i) => (
          <View key={i} style={[styles.matrixRow, i % 2 === 0 && styles.matrixRowAlt]}>
            <View style={styles.matrixCell}>
              <View style={[styles.matrixDot, { backgroundColor: item.color }]} />
              <Text style={styles.matrixPlatformText}>{item.title}</Text>
            </View>
            <View style={styles.matrixCell}>
              <Text style={styles.matrixScopeText}>{item.platform}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── Closing Section ──────────────────────────────────────
  const renderClosing = () => (
    <View style={styles.closingSection}>
      <Text style={styles.closingTitle}>{integrated.closing.title}</Text>
      <Text style={styles.closingBody}>{integrated.closing.body}</Text>
      <View style={styles.advantagesList}>
        {integrated.advantages.map((a, i) => (
          <View key={i} style={styles.advantageRow}>
            <Icon name="check-circle" size={18} color={theme.colors.primary} />
            <Text style={styles.advantageText}>{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Technology Stack"
        subtitle="Science platforms behind performance"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderHero()}
        {renderIntro()}
        {renderPlatformCards()}
        {renderComparison()}
        {renderClosing()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 32 },

  // ─── Hero ─────────────────────────────────────────────────
  heroSection: {
    padding: 20,
    paddingTop: 8,
  },
  heroImagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  placeholderLabel: {
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 30,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 23,
  },

  // ─── Intro Card ───────────────────────────────────────────
  introCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 18,
    marginBottom: 8,
    ...theme.shadows.sm,
  },
  introIconWrap: {
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  introBody: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // ─── Section Title ────────────────────────────────────────
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  // ─── Platform Cards ───────────────────────────────────────
  platformSection: {
    padding: 16,
  },
  platformCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  cardPlaceholderLabel: {
    fontSize: 9,
    color: theme.colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 10,
  },
  cardRoleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  cardRole: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  featureChipText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ─── Comparison Section ───────────────────────────────────
  comparisonSection: {
    padding: 16,
  },
  comparisonImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCEDC8',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  comparisonCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  comparisonIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  comparisonHeaderText: {
    flex: 1,
  },
  comparisonName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scopeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  scopeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  comparisonDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // ─── Advanced Compare Button ─────────────────────────────
  advancedCompareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    ...theme.shadows.md,
  },
  advancedCompareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },

  // ─── Comparison Matrix ────────────────────────────────────
  matrixCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    ...theme.shadows.sm,
  },
  matrixTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  matrixImagePlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  matrixRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  matrixRowAlt: {
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
  },
  matrixHeaderCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  matrixHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  matrixCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  matrixDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  matrixPlatformText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  matrixScopeText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },

  // ─── Closing Section ──────────────────────────────────────
  closingSection: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    ...theme.shadows.md,
  },
  closingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  closingBody: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  advantagesList: {
    gap: 8,
  },
  advantageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  advantageText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 21,
  },
});

export default TechnologyScreen;
