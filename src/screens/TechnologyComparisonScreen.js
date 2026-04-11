import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { TECHNOLOGIES, getTechnologyById } from '../constants/technologyData';

const PLATFORM_IDS = ['wynn', 'microvate', 'karyo'];

// Comparison categories with structured data extraction
const COMPARISON_CATEGORIES = [
  { id: 'role', title: 'Platform Role', icon: 'target' },
  { id: 'scope', title: 'Scope & Ownership', icon: 'shield-check' },
  { id: 'pillars', title: 'Core Capabilities (6 Pillars)', icon: 'pillar' },
  { id: 'differentiators', title: 'Key Differentiators', icon: 'star-four-points' },
  { id: 'activeTypes', title: 'Active Types Supported', icon: 'flask' },
  { id: 'coverage', title: 'Coverage & Application', icon: 'spray' },
  { id: 'future', title: 'Future Potential', icon: 'rocket-launch' },
];

const TechnologyComparisonScreen = ({ navigation }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(PLATFORM_IDS);
  const [expandedSections, setExpandedSections] = useState({ role: true, scope: true });

  const platforms = useMemo(
    () => selectedPlatforms.map(id => getTechnologyById(id)).filter(Boolean),
    [selectedPlatforms]
  );

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // Min 2 for comparison
        return prev.filter(p => p !== id);
      }
      return [...prev, id];
    });
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ─── Platform Selector ───────────────────────────────────────
  const renderSelector = () => (
    <View style={styles.selectorSection}>
      <Text style={styles.selectorTitle}>Select Platforms to Compare</Text>
      <View style={styles.selectorRow}>
        {PLATFORM_IDS.map(id => {
          const tech = getTechnologyById(id);
          const isSelected = selectedPlatforms.includes(id);
          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.selectorChip,
                isSelected && { backgroundColor: tech.color, borderColor: tech.color },
              ]}
              onPress={() => togglePlatform(id)}
              activeOpacity={0.7}>
              <Icon name={tech.icon} size={16} color={isSelected ? '#FFF' : tech.color} />
              <Text style={[styles.selectorText, isSelected && { color: '#FFF' }]}>
                {tech.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── Column Headers ──────────────────────────────────────────
  const renderColumnHeaders = () => (
    <View style={styles.headerRow}>
      <View style={styles.labelCol}>
        <Text style={styles.labelColText}>Category</Text>
      </View>
      {platforms.map(tech => (
        <View key={tech.id} style={[styles.valueCol, { borderTopColor: tech.color }]}>
          <Icon name={tech.icon} size={18} color={tech.color} />
          <Text style={[styles.colHeaderText, { color: tech.color }]} numberOfLines={1}>
            {tech.name}
          </Text>
        </View>
      ))}
    </View>
  );

  // ─── Comparison Sections ─────────────────────────────────────
  const renderSection = (category) => {
    const isExpanded = expandedSections[category.id];
    return (
      <View key={category.id} style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(category.id)}
          activeOpacity={0.7}>
          <View style={styles.sectionHeaderLeft}>
            <Icon name={category.icon} size={20} color={theme.colors.primary} />
            <Text style={styles.sectionHeaderText}>{category.title}</Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={theme.colors.textLight}
          />
        </TouchableOpacity>
        {isExpanded && renderSectionContent(category.id)}
      </View>
    );
  };

  const renderSectionContent = (categoryId) => {
    switch (categoryId) {
      case 'role': return renderRoleComparison();
      case 'scope': return renderScopeComparison();
      case 'pillars': return renderPillarsComparison();
      case 'differentiators': return renderDifferentiatorsComparison();
      case 'activeTypes': return renderActiveTypesComparison();
      case 'coverage': return renderCoverageComparison();
      case 'future': return renderFutureComparison();
      default: return null;
    }
  };

  // ─── Role Comparison ─────────────────────────────────────────
  const renderRoleComparison = () => (
    <View style={styles.sectionBody}>
      {/* Tagline row */}
      <ComparisonRow label="Tagline" platforms={platforms} extractor={t => t.tagline} />
      <ComparisonRow label="Core Focus" platforms={platforms} extractor={t => t.corePositioning} multiline />
    </View>
  );

  // ─── Scope Comparison ────────────────────────────────────────
  const renderScopeComparison = () => (
    <View style={styles.sectionBody}>
      {/* Owns */}
      <Text style={styles.subSectionTitle}>What Each Platform Owns</Text>
      <View style={styles.comparisonGrid}>
        {platforms.map(tech => (
          <View key={tech.id} style={[styles.scopeColumn, { flex: 1 }]}>
            <View style={[styles.scopeColumnHeader, { backgroundColor: tech.color + '10' }]}>
              <Text style={[styles.scopeColumnTitle, { color: tech.color }]}>{tech.name}</Text>
            </View>
            {(tech.scope?.owns || []).map((item, i) => (
              <View key={i} style={styles.scopeItem}>
                <Icon name="check-circle" size={14} color={theme.colors.success} />
                <Text style={styles.scopeItemText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Does Not Own */}
      <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>Boundaries (Does Not Own)</Text>
      <View style={styles.comparisonGrid}>
        {platforms.map(tech => (
          <View key={tech.id} style={[styles.scopeColumn, { flex: 1 }]}>
            <View style={[styles.scopeColumnHeader, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.scopeColumnTitle, { color: theme.colors.error }]}>{tech.name}</Text>
            </View>
            {(tech.scope?.does_not_own || []).map((item, i) => (
              <View key={i} style={styles.scopeItem}>
                <Icon name="close-circle" size={14} color={theme.colors.error} />
                <Text style={styles.scopeItemText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  // ─── Pillars Comparison ──────────────────────────────────────
  const renderPillarsComparison = () => {
    const maxPillars = Math.max(...platforms.map(t => (t.features || []).length));
    return (
      <View style={styles.sectionBody}>
        {Array.from({ length: maxPillars }).map((_, idx) => (
          <View key={idx} style={styles.pillarRow}>
            <View style={styles.pillarIndex}>
              <Text style={styles.pillarIndexText}>{idx + 1}</Text>
            </View>
            <View style={styles.pillarColumns}>
              {platforms.map(tech => {
                const feature = (tech.features || [])[idx];
                return (
                  <View key={tech.id} style={[styles.pillarCell, { borderLeftColor: tech.color }]}>
                    {feature ? (
                      <>
                        <Text style={[styles.pillarTitle, { color: tech.color }]}>{feature.title}</Text>
                        <Text style={styles.pillarDesc} numberOfLines={3}>{feature.description}</Text>
                      </>
                    ) : (
                      <Text style={styles.pillarEmpty}>—</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ─── Differentiators Comparison ──────────────────────────────
  const renderDifferentiatorsComparison = () => (
    <View style={styles.sectionBody}>
      <View style={styles.comparisonGrid}>
        {platforms.map(tech => (
          <View key={tech.id} style={[styles.diffColumn, { flex: 1 }]}>
            <View style={[styles.scopeColumnHeader, { backgroundColor: tech.color + '10' }]}>
              <Text style={[styles.scopeColumnTitle, { color: tech.color }]}>{tech.name}</Text>
            </View>
            {(tech.differentiators || []).map((d, i) => (
              <View key={i} style={styles.diffItem}>
                <View style={[styles.diffDot, { backgroundColor: tech.color }]} />
                <View style={styles.diffContent}>
                  <Text style={styles.diffTitle}>{d.title}</Text>
                  <Text style={styles.diffBody} numberOfLines={3}>{d.body}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  // ─── Active Types Comparison ─────────────────────────────────
  const renderActiveTypesComparison = () => {
    const types = ['Microbial Systems', 'Botanical Actives', 'Combined / Co-Delivery'];
    const matrix = {
      wynn: [true, false, false],
      karyo: [true, true, true],
      microvate: [true, false, false],
    };
    return (
      <View style={styles.sectionBody}>
        {/* Table header */}
        <View style={styles.tableRow}>
          <View style={styles.tableLabel}><Text style={styles.tableLabelText}>Active Type</Text></View>
          {platforms.map(tech => (
            <View key={tech.id} style={styles.tableCell}>
              <Text style={[styles.tableCellHeader, { color: tech.color }]}>{tech.name}</Text>
            </View>
          ))}
        </View>
        {types.map((type, idx) => (
          <View key={type} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
            <View style={styles.tableLabel}><Text style={styles.tableValueText}>{type}</Text></View>
            {platforms.map(tech => {
              const supported = matrix[tech.id]?.[idx];
              return (
                <View key={tech.id} style={styles.tableCell}>
                  <Icon
                    name={supported ? 'check-circle' : 'minus-circle-outline'}
                    size={20}
                    color={supported ? theme.colors.success : theme.colors.textLight}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // ─── Coverage / Application Comparison ───────────────────────
  const renderCoverageComparison = () => {
    const rows = [
      { label: 'Platform Type', extract: (t) => t.id === 'wynn' ? 'Upstream Science' : t.id === 'karyo' ? 'Midstream Delivery' : 'Downstream Activation' },
      { label: 'Primary Focus', extract: (t) => t.id === 'wynn' ? 'Discovery & Validation' : t.id === 'karyo' ? 'Protection & Delivery' : 'Point-of-Use Readiness' },
      { label: 'Scope', extract: (t) => t.id === 'wynn' ? 'Microbial Only' : t.id === 'karyo' ? 'Microbial + Botanical' : 'Microbial Only' },
      { label: 'Integration Point', extract: (t) => t.id === 'wynn' ? 'Feeds into Karyo & Microvate' : t.id === 'karyo' ? 'Receives from Wynn, feeds into products' : 'Receives from Wynn via Karyo' },
    ];
    return (
      <View style={styles.sectionBody}>
        {rows.map((row, idx) => (
          <View key={row.label} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
            <View style={styles.tableLabel}><Text style={styles.tableValueText}>{row.label}</Text></View>
            {platforms.map(tech => (
              <View key={tech.id} style={styles.tableCell}>
                <Text style={styles.tableCellValue}>{row.extract(tech)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // ─── Future Potential Comparison ─────────────────────────────
  const renderFutureComparison = () => (
    <View style={styles.sectionBody}>
      {platforms.map(tech => (
        <View key={tech.id} style={[styles.futureCard, { borderLeftColor: tech.color }]}>
          <View style={styles.futureHeader}>
            <Icon name={tech.icon} size={18} color={tech.color} />
            <Text style={[styles.futureTitle, { color: tech.color }]}>{tech.name}</Text>
          </View>
          <Text style={styles.futureBody}>{tech.futurePotential}</Text>
        </View>
      ))}
    </View>
  );

  // ─── Main Render ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Header
        title="Platform Comparison"
        subtitle="Advanced scope analysis"
        onBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSelector()}
        {renderColumnHeaders()}
        {COMPARISON_CATEGORIES.map(cat => renderSection(cat))}
      </ScrollView>
    </View>
  );
};

// ─── Generic Comparison Row ────────────────────────────────────
const ComparisonRow = ({ label, platforms, extractor, multiline }) => (
  <View style={styles.compRow}>
    <Text style={styles.compRowLabel}>{label}</Text>
    <View style={styles.compRowValues}>
      {platforms.map(tech => (
        <View key={tech.id} style={[styles.compRowCell, { borderLeftColor: tech.color }]}>
          <Text style={[styles.compRowValue, multiline && styles.compRowValueMulti]} numberOfLines={multiline ? 6 : 2}>
            {extractor(tech) || '—'}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 32 },

  // Selector
  selectorSection: { padding: 16 },
  selectorTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 10 },
  selectorRow: { flexDirection: 'row', gap: 8 },
  selectorChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 6,
  },
  selectorText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },

  // Column headers
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  labelCol: { width: 70, justifyContent: 'center', paddingHorizontal: 8 },
  labelColText: { fontSize: 10, fontWeight: '700', color: theme.colors.textLight, textTransform: 'uppercase' },
  valueCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 3,
    borderTopColor: theme.colors.primary,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  colHeaderText: { fontSize: 12, fontWeight: '700', marginTop: 4 },

  // Section accordion
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sectionHeaderText: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  sectionBody: { paddingHorizontal: 12, paddingBottom: 14 },

  // Sub-section
  subSectionTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 8 },

  // Comparison grid (side-by-side columns)
  comparisonGrid: { flexDirection: 'row', gap: 6 },

  // Scope columns
  scopeColumn: { minWidth: 0 },
  scopeColumnHeader: { borderRadius: 6, paddingVertical: 6, paddingHorizontal: 8, marginBottom: 6 },
  scopeColumnTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  scopeItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginBottom: 4, paddingHorizontal: 4 },
  scopeItemText: { flex: 1, fontSize: 11, color: theme.colors.text, lineHeight: 16, textAlign: 'justify' },

  // Pillar comparison
  pillarRow: { flexDirection: 'row', marginBottom: 8 },
  pillarIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 4,
  },
  pillarIndexText: { fontSize: 11, fontWeight: '700', color: theme.colors.primary },
  pillarColumns: { flex: 1, flexDirection: 'row', gap: 4 },
  pillarCell: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 3,
  },
  pillarTitle: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  pillarDesc: { fontSize: 10, color: theme.colors.textSecondary, lineHeight: 14, textAlign: 'justify' },
  pillarEmpty: { fontSize: 12, color: theme.colors.textLight, textAlign: 'center' },

  // Differentiator columns
  diffColumn: { minWidth: 0 },
  diffItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginBottom: 6, paddingHorizontal: 4 },
  diffDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  diffContent: { flex: 1 },
  diffTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.text, marginBottom: 1 },
  diffBody: { fontSize: 10, color: theme.colors.textSecondary, lineHeight: 14, textAlign: 'justify' },

  // Table rows
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 4 },
  tableRowAlt: { backgroundColor: '#FAFAFA', borderRadius: 6 },
  tableLabel: { width: 80, justifyContent: 'center', paddingRight: 4 },
  tableLabelText: { fontSize: 10, fontWeight: '700', color: theme.colors.textLight, textTransform: 'uppercase' },
  tableValueText: { fontSize: 11, fontWeight: '600', color: theme.colors.text },
  tableCell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  tableCellHeader: { fontSize: 11, fontWeight: '700' },
  tableCellValue: { fontSize: 11, color: theme.colors.text, textAlign: 'center', lineHeight: 16 },

  // Generic comparison row
  compRow: { marginBottom: 12 },
  compRowLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textLight, marginBottom: 6 },
  compRowValues: { flexDirection: 'row', gap: 6 },
  compRowCell: { flex: 1, backgroundColor: '#FAFAFA', borderRadius: 8, padding: 10, borderLeftWidth: 3 },
  compRowValue: { fontSize: 12, color: theme.colors.text, lineHeight: 18 },
  compRowValueMulti: { fontSize: 11, lineHeight: 17 },

  // Future potential cards
  futureCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  futureHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  futureTitle: { fontSize: 14, fontWeight: '700' },
  futureBody: { fontSize: 12, color: theme.colors.textSecondary, lineHeight: 19 },
});

export default TechnologyComparisonScreen;
