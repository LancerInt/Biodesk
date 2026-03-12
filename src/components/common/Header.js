import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const Header = ({title, onBack, rightIcon, onRightPress, showBack = true}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (<View style={styles.backPlaceholder} />)}
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
          {rightIcon && onRightPress ? (
            <TouchableOpacity onPress={onRightPress} style={styles.rightButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name={rightIcon} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (<View style={styles.rightPlaceholder} />)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 4},
  leftSection: {width: 48, alignItems: 'flex-start', justifyContent: 'center'},
  titleSection: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  rightSection: {width: 48, alignItems: 'flex-end', justifyContent: 'center'},
  title: {fontSize: 18, fontWeight: '600', color: '#FFFFFF', textAlign: 'center'},
  backButton: {padding: 8, borderRadius: 20},
  backPlaceholder: {width: 40},
  rightButton: {padding: 8, borderRadius: 20},
  rightPlaceholder: {width: 40},
});

export default Header;
