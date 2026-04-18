import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, FlatList, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { PROFILE_SECTIONS } from '../constants/profileData';
import { getTechnologyById } from '../constants/technologyData';

const SectionImage = React.memo(({ source }) => {
  if (!source) return null;
  return (
    <View style={styles.sectionImageCard}>
      <Image source={source} style={styles.sectionImage} resizeMode="cover" />
    </View>
  );
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32; // 16px padding each side

const ImageCarousel = React.memo(({ images }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
  }, [images.length]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const onScrollBeginDrag = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const onScrollEndDrag = () => startAutoPlay();

  const goTo = (dir) => {
    const next = dir === 'next'
      ? (activeIndex + 1) % images.length
      : (activeIndex - 1 + images.length) % images.length;
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setActiveIndex(next);
    startAutoPlay();
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, index) => ({ length: CAROUSEL_WIDTH, offset: CAROUSEL_WIDTH * index, index })}
        renderItem={({ item }) => (
          <Image source={item} style={styles.carouselImage} resizeMode="cover" />
        )}
      />
      <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowLeft]} onPress={() => goTo('prev')}>
        <Icon name="chevron-left" size={28} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowRight]} onPress={() => goTo('next')}>
        <Icon name="chevron-right" size={28} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.carouselDots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.carouselDot, i === activeIndex && styles.carouselDotActive]} />
        ))}
      </View>
    </View>
  );
});

const ProfileScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.sectionIndex ?? 0;
  const [activeSection, setActiveSection] = useState(initialTab);
  const section = PROFILE_SECTIONS[activeSection];

  // Preload all section images on mount for instant tab switching
  useEffect(() => {
    PROFILE_SECTIONS.forEach((s) => {
      if (s.image) {
        const resolved = Image.resolveAssetSource(s.image);
        if (resolved?.uri) Image.prefetch(resolved.uri);
      }
    });
  }, []);

  const renderAbout = () => (
    <View>
      <SectionImage source={section.image} />
      <Text style={styles.headline}>{section.content.headline}</Text>
      <Text style={styles.bodyText}>{section.content.description}</Text>

      <Text style={styles.subTitle}>Kriya Highlights</Text>
      {section.content.highlights.map((h, i) => (
        <View key={i} style={styles.highlightRow}>
          <Icon name="check-decagram" size={18} color={theme.colors.primary} />
          <Text style={styles.highlightText}>{h}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>Our Mission</Text>
      <View style={styles.quoteCard}>
        <Icon name="format-quote-open" size={24} color={theme.colors.secondary} />
        <Text style={styles.quoteText}>{section.content.mission}</Text>
      </View>

      <Text style={styles.subTitle}>Our Vision</Text>
      <View style={styles.quoteCard}>
        <Icon name="eye" size={24} color={theme.colors.primary} />
        <Text style={styles.quoteText}>{section.content.vision}</Text>
      </View>

      <Text style={styles.subTitle}>Core Values</Text>
      {section.content.values.map((v, i) => (
        <View key={i} style={styles.valueCard}>
          <Text style={styles.valueTitle}>{v.title}</Text>
          <Text style={styles.valueDesc}>{v.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderExpertise = () => (
    <View>
      <SectionImage source={section.image} />
      <Text style={styles.bodyText}>{section.content.description}</Text>

      {section.content.areas.map((area, i) => (
        <View key={i} style={styles.expertiseCard}>
          <View style={styles.expertiseHeader}>
            <View style={[styles.capIconWrap, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name={area.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.expertiseTitle}>{area.title}</Text>
          </View>
          {area.items.map((item, j) => (
            <View key={j} style={styles.expertiseItem}>
              <Icon name="chevron-right" size={16} color={theme.colors.textLight} />
              <Text style={styles.expertiseItemText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.subTitle}>Technology Platform</Text>
      <Text style={styles.bodyText}>{section.content.technologyIntro}</Text>
      {section.content.technologies.map((tech, i) => {
        const techId = tech.name.replace('\u2122', '').trim().toLowerCase();
        const techData = getTechnologyById(techId);
        return (
          <TouchableOpacity key={i} style={[styles.techPlatformCard, { borderLeftColor: tech.color }]} activeOpacity={0.7}
            onPress={() => techData && navigation.navigate('TechnologyDetail', { tech: techData })}>
            <View style={styles.techNameRow}>
              <Text style={[styles.techPlatformName, { color: tech.color }]}>{tech.name.replace('\u2122', '')}</Text>
              <Text style={[styles.tmSymbol, { color: tech.color }]}>{'\u2122'}</Text>
            </View>
            <Text style={styles.techPlatformTagline}>{tech.tagline}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderManufacturing = () => (
    <View>
      {section.carouselImages ? <ImageCarousel images={section.carouselImages} /> : <SectionImage source={section.image} />}
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <Text style={styles.subTitle}>Capabilities</Text>
      {section.content.capabilities.map((c, i) => (
        <View key={i} style={styles.capCard}>
          <View style={styles.capIconWrap}>
            <Icon name={c.icon} size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitle}>{c.title}</Text>
            <Text style={styles.capDesc}>{c.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRnD = () => (
    <View>
      {section.carouselImages ? <ImageCarousel images={section.carouselImages} /> : <SectionImage source={section.image} />}
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <Text style={styles.subTitle}>Research Areas</Text>
      {section.content.areas.map((a, i) => (
        <View key={i} style={styles.capCard}>
          <View style={styles.capIconWrap}>
            <Icon name={a.icon} size={24} color={theme.colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitle}>{a.title}</Text>
            <Text style={styles.capDesc}>{a.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderQuality = () => (
    <View>
      <SectionImage source={section.image} />
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <Text style={styles.subTitle}>Quality Pillars</Text>
      {section.content.pillars.map((p, i) => (
        <View key={i} style={styles.capCard}>
          <View style={[styles.capIconWrap, { backgroundColor: '#E8F5E9' }]}>
            <Icon name={p.icon} size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitle}>{p.title}</Text>
            <Text style={styles.capDesc}>{p.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGlobal = () => (
    <View>
      <SectionImage source={section.image} />
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <View style={styles.statsRow}>
        {section.content.stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.subTitle}>Regional Presence</Text>
      {section.content.regions.map((r, i) => (
        <View key={i} style={styles.regionCard}>
          <View style={styles.regionHeader}>
            <Text style={styles.regionName}>{r.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: r.status === 'Established' ? '#E8F5E9' : r.status === 'Growing' ? '#FFF3E0' : '#F3E5F5' }]}>
              <Text style={[styles.statusText, { color: r.status === 'Established' ? '#2E7D32' : r.status === 'Growing' ? '#E65100' : '#7B1FA2' }]}>{r.status}</Text>
            </View>
          </View>
          {r.countries && <Text style={styles.countries}>{r.countries.join(' | ')}</Text>}
        </View>
      ))}
    </View>
  );

  const openCertificatePdf = (cert) => {
    if (cert.subTypes) {
      navigation.navigate('EcocertSelect');
      return;
    }
    if (!cert.pdfAsset) {
      Alert.alert('Not Available', 'Certificate file not available');
      return;
    }
    navigation.navigate('CertificateViewer', {
      certName: cert.name,
      authority: cert.category,
      asset: cert.pdfAsset,
    });
  };

  const renderCertifications = () => {
    const certsWithLogos = section.content.certifications.filter(c => c.logo);
    return (
      <View>
        <SectionImage source={section.image} />
        <Text style={styles.bodyText}>{section.content.description}</Text>
        {certsWithLogos.map((c, i) => (
          <TouchableOpacity key={i} style={styles.certCard} activeOpacity={0.7} onPress={() => openCertificatePdf(c)}>
            <View style={styles.certIcon}>
              <Image source={c.logo} style={styles.certLogoImage} resizeMode="contain" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.certHeader}>
                <Text style={styles.certName}>{c.name}</Text>
                <View style={styles.certCatBadge}><Text style={styles.certCatText}>{c.category}</Text></View>
              </View>
              <Text style={styles.certDesc}>{c.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Map section IDs to renderers
  const rendererMap = {
    about: renderAbout,
    expertise: renderExpertise,
    manufacturing: renderManufacturing,
    rnd: renderRnD,
    quality: renderQuality,
    global: renderGlobal,
    certifications: renderCertifications,
  };

  return (
    <View style={styles.container}>
      <Header title="Kriya Profile" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
        {PROFILE_SECTIONS.map((s, i) => (
          <TouchableOpacity key={s.id} style={[styles.tab, activeSection === i && styles.tabActive]} onPress={() => setActiveSection(i)}>
            <Icon name={s.icon} size={18} color={activeSection === i ? theme.colors.primary : theme.colors.textLight} />
            <Text style={[styles.tabText, activeSection === i && styles.tabTextActive]}>{s.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {(rendererMap[section.id] || renderAbout)()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: { backgroundColor: '#FFF', flexGrow: 0, flexShrink: 0, ...theme.shadows.sm },
  tabContent: { paddingHorizontal: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 6 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 13, fontWeight: '500', color: theme.colors.textLight },
  tabTextActive: { color: theme.colors.primary, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },

  // Image Carousel
  carouselContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  carouselImage: {
    width: CAROUSEL_WIDTH,
    height: undefined,
    aspectRatio: 16 / 9,
  },
  carouselArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselArrowLeft: { left: 8 },
  carouselArrowRight: { right: 8 },
  carouselDots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  carouselDotActive: {
    backgroundColor: '#FFF',
    width: 20,
  },

  // Section image — full-width banner
  sectionImageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  },

  headline: { fontSize: 24, fontWeight: '800', color: theme.colors.secondary, marginBottom: 12, fontStyle: 'italic' },
  bodyText: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 23, marginBottom: 12, textAlign: 'justify' },
  subTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 20, marginBottom: 12 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  highlightText: { flex: 1, fontSize: 14, color: theme.colors.text },
  quoteCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 8, ...theme.shadows.sm },
  quoteText: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, fontStyle: 'italic', textAlign: 'justify' },
  valueCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  valueTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  valueDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },

  // Expertise section
  expertiseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  expertiseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  expertiseTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  expertiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingLeft: 4,
  },
  expertiseItemText: { fontSize: 14, color: theme.colors.textSecondary, flex: 1 },

  // Technology platform cards
  techPlatformCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  techPlatformName: { fontSize: 17, fontWeight: '800' },
  techNameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tmSymbol: { fontSize: 9, fontWeight: '400', marginTop: 2 },
  techPlatformTagline: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 19, textAlign: 'justify' },

  // Capability cards (Manufacturing, R&D, Quality)
  capCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, ...theme.shadows.sm },
  capIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  capTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  capDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 3, lineHeight: 19, textAlign: 'justify' },

  // Stats
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  statCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, flex: 1, minWidth: 140, alignItems: 'center', ...theme.shadows.sm },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.colors.primary },
  statLabel: { fontSize: 11, color: theme.colors.textLight, marginTop: 4, textAlign: 'center' },

  // Global presence
  regionCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  regionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  regionName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  countries: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 6 },

  // Certifications
  certCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, ...theme.shadows.sm },
  certIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  certLogoImage: { width: 34, height: 34 },
  certHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certName: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  certCatBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  certCatText: { fontSize: 10, fontWeight: '600', color: theme.colors.textSecondary },
  certDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 3, textAlign: 'justify' },
});

export default ProfileScreen;
