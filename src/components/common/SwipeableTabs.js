import React from 'react';
import { View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const SWIPE_THRESHOLD = 60;

const SwipeableTabs = ({ activeTab, tabCount, onTabChange, children, style }) => {
  const goNext = () => {
    if (activeTab < tabCount - 1) onTabChange(activeTab + 1);
  };
  const goPrev = () => {
    if (activeTab > 0) onTabChange(activeTab - 1);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      'worklet';
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goNext)();
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(goPrev)();
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </GestureDetector>
  );
};

export default SwipeableTabs;
