import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import theme from '../constants/theme';
import { PRODUCT_CERTIFICATES } from '../constants/certificateData';
import { PRODUCTS } from '../constants/productData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const CATEGORY_COLORS = {
  Organic: '#4CAF50',
  Regulatory: '#2196F3',
  Quality: '#FF9800',
  Trade: '#9C27B0',
};

const CATEGORY_ICONS = {
  Organic: 'leaf',
  Regulatory: 'shield-check',
  Quality: 'certificate',
  Trade: 'domain',
};

// Enrich product entries with data from PRODUCTS
const enrichedData = PRODUCT_CERTIFICATES.map(entry => {
  if (entry.isCompany) return entry;
  const product = PRODUCTS.find(p => p.name === entry.productName);
  return {
    ...entry,
    productId: product?.id || null,
    subcategory: product?.subcategory || 'Other',
  };
});

const CertificatesScreen = ({ navigation }) => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'Organic', 'Regulatory', 'Quality', 'Trade'];

  const filtered = useMemo(() => {
    let data = enrichedData;

    if (activeFilter !== 'All') {
      data = data
        .map(entry => ({
          ...entry,
          certificates: entry.certificates.filter(c => c.category === activeFilter),
        }))
        .filter(entry => entry.certificates.length > 0);
    }

    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      data = data.filter(entry =>
        entry.productName.toLowerCase().includes(q) ||
        entry.certificates.some(c =>
          c.name.toLowerCase().includes(q) ||
          c.authority.toLowerCase().includes(q)
        )
      );
    }

    return data;
  }, [activeFilter, searchQuery]);

  const totalCerts = filtered.reduce((sum, e) => sum + e.certificates.length, 0);

  const toggleExpand = (productName) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedProduct(prev => prev === productName ? null : productName);
  };

  const openCertificate = (cert) => {
    navigation.navigate('CertificateViewer', {
      certName: cert.name,
      authority: cert.authority,
      asset: cert.asset,
    });
  };

  const renderFilterChip = (filter) => {
    const isActive = activeFilter === filter;
    const color = CATEGORY_COLORS[filter] || theme.colors.primary;
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.chip, isActive && { backgroundColor: color, borderColor: color }]}
        onPress={() => setActiveFilter(filter)}
        activeOpacity={0.7}>
        {filter !== 'All' && isActive && (
          <Icon name={CATEGORY_ICONS[filter]} size={14} color="#FFF" style={{ marginRight: 5 }} />
        )}
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCertCard = (cert, index) => {
    const color = CATEGORY_COLORS[cert.category] || theme.colors.primary;
    return (
      <TouchableOpacity
        key={cert.id + '-' + index}
        style={styles.certCard}
        activeOpacity={0.7}
        onPress={() => openCertificate(cert)}>
        <View style={[styles.certLogoWrap, { backgroundColor: color + '12' }]}>
          {cert.logo ? (
            <Image source={cert.logo} style={styles.certLogoImg} resizeMode="contain" />
          ) : (
            <Icon name={CATEGORY_ICONS[cert.category] || 'certificate'} size={22} color={color} />
          )}
        </View>
        <View style={styles.certInfo}>
          <Text style={styles.certName}>{cert.name}</Text>
          <Text style={styles.certAuthority}>{cert.authority}</Text>
          <Text style={styles.certDesc} numberOfLines={2}>{cert.description}</Text>
        </View>
        <View style={styles.viewBtn}>
          <Icon name="eye-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.viewBtnText}>View</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductEntry = (entry) => {
    const isExpanded = expandedProduct === entry.productName;
    const certCount = entry.certificates.length;

    return (
      <View key={entry.productName} style={styles.productCard}>
        <TouchableOpacity
          style={styles.productHeader}
          activeOpacity={0.7}
          onPress={() => toggleExpand(entry.productName)}>
          <View style={[styles.productIcon, entry.isCompany && styles.companyIcon]}>
            <Icon
              name={entry.isCompany ? 'domain' : 'package-variant'}
              size={22}
              color={entry.isCompany ? '#FF9800' : theme.colors.primary}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{entry.productName}</Text>
            <Text style={styles.productMeta}>
              {entry.isCompany ? 'Company Certifications' : entry.subcategory}
              {'  ·  '}
              {certCount} certificate{certCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.certCountBadge}>
            <Text style={styles.certCountText}>{certCount}</Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={theme.colors.textLight}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.certList}>
            {entry.certificates.map((cert, i) => renderCertCard(cert, i))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Certificates"
        subtitle={`${filtered.length} products · ${totalCerts} certificates`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products or certificates..."
          onClear={() => setSearchQuery('')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipBar}>
          {FILTERS.map(f => renderFilterChip(f))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map(entry => renderProductEntry(entry))
        ) : (
          <View style={styles.empty}>
            <Icon name="certificate" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No certificates found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  filterSection: {
    backgroundColor: '#FFF',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  chipBar: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  chipTextActive: { color: '#FFF', fontWeight: '700' },

  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 16 : 14,
    gap: 12,
  },
  productIcon: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyIcon: { backgroundColor: '#FFF3E0' },
  productInfo: { flex: 1 },
  productName: { fontSize: isTablet ? 16 : 15, fontWeight: '700', color: theme.colors.text },
  productMeta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  certCountBadge: {
    backgroundColor: theme.colors.primary + '12',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  certCountText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

  certList: {
    paddingHorizontal: isTablet ? 16 : 14,
    paddingBottom: isTablet ? 16 : 14,
    gap: 8,
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  certLogoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  certLogoImg: { width: 30, height: 30 },
  certInfo: { flex: 1 },
  certName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  certAuthority: { fontSize: 11, color: theme.colors.textLight, fontWeight: '600', marginTop: 1 },
  certDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2, lineHeight: 17 },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: theme.colors.textLight, marginTop: 12 },
});

export default CertificatesScreen;
