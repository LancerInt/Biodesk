import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, Platform, useWindowDimensions, Animated,
  Image, ImageBackground, LayoutAnimation, UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon, MaterialIcons as MIcon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DatabaseService from '../database/DatabaseService';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const logo = require('../assets/images/Landing/transperantlogo.png');
const BG_IMAGE = require('../assets/images/Home/background.png');

// ═══════════════════════════════════════════════════════════════
// DASHBOARD COLOR PALETTE
// ═══════════════════════════════════════════════════════════════
const C = {
  primary:    '#0F7B6C',
  primaryDk:  '#0A5C51',
  accent:     '#2EC4B6',
  white:      '#FFFFFF',
  bg:         '#F7F9FA',
  text:       '#1A1D1E',
  textSec:    '#5F6B6A',
  textMut:    '#9CA8A7',
  divider:    '#F0F3F2',
  orange:     '#F57C00',
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD MODULE DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const MODULES = [
  { key: 'kriya',      title: 'Kriya',      sub: 'Company Overview & Profile',  icon: 'corporate-fare',  color: '#0F7B6C', bg: '#E0F2F1', bgTo: '#B2DFDB', screen: 'Profile' },
  { key: 'portfolio',  title: 'Portfolio',   sub: 'Complete Product Catalog',    icon: 'inventory-2',     color: '#00838F', bg: '#E0F7FA', bgTo: '#B2EBF2', screen: 'Products' },
  { key: 'technology', title: 'Technology',  sub: 'Biotech Innovation Platform', icon: 'biotech',         color: '#6A1B9A', bg: '#F3E5F5', bgTo: '#E1BEE7', screen: 'Technology' },
  { key: 'gallery',    title: 'Gallery',     sub: 'Product Images & Videos',     icon: 'photo-library',   color: '#E91E63', bg: '#FCE4EC', bgTo: '#F8BBD0', screen: 'Videos' },
  { key: 'biointel',   title: 'BioIntel',    sub: 'Biological Intelligence',     icon: 'psychology',      color: '#FF6F00', bg: '#FFF3E0', bgTo: '#FFE0B2', screen: 'Solutions' },
];

// ═══════════════════════════════════════════════════════════════
// QUICK ACCESS SECTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const SECTIONS = [
  { key: 'meetings',  title: 'Meeting',  icon: 'event',        color: '#EF6C00', bg: '#FFF3E0', bgTo: '#FFE0B2', cLabel: 'scheduled',        screen: 'Meetings',  form: 'MeetingForm', formP: { mode: 'create' }, aLabel: 'New Meeting', aIcon: 'plus' },
  { key: 'leads',     title: 'Lead',     icon: 'group',        color: '#2E7D32', bg: '#E8F5E9', bgTo: '#C8E6C9', cLabel: 'captured',         screen: 'Leads',     form: 'LeadForm',    formP: { mode: 'create' }, aLabel: 'New Lead',    aIcon: 'account-plus' },
  { key: 'documents', title: 'Document', icon: 'description',  color: '#1565C0', bg: '#E3F2FD', bgTo: '#BBDEFB', cLabel: 'PDFs & Brochures', screen: 'Documents', form: null,          formP: null,               aLabel: 'Browse All',  aIcon: 'arrow-right' },
];

