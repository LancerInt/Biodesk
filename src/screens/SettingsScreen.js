import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import LanguagePicker from '../components/common/LanguagePicker';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { getLanguage } from '../i18n';

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [pinSection, setPinSection] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const currentLang = getLanguage(i18n.language);

  const handleChangePin = async () => {
    const stored = await DatabaseService.getSetting('admin_pin');
    if (oldPin !== (stored || '1234')) {
      Alert.alert(t('common.error'), t('settings.pinIncorrect'));
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      Alert.alert(t('common.error'), t('settings.pinMustBe4Digits'));
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert(t('common.error'), t('settings.pinsDoNotMatch'));
      return;
    }
    await DatabaseService.setSetting('admin_pin', newPin);
    Alert.alert(t('common.success'), t('settings.pinChangedSuccess'));
    setPinSection(false);
    setOldPin(''); setNewPin(''); setConfirmPin('');
  };

  const handleClearLeads = () => {
    Alert.alert(
      t('settings.clearAllLeadsTitle'),
      t('settings.clearAllLeadsMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.clearLeadsBtn'), style: 'destructive', onPress: async () => { await DatabaseService.clearLeads(); Alert.alert(t('common.done'), t('settings.leadsCleared')); } },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      t('settings.clearAllDataTitle'),
      t('settings.clearAllDataMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.clearEverythingBtn'), style: 'destructive', onPress: async () => { await DatabaseService.clearAll(); Alert.alert(t('common.done'), t('settings.allDataCleared')); } },
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
      <Header title={t('screens.settings')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => setLangPickerOpen(true)} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: '#2E7D32' + '15' }]}>
              <Icon name="translate" size={22} color="#2E7D32" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{currentLang.nativeName}</Text>
              <Text style={styles.rowDesc}>{t('settings.languageDesc')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>{t('settings.security')}</Text>
        <View style={styles.card}>
          <SettingRow icon="lock-reset" iconColor="#1B5E20" title={t('settings.changeAdminPin')} desc={t('settings.changeAdminPinDesc')} onPress={() => setPinSection(!pinSection)} />
          {pinSection && (
            <View style={styles.pinForm}>
              <PinField label={t('settings.currentPin')} value={oldPin} onChange={setOldPin} />
              <PinField label={t('settings.newPin')} value={newPin} onChange={setNewPin} />
              <PinField label={t('settings.confirmNewPin')} value={confirmPin} onChange={setConfirmPin} />
              <TouchableOpacity style={styles.pinSaveBtn} onPress={handleChangePin}>
                <Text style={styles.pinSaveBtnText}>{t('settings.updatePin')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>{t('settings.syncBackup')}</Text>
        <View style={styles.card}>
          <SettingRow icon="cloud-sync" iconColor="#37474F" title={t('settings.syncBackup')} desc={t('settings.syncBackupDesc')} onPress={() => navigation.navigate('Sync')} />
        </View>

        <Text style={styles.sectionLabel}>{t('settings.dataManagement')}</Text>
        <View style={styles.card}>
          <SettingRow icon="trash-can" iconColor={theme.colors.error} title={t('settings.clearLeadData')} desc={t('settings.clearLeadDataDesc')} onPress={handleClearLeads} danger />
          <SettingRow icon="delete-forever" iconColor={theme.colors.error} title={t('settings.clearAllData')} desc={t('settings.clearAllDataDesc')} onPress={handleClearAll} danger />
        </View>

        <Text style={styles.sectionLabel}>{t('settings.about')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Icon name="information" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>BioDesk</Text>
              <Text style={styles.rowDesc}>{t('settings.version')} 1.0.0 | Kriya Biosys</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#FF9800' + '15' }]}>
              <Icon name="leaf" size={22} color="#FF9800" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('settings.productDatabase')}</Text>
              <Text style={styles.rowDesc}>{t('settings.productDatabaseDesc')}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#2196F3' + '15' }]}>
              <Icon name="wifi-off" size={22} color="#2196F3" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('settings.offlineMode')}</Text>
              <Text style={styles.rowDesc}>{t('settings.offlineModeDesc')}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      <LanguagePicker visible={langPickerOpen} onClose={() => setLangPickerOpen(false)} />
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
