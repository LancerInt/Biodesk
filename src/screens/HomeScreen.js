import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import theme from '../constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const MENU_ITEMS = [
  { key: 'Profile', label: 'Kriya Profile', icon: 'office-building', color: '#1B5E20', screen: 'Profile' },
  { key: 'Technology', label: 'Technology', icon: 'flask', color: '#E65100', screen: 'Technology' },
  { key: 'Products', label: 'Products', icon: 'leaf', color: '#2E7D32', screen: 'Products' },
  { key: 'Solutions', label: 'Solutions', icon: 'lightbulb-on', color: '#F57C00', screen: 'Solutions' },
  { key: 'Documents', label: 'Documents', icon: 'file-document-multiple', color: '#0277BD', screen: 'Documents' },
  { key: 'Videos', label: 'Videos', icon: 'video', color: '#C62828', screen: 'Videos' },
  { key: 'Leads', label: 'Leads', icon: 'account-group', color: '#6A1B9A', screen: 'Leads' },
  { key: 'Meetings', label: 'Meetings', icon: 'calendar-clock', color: '#00695C', screen: 'Meetings' },
  { key: 'Sync', label: 'Sync & Backup', icon: 'cloud-sync', color: '#37474F', screen: 'Sync' },
];

const HomeScreen = ({ navigation }) => {
  const tileSize = isTablet ? (width - 80) / 3 : (width - 48) / 2;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primaryDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Icon name="leaf" size={28} color="#FFF" />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.appName}>BioDesk</Text>
              <Text style={styles.companyName}>by Kriya Biosys</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => navigation.navigate('Search')}>
            <Icon name="magnify" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid */}
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.tile,
                {
                  width: index === MENU_ITEMS.length - 1 && MENU_ITEMS.length % 2 !== 0
                    ? (isTablet ? tileSize : tileSize * 2 + 16)
                    : tileSize,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}>
              <View style={[styles.tileIconWrap, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon} size={isTablet ? 40 : 32} color={item.color} />
              </View>
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.offlineBadge}>
            <Icon name="wifi-off" size={14} color={theme.colors.primary} />
            <Text style={styles.offlineText}>Offline Ready</Text>
          </View>
          <Text style={styles.version}>BioDesk v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  logoArea: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { marginLeft: 12 },
  appName: { fontSize: 26, fontWeight: '800', color: '#FFF', letterSpacing: 1 },
  companyName: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
    minHeight: isTablet ? 160 : 130,
  },
  tileIconWrap: {
    width: isTablet ? 72 : 60,
    height: isTablet ? 72 : 60,
    borderRadius: isTablet ? 36 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tileLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  footer: { alignItems: 'center', marginTop: 16, paddingBottom: 16 },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '12',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  offlineText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  version: {
    marginTop: 8,
    fontSize: 11,
    color: theme.colors.textLight,
  },
});

export default HomeScreen;
