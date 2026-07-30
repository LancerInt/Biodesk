import React from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

/**
 * Wraps `children` with two-finger pinch-to-zoom + two-finger pan.
 * Single-finger drag is left alone so it can scroll a parent ScrollView.
 *
 * Props:
 *  - minScale (default 1)
 *  - maxScale (default 4)
 *  - style    (forwarded to the Animated.View)
 */
const PinchableView = ({
  children,
  style,
  minScale = 1,
  maxScale = 4,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // ── Pinch: scale around the gesture's focal point ──────────────
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      'worklet';
      const next = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(next, 0.5), maxScale);
    })
    .onEnd(() => {
      'worklet';
      if (scale.value < minScale) {
        scale.value = withSpring(minScale);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = minScale;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        savedScale.value = scale.value;
      }
    });

  // ── Two-finger pan (so single-finger scroll is preserved) ──────
  const pan = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .averageTouches(true)
    .onUpdate((e) => {
      'worklet';
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[style, animatedStyle]} collapsable={false}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default PinchableView;
