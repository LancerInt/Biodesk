import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, Image, StyleSheet, StatusBar, Dimensions,
  Animated, Platform, TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const LOGO = require('../assets/images/Landing/transperantlogo.png');

// ═══════════════════════════════════════════════════════════════
// Decorative particle / bubble element
// ═══════════════════════════════════════════════════════════════
const Bubble = ({ size, x, y, opacity = 0.08 }) => (
  <View
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: `rgba(76,175,80,${opacity})`,
    }}
  />
);

// Molecular bond cluster — 3 connected circles
const MolCluster = ({ x, y, scale = 1, opacity = 0.06 }) => {
  const r = 8 * scale;
  return (
    <View style={{ position: 'absolute', left: x, top: y }} pointerEvents="none">
      <View style={{ width: r * 2, height: r * 2, borderRadius: r, backgroundColor: `rgba(76,175,80,${opacity})` }} />
      <View style={{ position: 'absolute', left: r * 2.8, top: -r * 0.6, width: r * 1.4, height: r * 1.4, borderRadius: r * 0.7, backgroundColor: `rgba(76,175,80,${opacity * 0.8})` }} />
      <View style={{ position: 'absolute', left: r * 1.2, top: r * 2.4, width: r * 1.6, height: r * 1.6, borderRadius: r * 0.8, backgroundColor: `rgba(76,175,80,${opacity * 0.7})` }} />
      {/* Bond lines */}
      <View style={{ position: 'absolute', left: r * 1.5, top: r * 0.2, width: r * 1.8, height: 1, backgroundColor: `rgba(76,175,80,${opacity * 0.6})`, transform: [{ rotate: '-20deg' }] }} />
      <View style={{ position: 'absolute', left: r * 0.8, top: r * 1.8, width: r * 1.2, height: 1, backgroundColor: `rgba(76,175,80,${opacity * 0.6})`, transform: [{ rotate: '50deg' }] }} />
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// LANDING SCREEN
// ═══════════════════════════════════════════════════════════════

const LandingScreen = ({ navigation }) => {
  const [dims, setDims] = useState(() => Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const lastTapRef = useRef(0);

  const W = dims.width;
  const H = dims.height;
  const isLandscape = W > H;
  const isTab = Math.min(W, H) >= 600;

  // ─── Orientation listener ──────────────────────────────────
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDims(window);
    });
    return () => sub?.remove();
  }, []);

  // ─── Entrance animation ────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 35,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Double tap → navigate to Home ─────────────────────────
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      navigation.replace('Home');
    }
    lastTapRef.current = now;
  }, [navigation]);

  // ─── Responsive sizes ──────────────────────────────────────
  const logoW = isTab ? (isLandscape ? 340 : 300) : 220;
  const logoH = isTab ? (isLandscape ? 155 : 136) : 100;

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={s.root}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />

        {/* ═══ BACKGROUND LAYERS ═══ */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FAFCFA' }]} />

        {/* Left green edge gradient */}
        <LinearGradient
          colors={['rgba(76,175,80,0.28)', 'rgba(76,175,80,0.10)', 'rgba(76,175,80,0.02)', 'transparent']}
          locations={[0, 0.15, 0.3, 0.5]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Right green edge gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(76,175,80,0.02)', 'rgba(76,175,80,0.10)', 'rgba(76,175,80,0.28)']}
          locations={[0.5, 0.7, 0.85, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Top green glow */}
        <LinearGradient
          colors={['rgba(76,175,80,0.18)', 'rgba(76,175,80,0.04)', 'transparent']}
          locations={[0, 0.2, 0.45]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Bottom green glow */}
        <LinearGradient
          colors={['transparent', 'rgba(76,175,80,0.03)', 'rgba(76,175,80,0.12)']}
          locations={[0.6, 0.82, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Corner green accents */}
        <LinearGradient
          colors={['rgba(76,175,80,0.22)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
        />
        <LinearGradient
          colors={['rgba(76,175,80,0.22)', 'transparent']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.5, y: 0.5 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        />

        {/* ═══ DECORATIVE ELEMENTS ═══ */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Left side — leaf vein + molecules */}
          <Icon
            name="leaf"
            size={isTab ? 200 : 130}
            color="rgba(76,175,80,0.06)"
            style={{ position: 'absolute', left: isTab ? -30 : -20, top: H * 0.08 }}
          />
          <MolCluster x={isTab ? 30 : 15} y={H * 0.35} scale={isTab ? 1.8 : 1.2} opacity={0.055} />
          <MolCluster x={isTab ? 50 : 25} y={H * 0.65} scale={isTab ? 1.4 : 1} opacity={0.05} />
          <MolCluster x={isTab ? 15 : 5} y={H * 0.82} scale={isTab ? 2 : 1.3} opacity={0.045} />

          {/* Right side — hexagonal molecules */}
          <Icon
            name="hexagon-multiple-outline"
            size={isTab ? 180 : 110}
            color="rgba(76,175,80,0.05)"
            style={{ position: 'absolute', right: isTab ? -25 : -15, top: H * 0.12 }}
          />
          <Icon
            name="molecule"
            size={isTab ? 120 : 80}
            color="rgba(76,175,80,0.045)"
            style={{ position: 'absolute', right: isTab ? 10 : 5, top: H * 0.52 }}
          />
          <MolCluster x={W - (isTab ? 90 : 60)} y={H * 0.38} scale={isTab ? 1.6 : 1.1} opacity={0.05} />
          <MolCluster x={W - (isTab ? 70 : 45)} y={H * 0.72} scale={isTab ? 1.5 : 1} opacity={0.045} />
          <Icon
            name="atom-variant"
            size={isTab ? 100 : 65}
            color="rgba(76,175,80,0.04)"
            style={{ position: 'absolute', right: isTab ? 20 : 10, bottom: H * 0.12 }}
          />

          {/* Scattered bubbles / particles */}
          <Bubble size={isTab ? 14 : 9} x={W * 0.08} y={H * 0.22} opacity={0.1} />
          <Bubble size={isTab ? 10 : 6} x={W * 0.12} y={H * 0.48} opacity={0.08} />
          <Bubble size={isTab ? 18 : 12} x={W * 0.05} y={H * 0.7} opacity={0.07} />
          <Bubble size={isTab ? 8 : 5} x={W * 0.15} y={H * 0.58} opacity={0.09} />
          <Bubble size={isTab ? 12 : 8} x={W * 0.88} y={H * 0.18} opacity={0.09} />
          <Bubble size={isTab ? 16 : 10} x={W * 0.92} y={H * 0.45} opacity={0.07} />
          <Bubble size={isTab ? 10 : 7} x={W * 0.85} y={H * 0.62} opacity={0.08} />
          <Bubble size={isTab ? 14 : 9} x={W * 0.9} y={H * 0.78} opacity={0.06} />
          <Bubble size={isTab ? 6 : 4} x={W * 0.2} y={H * 0.15} opacity={0.1} />
          <Bubble size={isTab ? 8 : 5} x={W * 0.82} y={H * 0.88} opacity={0.08} />

          {/* Additional molecular lines (left) */}
          <View style={{
            position: 'absolute', left: isTab ? 55 : 30, top: H * 0.25,
            width: 1, height: isTab ? 60 : 40,
            backgroundColor: 'rgba(76,175,80,0.05)',
            transform: [{ rotate: '30deg' }],
          }} />
          <View style={{
            position: 'absolute', left: isTab ? 40 : 20, top: H * 0.55,
            width: 1, height: isTab ? 45 : 30,
            backgroundColor: 'rgba(76,175,80,0.04)',
            transform: [{ rotate: '-20deg' }],
          }} />

          {/* Additional molecular lines (right) */}
          <View style={{
            position: 'absolute', right: isTab ? 55 : 30, top: H * 0.3,
            width: 1, height: isTab ? 50 : 35,
            backgroundColor: 'rgba(76,175,80,0.05)',
            transform: [{ rotate: '-35deg' }],
          }} />
          <View style={{
            position: 'absolute', right: isTab ? 45 : 25, top: H * 0.6,
            width: 1, height: isTab ? 55 : 38,
            backgroundColor: 'rgba(76,175,80,0.04)',
            transform: [{ rotate: '25deg' }],
          }} />
        </View>

        {/* ═══ MAIN CONTENT ═══ */}
        <Animated.View style={[s.content, { opacity: fadeAnim }]}>
          {/* Top spacer */}
          <View style={{ flex: isLandscape ? 0.8 : 1 }} />

          {/* Center: Logo + BioDesk + Subtitle */}
          <View style={s.center}>
            <Animated.Image
              source={LOGO}
              style={{
                width: logoW,
                height: logoH,
                transform: [{ scale: logoScale }],
              }}
              resizeMode="contain"
            />

            <Text style={[s.appName, isTab && s.appNameTab]}>BioDesk</Text>
            <Text style={[s.subtitle, isTab && s.subtitleTab]}>
              Agricultural Intelligence Platform
            </Text>
            <View style={s.divider} />
          </View>

          {/* Bottom spacer + Contact */}
          <View style={{ flex: isLandscape ? 0.6 : 1, justifyContent: 'flex-end' }} />

          <View style={[
            s.contactRow,
            isLandscape && s.contactRowLandscape,
          ]}>
            <View style={s.contactItem}>
              <Icon name="email-outline" size={isTab ? 18 : 15} color="#616161" />
              <Text style={[s.contactText, isTab && s.contactTextTab]}>info@kriya.ltd</Text>
            </View>

            <View style={s.contactItem}>
              <Icon name="web" size={isTab ? 18 : 15} color="#2E7D32" />
              <Text style={[s.contactText, isTab && s.contactTextTab]}>https://www.kriya.ltd/</Text>
            </View>

            <View style={s.contactItem}>
              <Icon name="whatsapp" size={isTab ? 18 : 15} color="#25D366" />
              <Text style={[s.contactText, isTab && s.contactTextTab]}>+91 63885 48466</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFCFA',
  },

  // ─── Content layout ──────────────────────────────────────────
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 32,
  },

  // ─── Center section ──────────────────────────────────────────
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B1B1B',
    marginTop: 20,
    letterSpacing: 1,
  },
  appNameTab: {
    fontSize: 36,
    marginTop: 28,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#757575',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  subtitleTab: {
    fontSize: 19,
    marginTop: 10,
  },

  divider: {
    width: 56,
    height: 2.5,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
    marginTop: 16,
    opacity: 0.7,
  },

  // ─── Bottom contact row ──────────────────────────────────────
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
    paddingBottom: 8,
  },
  contactRowLandscape: {
    gap: 40,
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  contactText: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  contactTextTab: {
    fontSize: 15,
  },
});

export default LandingScreen;
