import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';

const LOGO = require('../assets/images/Landing/transperantlogo.png');

const SplashScreen = ({ onFinish }) => {
  const { width: winW, height: winH } = useWindowDimensions();
  const called = useRef(false);

  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(16)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  // Floating accent dots
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;
  const dot3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance sequence
    Animated.sequence([
      // Phase 1: Background fade + card entrance
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1, friction: 10, tension: 60, useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1, duration: 450, useNativeDriver: true,
        }),
      ]),

      // Phase 2: Logo reveal
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 350, useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1, friction: 8, tension: 50, useNativeDriver: true,
        }),
      ]),

      // Phase 3: Title + subtitle
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1, duration: 350, useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0, friction: 10, tension: 60, useNativeDriver: true,
        }),
      ]),

      // Phase 4: Subtitle + progress + tagline
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1, duration: 300, useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
        Animated.timing(progressWidth, {
          toValue: 1, duration: 1400, useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      if (!called.current) {
        called.current = true;
        if (onFinish) onFinish();
      }
    });

    // Gentle floating dots animation
    const floatDot = (anim, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -8, duration, useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 8, duration, useNativeDriver: true,
          }),
        ])
      );
    floatDot(dot1Y, 2400).start();
    floatDot(dot2Y, 3000).start();
    floatDot(dot3Y, 2700).start();

    // Safety fallback
    const fallback = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        if (onFinish) onFinish();
      }
    }, 5000);

    return () => clearTimeout(fallback);
  }, []);

  const isLandscape = winW > winH;
  const cardW = isLandscape ? Math.min(winH * 0.42, 200) : Math.min(winW * 0.45, 220);
  const cardH = cardW * 0.75;
  const logoW = cardW * 0.72;
  const logoH = logoW * 0.5;
  const progressBarWidth = isLandscape ? 100 : 140;

  const animatedProgress = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, progressBarWidth],
  });

  return (
    <View style={styles.container}>
      {/* Cream background */}
      <Animated.View style={[styles.bg, { opacity: fadeIn }]} />

      {/* Subtle decorative blobs */}
      <Animated.View
        style={[
          styles.blob,
          {
            opacity: fadeIn,
            width: winW * 0.55,
            height: winW * 0.55,
            borderRadius: winW * 0.275,
            top: -winW * 0.18,
            right: -winW * 0.12,
            backgroundColor: 'rgba(46, 125, 50, 0.04)',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            opacity: fadeIn,
            width: winW * 0.4,
            height: winW * 0.4,
            borderRadius: winW * 0.2,
            bottom: -winW * 0.08,
            left: -winW * 0.1,
            backgroundColor: 'rgba(245, 124, 0, 0.03)',
          },
        ]}
      />

      {/* Small floating accent dots */}
      <Animated.View
        style={[
          styles.accentDot,
          {
            opacity: subtitleOpacity,
            top: '18%',
            left: '12%',
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(46, 125, 50, 0.15)',
            transform: [{ translateY: dot1Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.accentDot,
          {
            opacity: subtitleOpacity,
            top: '25%',
            right: '15%',
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(245, 124, 0, 0.12)',
            transform: [{ translateY: dot2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.accentDot,
          {
            opacity: subtitleOpacity,
            bottom: '22%',
            right: '20%',
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            transform: [{ translateY: dot3Y }],
          },
        ]}
      />

      {/* Center content */}
      <Animated.View
        style={[
          styles.centerWrap,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        {/* Logo card */}
        <View
          style={[
            styles.card,
            {
              width: cardW,
              height: cardH,
              borderRadius: 24,
            },
          ]}
        >
          {/* Inner glow layer */}
          <View style={[styles.cardInner, { borderRadius: 24 }]} />

          {/* Logo */}
          <Animated.Image
            source={LOGO}
            style={[
              styles.logo,
              {
                width: logoW,
                height: logoH,
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Thin accent line below card */}
        <Animated.View
          style={[
            styles.accentLine,
            { opacity: titleOpacity },
          ]}
        />

        {/* App name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }],
            marginTop: 20,
            alignItems: 'center',
          }}
        >
          <Text style={styles.appName}>BioDesk</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Kriya Biosys
        </Animated.Text>

        {/* Progress bar */}
        <Animated.View
          style={[
            styles.progressTrack,
            { opacity: subtitleOpacity, width: progressBarWidth },
          ]}
        >
          <Animated.View style={[styles.progressFill, { width: animatedProgress }]} />
        </Animated.View>
      </Animated.View>

      {/* Bottom tagline */}
      <Animated.View style={[styles.taglineWrap, { opacity: taglineOpacity }]}>
        <View style={styles.taglineDash} />
        <Text style={styles.tagline}>Delightfully Organic</Text>
        <View style={styles.taglineDash} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6F0',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F6F0',
  },

  blob: { position: 'absolute' },
  accentDot: { position: 'absolute' },

  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.06)',
  },
  cardInner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 125, 50, 0.015)',
  },

  logo: { zIndex: 1 },

  accentLine: {
    width: 32,
    height: 2.5,
    backgroundColor: '#F57C00',
    borderRadius: 2,
    marginTop: 16,
  },

  appName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1B5E20',
    letterSpacing: 3,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#90A4AE',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 10,
  },

  progressTrack: {
    height: 2.5,
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
    borderRadius: 2,
    marginTop: 28,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },

  taglineWrap: {
    position: 'absolute',
    bottom: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taglineDash: {
    width: 16,
    height: 1,
    backgroundColor: '#C5C5C0',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B0B0A8',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
