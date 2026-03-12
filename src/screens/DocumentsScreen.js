import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import theme from '../constants/theme';
import { PRODUCTS } from '../constants/productData';

const DOC_TYPES = ['All', 'TDS', 'COA', 'Brochure', 'Label', 'SDS/MSDS'];

const DOC_META = {
  TDS: { icon: 'file-document', color: '#2196F3', label: 'Technical Data Sheet' },
  COA: { icon: 'file-certificate', color: '#4CAF50', label: 'Certificate of Analysis' },
  Brochure: { icon: 'file-presentation-box', color: '#FF9800', label: 'Product Brochure' },
  Label: { icon: 'label', color: '#9C27B0', label: 'Product Label' },
  'SDS/MSDS': { icon: 'file-alert', color: '#F44336', label: 'Safety Data Sheet' },
};

// Build document list from products
const buildDocList = () => {
  const docs = [];
  PRODUCTS.forEach(p => {
    Object.keys(DOC_META).forEach(type => {
      docs.push({
        id: `${p.id}-${type}`,
        productId: p.id,
        productName: p.name,
        category: p.category,
        docType: type,
        fileSize: `${Math.floor(Math.random() * 3 + 0.5 * 10) / 10} MB`,
      });
    });
  });
  return docs;
};

const ALL_DOCS = buildDocList();

const DocumentsScreen = ({ navigation }) => {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let docs = activeType === 'All' ? ALL_DOCS : ALL_DOCS.filter(d => d.docType === activeType);
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(d =>
        d.productName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return docs;
  }, [activeType, searchQuery]);

  const renderDoc = ({ item }) => {
    const meta = DOC_META[item.docType];
    return (
      <TouchableOpacity
        style={styles.docCard}
        activeOpacity={0.7}
        onPress={() => Alert.alert(item.productName, `${item.docType} document\n\nThis would open the ${item.docType} for ${item.productName} from local storage.`)}>
        <View style={[styles.docIcon, { backgroundColor: meta.color + '15' }]}>
          <Icon name={meta.icon} size={24} color={meta.color} />
        </View>
        <View style={styles.docInfo}>
          <Text style={styles.docName}>{item.productName}</Text>
          <Text style={styles.docType}>{meta.label}</Text>
          <View style={styles.docMeta}>
            <View style={styles.offlineBadge}>
              <Icon name="check-circle" size={12} color={theme.colors.success} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
            <Text style={styles.fileSize}>{item.fileSize}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Documents" subtitle={`${filtered.length} files`} onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search documents..." onClear={() => setSearchQuery('')} />
      </View>
      <FlatList
        data={DOC_TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.typeTab, activeType === item && styles.typeTabActive]}
            onPress={() => setActiveType(item)}>
            {item !== 'All' && <Icon name={DOC_META[item]?.icon || 'file'} size={14} color={activeType === item ? '#FFF' : DOC_META[item]?.color} />}
            <Text style={[styles.typeTabText, activeType === item && styles.typeTabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={i => i}
        contentContainerStyle={styles.typeList}
        style={styles.typeListWrap}
      />
      <FlatList
        data={filtered}
        renderItem={renderDoc}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="file-search-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No documents found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  typeListWrap: { maxHeight: 56 },
  typeList: { paddingHorizontal: 16, paddingVertical: 10 },
  typeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeTabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  typeTabText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  typeTabTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    ...theme.shadows.sm,
  },
  docIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  docType: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  offlineText: { fontSize: 11, color: theme.colors.success, fontWeight: '500' },
  fileSize: { fontSize: 11, color: theme.colors.textLight },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: theme.colors.textLight, marginTop: 12 },
});

export default DocumentsScreen;
