import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, TouchableWithoutFeedback, StyleSheet,
  Animated, StatusBar, Text, Platform, Dimensions, Image,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SCREEN_SAVER_IMAGES, SCREEN_SAVER_CONFIG } from '../constants/landingAssets';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ScreenSaverScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const nextFadeAnim = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  const images = SCREEN_SAVER_IMAGES;
  const { intervalMs, transitionMs } = SCREEN_SAVER_CONFIG;

  const advanceSlide = useCallback(() => {
    const nextIdx = (indexRef.current + 1) % images.length;

    nextFadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: transitionMs,
        useNativeDriver: true,
      }),
      Animated.timing(nextFadeAnim, {
        toValue: 1,
        duration: transitionMs,
        useNativeDriver: true,
      }),
    ]).start(() => {
      indexRef.current = nextIdx;
      setCurrentIndex(nextIdx);
      fadeAnim.setValue(1);
      nextFadeAnim.setValue(0);
    });
  }, [fadeAnim, nextFadeAnim, images.length, transitionMs]);

  // Preload all slideshow images for seamless crossfade
  useEffect(() => {
    images.forEach((img) => {
      const resolved = Image.resolveAssetSource(img.source);
      if (resolved?.uri) Image.prefetch(resolved.uri);
    });
  }, [images]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const hintTimer = setTimeout(() => {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 3000);

    timerRef.current = setInterval(advanceSlide, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(hintTimer);
    };
  }, [advanceSlide, fadeAnim, hintOpacity, intervalMs]);

  const handleExit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigation.goBack();
  };

  const nextIdx = (currentIndex + 1) % images.length;

  return (
    <TouchableWithoutFeedback onPress={handleExit}>
      <View style={styles.container}>
        <StatusBar hidden />

        {/* Current image */}
        <Animated.Image
          source={images[currentIndex].source}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="cover"
        />

        {/* Next image (crossfade layer) */}
        <Animated.Image
          source={images[nextIdx].source}
          style={[styles.image, { opacity: nextFadeAnim }]}
          resizeMode="cover"
        />

        {/* Slide indicators */}
        <View style={styles.indicatorRow}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Subtle exit hint — auto-fades after 3s */}
        <Animated.View style={[styles.exitHint, { opacity: hintOpacity }]}>
          <Icon name="gesture-tap" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.exitText}>Tap to exit</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
  },
  indicatorRow: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 28,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: '#FFF',
    width: 20,
    borderRadius: 4,
  },
  exitHint: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  exitText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});

export default ScreenSaverScreen;
