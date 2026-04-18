import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ImageViewer from '../components/common/ImageViewer';
import theme from '../constants/theme';
import { getTechnologyById } from '../constants/technologyData';
import { getTopTechnologyImage, getImageAspectRatio } from '../constants/technologyImages';

const stackDiagramImage = require('../assets/images/TeckStack/roleofeachplatform.png');
const topTechImage = getTopTechnologyImage();

const PLATFORM_IDS = ['wynn', 'microvate', 'karyo'];

const TechnologyScreen = ({ navigation }) => {
  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= 768;

  const integrated = getTechnologyById('integrated');
  const platforms = PLATFORM_IDS.map(id => getTechnologyById(id));
  const [zoomImage, setZoomImage] = useState(null);

  // Known aspect ratios (width/height) from actual image dimensions
  const topImageAspect = getImageAspectRatio('top');  // 1.5

  const navigateToDetail = (tech) => {
    navigation.navigate('TechnologyDetail', { tech });
  };

  // ─── Hero Section ─────────────────────────────────────────
  const renderHero = () => (
    <View style={styles.heroSection}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setZoomImage(topTechImage)}>
        <View style={[styles.heroImageWrap, { aspectRatio: topImageAspect }]}>
          <Image
            source={topTechImage}
            style={styles.responsiveImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <Text style={[styles.heroHeadline, { fontSize: isTablet ? 26 : 22 }]}>{integrated.tagline}</Text>
      <Text style={styles.heroSubtitle}>{integrated.description}</Text>
    </View>
  );

  // ─── Stack Overview ───────────────────────────────────────
  const renderIntro = () => (
    <View style={styles.introCard}>
      <View style={styles.introAccent} />
      <View style={styles.introBody}>
        <View style={styles.introIconRow}>
          <Icon name="information-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.introTitle}>{integrated.introSection.title}</Text>
        </View>
        <Text style={styles.introText}>{integrated.introSection.body}</Text>
      </View>
    </View>
  );

  // ─── Platform Cards (no images — color accent only) ──────
  const renderPlatformCards = () => (
    <View style={styles.platformSection}>
      <Text style={[styles.sectionTitle, { fontSize: isTablet ? 14 : 13, marginBottom: isTablet ? 20 : 16 }]}>Explore the Stack</Text>
      {platforms.map((tech) => {
        const card = (integrated.platformCards || []).find(c =>
          c.name.replace('™', '').toLowerCase() === tech.id
        );
        return (
          <TouchableOpacity
            key={tech.id}
            style={[styles.platformCard, { marginBottom: isTablet ? 24 : 20 }]}
            activeOpacity={0.7}
            onPress={() => navigateToDetail(tech)}>
            <View style={[styles.cardAccent, { backgroundColor: tech.color }]} />
            <View style={[styles.cardContent, { padding: isTablet ? 24 : 20 }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconCircle, { backgroundColor: tech.color + '12' }]}>
                  <Icon name={tech.icon} size={24} color={tech.color} />
                </View>
                <View style={styles.cardHeaderText}>
                  <View style={styles.cardNameRow}>
                    <Text style={[styles.cardName, { fontSize: isTablet ? 22 : 20 }]}>{tech.name.replace('™', '')}</Text>
                    <Text style={styles.cardTm}>™</Text>
                  </View>
                  {card ? (
                    <Text style={[styles.cardCategory, { color: tech.color }]}>{card.category}</Text>
                  ) : null}
                </View>
                <Icon name="chevron-right" size={22} color={theme.colors.textLight} />
              </View>
              {card ? (
                <View style={[styles.cardRoleWrap, { borderColor: tech.color + '20', padding: isTablet ? 16 : 14 }]}>
                  <Icon name="target" size={14} color={tech.color} />
                  <Text style={[styles.cardRole, { color: tech.color, fontSize: isTablet ? 14 : 13, lineHeight: isTablet ? 22 : 20 }]}>
                    {card.short_description}
                  </Text>
                </View>
              ) : null}
              <View style={styles.featuresRow}>
                {tech.features.slice(0, 3).map((f, i) => (
                  <View key={i} style={[styles.featureChip, { backgroundColor: tech.color + '0A', borderColor: tech.color + '20', paddingHorizontal: isTablet ? 16 : 12, paddingVertical: isTablet ? 7 : 5 }]}>
                    <Text style={[styles.featureChipText, { color: tech.color, fontSize: isTablet ? 13 : 11 }]} numberOfLines={1}>
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

      {/* Stack relationship diagram */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => setZoomImage(stackDiagramImage)}>
        <View style={[styles.diagramCard, { aspectRatio: 1476 / 984 }]}>
          <Image
            source={stackDiagramImage}
            style={styles.responsiveImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* Advanced Comparison Link — Apple-style outlined */}
      <TouchableOpacity
        style={styles.advancedCompareBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TechnologyComparison')}>
        <Icon name="table-column" size={20} color={theme.colors.primary} />
        <Text style={styles.advancedCompareBtnText}>Advanced Platform Comparison</Text>
        <Icon name="chevron-right" size={18} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Scope Comparison matrix */}
      <View style={styles.matrixCard}>
        <View style={styles.matrixTitleRow}>
          <Icon name="view-list-outline" size={18} color={theme.colors.text} />
          <Text style={styles.matrixTitle}>Scope Comparison</Text>
        </View>
        <View style={styles.matrixHeaderRow}>
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
    <View style={styles.closingCard}>
      <View style={styles.closingAccent} />
      <View style={styles.closingBody}>
        <Text style={styles.closingTitle}>{integrated.closing.title}</Text>
        <Text style={styles.closingText}>{integrated.closing.body}</Text>
        <View style={styles.advantagesList}>
          {integrated.advantages.map((a, i) => (
            <View key={i} style={styles.advantageRow}>
              <Icon name="check-circle" size={18} color={theme.colors.primary} />
              <Text style={styles.advantageText}>{a}</Text>
            </View>
          ))}
        </View>
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
  content: { paddingBottom: 40 },

  // ─── Responsive image (fills container, preserves ratio) ────
  responsiveImage: {
    width: '100%',
    height: '100%',
  },

  // ─── Hero ─────────────────────────────────────────────────
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  heroImageWrap: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    ...theme.shadows.sm,
  },
  heroHeadline: {
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    letterSpacing: 0.1,
    marginBottom: 8,
  },

  // ─── Intro Card ───────────────────────────────────────────
  introCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    ...theme.shadows.md,
  },
  introAccent: {
    height: 3,
    backgroundColor: theme.colors.primary,
  },
  introBody: {
    padding: 20,
  },
  introIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  introText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    letterSpacing: 0.1,
    textAlign: 'justify',
  },

  // ─── Section Title ────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  // ─── Platform Cards ───────────────────────────────────────
  platformSection: {
    padding: 20,
  },
  platformCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardAccent: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  cardNameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardTm: {
    fontSize: 10,
    fontWeight: '400',
    marginTop: 2,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 23,
    marginBottom: 16,
    letterSpacing: 0.15,
    textAlign: 'justify',
  },
  cardRoleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F5F9F6',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  cardRole: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  featureChipText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ─── Comparison Section ───────────────────────────────────
  comparisonSection: {
    padding: 20,
  },
  diagramCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    ...theme.shadows.md,
  },

  // ─── Advanced Compare Button — Apple-style outlined ──────
  advancedCompareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 10,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  advancedCompareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'center',
  },

  // ─── Comparison Matrix ────────────────────────────────────
  matrixCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  matrixTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  matrixTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  matrixHeaderCell: {
    flex: 1,
  },
  matrixHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  matrixRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  matrixRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  matrixCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    lineHeight: 19,
  },

  // ─── Closing Section ──────────────────────────────────────
  closingCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  closingAccent: {
    height: 3,
    backgroundColor: theme.colors.primary,
  },
  closingBody: {
    padding: 24,
  },
  closingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  closingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    letterSpacing: 0.1,
  },
  advantagesList: {
    gap: 10,
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
