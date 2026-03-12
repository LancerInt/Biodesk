import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { PROFILE_SECTIONS } from '../constants/profileData';

const ProfileScreen = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState(0);
  const section = PROFILE_SECTIONS[activeSection];

  const renderAbout = () => (
    <View>
      <Text style={styles.headline}>{section.content.headline}</Text>
      <Text style={styles.bodyText}>{section.content.description}</Text>

      <Text style={styles.subTitle}>Highlights</Text>
      {section.content.highlights.map((h, i) => (
        <View key={i} style={styles.highlightRow}>
          <Icon name="check-decagram" size={18} color={theme.colors.primary} />
          <Text style={styles.highlightText}>{h}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>Our Mission</Text>
      <View style={styles.quoteCard}>
        <Icon name="format-quote-open" size={24} color={theme.colors.secondary} />
        <Text style={styles.quoteText}>{section.content.mission}</Text>
      </View>

      <Text style={styles.subTitle}>Our Vision</Text>
      <View style={styles.quoteCard}>
        <Icon name="eye" size={24} color={theme.colors.primary} />
        <Text style={styles.quoteText}>{section.content.vision}</Text>
      </View>

      <Text style={styles.subTitle}>Core Values</Text>
      {section.content.values.map((v, i) => (
        <View key={i} style={styles.valueCard}>
          <Text style={styles.valueTitle}>{v.title}</Text>
          <Text style={styles.valueDesc}>{v.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderManufacturing = () => (
    <View>
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <Text style={styles.subTitle}>Capabilities</Text>
      {section.content.capabilities.map((c, i) => (
        <View key={i} style={styles.capCard}>
          <View style={styles.capIconWrap}>
            <Icon name={c.icon} size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitle}>{c.title}</Text>
            <Text style={styles.capDesc}>{c.description}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.subTitle}>Production Capacity</Text>
      <View style={styles.statsRow}>
        {section.content.capacity.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.metric}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRnD = () => (
    <View>
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <Text style={styles.subTitle}>Research Areas</Text>
      {section.content.areas.map((a, i) => (
        <View key={i} style={styles.capCard}>
          <View style={styles.capIconWrap}>
            <Icon name={a.icon} size={24} color={theme.colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitle}>{a.title}</Text>
            <Text style={styles.capDesc}>{a.description}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.subTitle}>Achievements</Text>
      {section.content.achievements.map((a, i) => (
        <View key={i} style={styles.highlightRow}>
          <Icon name="trophy" size={18} color={theme.colors.secondary} />
          <Text style={styles.highlightText}>{a}</Text>
        </View>
      ))}
    </View>
  );

  const renderGlobal = () => (
    <View>
      <Text style={styles.bodyText}>{section.content.description}</Text>
      <View style={styles.statsRow}>
        {section.content.stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.subTitle}>Regional Presence</Text>
      {section.content.regions.map((r, i) => (
        <View key={i} style={styles.regionCard}>
          <View style={styles.regionHeader}>
            <Text style={styles.regionName}>{r.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: r.status === 'Established' ? '#E8F5E9' : r.status === 'Growing' ? '#FFF3E0' : '#F3E5F5' }]}>
              <Text style={[styles.statusText, { color: r.status === 'Established' ? '#2E7D32' : r.status === 'Growing' ? '#E65100' : '#7B1FA2' }]}>{r.status}</Text>
            </View>
          </View>
          <Text style={styles.countries}>{r.countries.join(' | ')}</Text>
        </View>
      ))}
    </View>
  );

  const renderCertifications = () => (
    <View>
      <Text style={styles.bodyText}>{section.content.description}</Text>
      {section.content.certifications.map((c, i) => (
        <View key={i} style={styles.certCard}>
          <View style={styles.certIcon}>
            <Icon name="certificate" size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.certHeader}>
              <Text style={styles.certName}>{c.name}</Text>
              <View style={styles.certCatBadge}><Text style={styles.certCatText}>{c.category}</Text></View>
            </View>
            <Text style={styles.certDesc}>{c.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderers = [renderAbout, renderManufacturing, renderRnD, renderGlobal, renderCertifications];

  return (
    <View style={styles.container}>
      <Header title="Kriya Profile" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
        {PROFILE_SECTIONS.map((s, i) => (
          <TouchableOpacity key={s.id} style={[styles.tab, activeSection === i && styles.tabActive]} onPress={() => setActiveSection(i)}>
            <Icon name={s.icon} size={18} color={activeSection === i ? theme.colors.primary : theme.colors.textLight} />
            <Text style={[styles.tabText, activeSection === i && styles.tabTextActive]}>{s.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderers[activeSection]()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: { backgroundColor: '#FFF', maxHeight: 52, ...theme.shadows.sm },
  tabContent: { paddingHorizontal: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 6 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 13, fontWeight: '500', color: theme.colors.textLight },
  tabTextActive: { color: theme.colors.primary, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  headline: { fontSize: 24, fontWeight: '800', color: theme.colors.secondary, marginBottom: 12, fontStyle: 'italic' },
  bodyText: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 23, marginBottom: 12 },
  subTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 20, marginBottom: 12 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  highlightText: { flex: 1, fontSize: 14, color: theme.colors.text },
  quoteCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 8, ...theme.shadows.sm },
  quoteText: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  valueCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  valueTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  valueDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
  capCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, ...theme.shadows.sm },
  capIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  capTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  capDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 3, lineHeight: 19 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  statCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, flex: 1, minWidth: 140, alignItems: 'center', ...theme.shadows.sm },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.colors.primary },
  statLabel: { fontSize: 11, color: theme.colors.textLight, marginTop: 4, textAlign: 'center' },
  regionCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, ...theme.shadows.sm },
  regionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  regionName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  countries: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 6 },
  certCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, ...theme.shadows.sm },
  certIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  certHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certName: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  certCatBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  certCatText: { fontSize: 10, fontWeight: '600', color: theme.colors.textSecondary },
  certDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 3 },
});

export default ProfileScreen;