const CARD_R = 20;
const TOUCH = 44; // min touch target (dp)

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN — Responsive Auto-Rotation Dashboard
// ═══════════════════════════════════════════════════════════════
const HomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 600;

  const [stats, setStats] = useState({ leads: 0, meetings: 0 });
  const [expanded, setExpanded] = useState({});

  // ─── Staggered entrance animation ──────────────────────────
  const anims = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(60, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 })
    )).start();
  }, []);

  // ─── Smooth rotation transition (called during render) ─────
  const prevLand = useRef(isLandscape);
  if (prevLand.current !== isLandscape) {
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    prevLand.current = isLandscape;
  }

  // ─── Live stats from database ──────────────────────────────
  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        const [lc, mc] = await Promise.all([
          DatabaseService.getLeadCount(),
          DatabaseService.getMeetingCount(),
        ]);
        setStats(prev => ({ ...prev, leads: lc, meetings: mc }));
      } catch {}
    })();
  }, []));

  const go = useCallback((scr, params) => () => navigation.navigate(scr, params), [navigation]);

  const fade = (i) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  const toggleSection = (key) => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Dynamic layout values (recalculated on every render) ──
  const PAD = isTablet ? (isLandscape ? 40 : 32) : 20;
  const GAP = isTablet ? 16 : 12;
  const COLS = isLandscape ? 3 : (isTablet ? 2 : 1);
  const containerW = width - PAD * 2;
  const cardW = (containerW - GAP * (COLS - 1)) / COLS;
  const ICON_SZ = isTablet ? 46 : 36;

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <View style={st.root}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      {/* Background image + readability overlay */}
      <ImageBackground source={BG_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(247,249,250,0.93)', 'rgba(247,249,250,0.87)', 'rgba(244,249,248,0.90)', 'rgba(247,249,250,0.95)']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PAD,
          paddingTop: insets.top + 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ HEADER BAR ═══════════════════════════════════════ */}
        <Animated.View style={[st.header, fade(0)]}>
          {/* Left: Logo + brand */}
          <View style={st.hLeft}>
            <Image
              source={logo}
              style={{ width: isTablet ? 100 : 48, height: isTablet ? 100 : 48 }}
              resizeMode="contain"
            />
            <Text style={st.hPipe}>|</Text>
            <Text style={[st.hBrand, { fontSize: isTablet ? 26 : 20 }]}>BioDesk</Text>
          </View>


          {/* Right: Action icons + Capture Lead */}
          <View style={st.hRight}>
            <TouchableOpacity style={st.hBtn} onPress={go('Search')} activeOpacity={0.7}>
              <Icon name="magnify" size={22} color={C.textSec} />
            </TouchableOpacity>
            <TouchableOpacity style={st.hBtn} onPress={go('LeadAudio')} activeOpacity={0.7}>
              <Icon name="microphone-outline" size={22} color={C.textSec} />
            </TouchableOpacity>
            <TouchableOpacity style={st.hBtn} onPress={go('Settings')} activeOpacity={0.7}>
              <Icon name="cog-outline" size={22} color={C.textSec} />
            </TouchableOpacity>
            <TouchableOpacity
              style={st.hCapture}
              onPress={go('LeadForm', { mode: 'create' })}
              activeOpacity={0.8}
            >
              <Icon name="account-plus-outline" size={18} color="#FFF" />
              <Text style={st.hCaptureTxt}>Leads</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ═══ HERO BANNER ══════════════════════════════════════ */}
        <Animated.View
          style={[st.hero, {
            paddingVertical: isLandscape ? (isTablet ? 18 : 12) : (isTablet ? 28 : 20),
            marginBottom: isLandscape ? GAP : GAP * 1.5,
          }, fade(1)]}
        >
          <LinearGradient
            colors={[C.primary, C.primaryDk]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: CARD_R }]}
          />
          {/* Decorative circles for depth */}
          <View style={st.heroCircle1} />
          <View style={st.heroCircle2} />

          <View style={st.heroContent}>
            <Text style={[st.heroTitle, { fontSize: isTablet ? (isLandscape ? 26 : 30) : 22 }]}>
              Biological Intelligence Platform
            </Text>
            <Text style={[st.heroSub, { fontSize: isTablet ? (isLandscape ? 14 : 15) : 12 }]}>
              for Modern Agriculture
            </Text>
          </View>
        </Animated.View>

        {/* ═══ DASHBOARD SECTION LABEL ══════════════════════════ */}
        <Animated.View style={[st.secLabel, fade(2)]}>
          <Text style={st.secLabelTxt}>Dashboard</Text>
          <View style={[st.secLabelBar, { backgroundColor: C.accent }]} />
        </Animated.View>

        {/* ═══ MODULE CARDS GRID ════════════════════════════════ */}
        <Animated.View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }, fade(2)]}>
          {MODULES.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[st.mCard, {
                width: cardW,
                padding: isTablet ? 20 : 16,
                borderRadius: CARD_R,
              }]}
              onPress={go(m.screen)}
              activeOpacity={0.85}
            >
              {/* Colored accent strip at top */}
              <LinearGradient
                colors={[m.color, m.color + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[st.mAccent, { borderTopLeftRadius: CARD_R, borderTopRightRadius: CARD_R }]}
              />
              <View style={st.mRow}>
                {/* Icon — premium glass tile */}
                <LinearGradient
                  colors={[m.bg, m.bgTo]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[st.mIconWrap, {
                    width: ICON_SZ + 20,
                    height: ICON_SZ + 20,
                  }]}
                >
                  <View style={st.mIconGlass} />
                  <MIcon name={m.icon} size={ICON_SZ * 0.72} color={m.color} />
                </LinearGradient>
                {/* Labels */}
                <View style={st.mInfo}>
                  <Text style={[st.mTitle, { fontSize: isTablet ? 18 : 15 }]}>{m.title}</Text>
                  <Text style={[st.mSub, { fontSize: isTablet ? 12 : 11 }]}>{m.sub}</Text>
                </View>
                {/* Arrow */}
                <View style={st.mArrow}>
                  <Icon name="chevron-right" size={20} color={C.textMut} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ═══ QUICK ACCESS SECTION LABEL ═══════════════════════ */}
        <Animated.View style={[st.secLabel, { marginTop: GAP * 1.5 }, fade(3)]}>
          <Text style={st.secLabelTxt}>Quick Access</Text>
          <View style={[st.secLabelBar, { backgroundColor: C.accent }]} />
        </Animated.View>

        {/* ═══ EXPANDABLE ACCORDION SECTIONS ════════════════════ */}
        <Animated.View style={[{
          flexDirection: isLandscape ? 'row' : 'column',
          gap: GAP,
          alignItems: isLandscape ? 'flex-start' : 'stretch',
        }, fade(3)]}>
          {SECTIONS.map(sec => {
            const isOpen = expanded[sec.key];
            const count = stats[sec.key];

            return (
              <View
                key={sec.key}
                style={[st.xCard, {
                  flex: isLandscape ? 1 : undefined,
                  borderRadius: CARD_R,
                }]}
              >
                {/* Accordion header */}
                <TouchableOpacity
                  style={st.xHead}
                  onPress={() => toggleSection(sec.key)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[sec.bg, sec.bgTo]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={st.xIcon}
                  >
                    <View style={st.xIconGlass} />
                    <MIcon name={sec.icon} size={22} color={sec.color} />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={st.xTitle}>{sec.title}</Text>
                    <Text style={st.xCount}>{count != null ? `${count} ${sec.cLabel}` : sec.cLabel}</Text>
                  </View>
                  {count != null && (
                    <View style={[st.xBadge, { backgroundColor: sec.color + '15' }]}>
                      <Text style={[st.xBadgeTxt, { color: sec.color }]}>{count}</Text>
                    </View>
                  )}
                  <Icon
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color={C.textMut}
                  />
                </TouchableOpacity>

                {/* Expanded body with actions */}
                {isOpen && (
                  <View style={st.xBody}>
                    <View style={st.xDiv} />
                    <View style={st.xActions}>
                      <TouchableOpacity
                        style={[st.xBtnFill, { backgroundColor: sec.color }]}
                        onPress={go(sec.screen)}
                        activeOpacity={0.8}
                      >
                        <Icon name="format-list-bulleted" size={18} color="#FFF" />
                        <Text style={st.xBtnFillTxt}>View All</Text>
                      </TouchableOpacity>
                      {sec.form && (
                        <TouchableOpacity
                          style={[st.xBtnOut, { borderColor: sec.color }]}
                          onPress={go(sec.form, sec.formP)}
                          activeOpacity={0.8}
                        >
                          <Icon name={sec.aIcon} size={18} color={sec.color} />
                          <Text style={[st.xBtnOutTxt, { color: sec.color }]}>
                            {sec.aLabel}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>

    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ─── Header Bar ────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hPipe: { fontSize: 28, fontWeight: '300', color: C.textMut, opacity: 0.4 },
  hBrand: { fontFamily: 'NotoSerifKR_700Bold', color: C.primary, letterSpacing: 1.5 },
  hCenter: { flexDirection: 'row', alignItems: 'baseline' },
  powL: { fontSize: 12, color: C.textMut, fontFamily: 'Inter_500Medium' },
  powB: { fontSize: 13, color: C.orange, fontFamily: 'Inter_600SemiBold' },
  powD: { fontSize: 12, color: C.textMut, fontFamily: 'Inter_400Regular' },
  hRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hBtn: {
    width: TOUCH,
    height: TOUCH,
    borderRadius: TOUCH / 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hCapture: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  hCaptureTxt: { fontSize: 13, color: '#FFF', letterSpacing: 0.3, fontFamily: 'Inter_600SemiBold' },

  // ─── Hero Banner ───────────────────────────────────────────
  hero: {
    borderRadius: CARD_R,
    paddingHorizontal: 28,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -40,
    left: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFF',
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.78)',
    marginTop: 6,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },

  // ─── Section Labels ────────────────────────────────────────
  secLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  secLabelTxt: {
    fontSize: 13,
    color: C.textMut,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: 'Inter_600SemiBold',
  },
  secLabelBar: { flex: 1, height: 1.5, borderRadius: 1 },

  // ─── Module Cards ──────────────────────────────────────────
  mCard: {
    backgroundColor: C.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  mAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  mRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mIconWrap: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  mIconGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  mInfo: {
    flex: 1,
  },
  mTitle: {
    color: C.text,
    letterSpacing: 0.2,
    marginBottom: 3,
    fontFamily: 'Poppins_600SemiBold',
  },
  mSub: { color: C.textMut, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  mArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Expandable Sections ───────────────────────────────────
  xCard: {
    backgroundColor: C.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  xHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  xIcon: {
    width: TOUCH + 4,
    height: TOUCH + 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  xIconGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  xTitle: { fontSize: 16, color: C.text, fontFamily: 'Poppins_600SemiBold' },
  xCount: { fontSize: 12, color: C.textMut, marginTop: 2, fontFamily: 'Inter_400Regular' },
  xBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  xBadgeTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  xBody: { paddingHorizontal: 18, paddingBottom: 18 },
  xDiv: { height: 1, backgroundColor: C.divider, marginBottom: 14 },
  xActions: { flexDirection: 'row', gap: 10 },
  xBtnFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  xBtnFillTxt: { fontSize: 14, color: '#FFF', fontFamily: 'Inter_600SemiBold' },
  xBtnOut: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  xBtnOutTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },

});

export default HomeScreen;
