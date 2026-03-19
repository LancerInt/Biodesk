import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';

const SettingsScreen = ({ navigation }) => {
  const [pinSection, setPinSection] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleChangePin = async () => {
    const stored = await DatabaseService.getSetting('admin_pin');
    if (oldPin !== (stored || '1234')) {
      Alert.alert('Error', 'Current PIN is incorrect.');
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      Alert.alert('Error', 'New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New PINs do not match.');
      return;
    }
    await DatabaseService.setSetting('admin_pin', newPin);
    Alert.alert('Success', 'Admin PIN changed successfully!');
    setPinSection(false);
    setOldPin(''); setNewPin(''); setConfirmPin('');
  };

  const handleClearLeads = () => {
    Alert.alert(
      'Clear All Leads',
      'This will permanently delete all captured leads. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Leads', style: 'destructive', onPress: async () => { await DatabaseService.clearLeads(); Alert.alert('Done', 'All leads have been cleared.'); } },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL leads, meetings, and stored data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Everything', style: 'destructive', onPress: async () => { await DatabaseService.clearAll(); Alert.alert('Done', 'All data cleared.'); } },
      ]
    );
  };

  const SettingRow = ({ icon, iconColor, title, desc, onPress, danger }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: (iconColor || theme.colors.primary) + '15' }]}>
        <Icon name={icon} size={22} color={danger ? theme.colors.error : iconColor || theme.colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, danger && { color: theme.colors.error }]}>{title}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
      <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>Security</Text>
        <View style={styles.card}>
          <SettingRow icon="lock-reset" iconColor="#1B5E20" title="Change Admin PIN" desc="Update the 4-digit admin PIN" onPress={() => setPinSection(!pinSection)} />
          {pinSection && (
            <View style={styles.pinForm}>
              <PinField label="Current PIN" value={oldPin} onChange={setOldPin} />
              <PinField label="New PIN" value={newPin} onChange={setNewPin} />
              <PinField label="Confirm New PIN" value={confirmPin} onChange={setConfirmPin} />
              <TouchableOpacity style={styles.pinSaveBtn} onPress={handleChangePin}>
                <Text style={styles.pinSaveBtnText}>Update PIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>Sync & Backup</Text>
        <View style={styles.card}>
          <SettingRow icon="cloud-sync" iconColor="#37474F" title="Sync & Backup" desc="Export leads, backup data" onPress={() => navigation.navigate('Sync')} />
        </View>

        <Text style={styles.sectionLabel}>Data Management</Text>
        <View style={styles.card}>
          <SettingRow icon="trash-can" iconColor={theme.colors.error} title="Clear Lead Data" desc="Delete all captured leads" onPress={handleClearLeads} danger />
          <SettingRow icon="delete-forever" iconColor={theme.colors.error} title="Clear All Data" desc="Delete all leads, meetings, and notes" onPress={handleClearAll} danger />
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Icon name="information" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>BioDesk</Text>
              <Text style={styles.rowDesc}>Version 1.0.0 | by Kriya Biosys</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#FF9800' + '15' }]}>
              <Icon name="leaf" size={22} color="#FF9800" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Product Database</Text>
              <Text style={styles.rowDesc}>40 products across 5 categories</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#2196F3' + '15' }]}>
              <Icon name="wifi-off" size={22} color="#2196F3" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Offline Mode</Text>
              <Text style={styles.rowDesc}>All features work without internet</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const PinField = ({ label, value, onChange }) => (
  <View style={styles.pinField}>
    <Text style={styles.pinFieldLabel}>{label}</Text>
    <TextInput
      style={styles.pinInput}
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      maxLength={4}
      secureTextEntry
      placeholder="••••"
      placeholderTextColor={theme.colors.textLight}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  card: { backgroundColor: '#FFF', borderRadius: 14, overflow: 'hidden', ...theme.shadows.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
    gap: 12,
  },
  rowIcon: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  rowDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  pinForm: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.divider,
  },
  pinField: { marginBottom: 12 },
  pinFieldLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4, fontWeight: '500' },
  pinInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    color: theme.colors.text,
    letterSpacing: 8,
    textAlign: 'center',
    width: 120,
  },
  pinSaveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  pinSaveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});

export default SettingsScreen;
