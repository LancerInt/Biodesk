import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

const TabBar = ({tabs = [], activeIndex = 0, onTabPress}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress && onTabPress(index)}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 4,
    position: 'relative',
    alignItems: 'center',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#2E7D32',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});

export default TabBar;
