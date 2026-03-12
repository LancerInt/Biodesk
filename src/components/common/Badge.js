import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Badge = ({text, color = '#2E7D32', textColor = '#FFFFFF', style}) => {
  return (
    <View style={[styles.badge, {backgroundColor: color}, style]}>
      <Text style={[styles.text, {color: textColor}]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Badge;
