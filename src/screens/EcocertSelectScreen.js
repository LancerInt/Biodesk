import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';

const CERT_PDFS = {
  EU: require('../assets/certificates/ECOCERT-EU.pdf'),
  JAS: require('../assets/certificates/ECOCERT-JAS.pdf'),
  NOP: require('../assets/certificates/ECOCERT-NOP.pdf'),
};

const TYPES = [
  { name: 'EU', description: 'European Union Organic Regulation', icon: 'earth' },
  { name: 'JAS', description: 'Japanese Agricultural Standards', icon: 'earth' },
  { name: 'NOP', description: 'USDA National Organic Program', icon: 'earth' },
];

const EcocertSelectScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Header title="Ecocert Certified" onBack={() => navigation.goBack()} />
    <View style={styles.content}>
      <Text style={styles.heading}>Select Certificate Type</Text>
      {TYPES.map((t) => (
        <TouchableOpacity
          key={t.name}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('CertificateViewer', {
            certName: `Ecocert — ${t.name}`,
            authority: 'Organic',
            asset: CERT_PDFS[t.name],
          })}
        >
          <View style={styles.iconWrap}>
            <Icon name="file-certificate-outline" size={26} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.typeName}>{t.name}</Text>
            <Text style={styles.typeDesc}>{t.description}</Text>
          </View>
          <Icon name="chevron-right" size={22} color={theme.colors.textLight} />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    ...theme.shadows.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeName: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  typeDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
});

export default EcocertSelectScreen;
