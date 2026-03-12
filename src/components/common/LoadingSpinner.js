import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingSpinner = ({text = '', visible = true}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
