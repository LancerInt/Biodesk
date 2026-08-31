import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n';
import theme from '../../constants/theme';

// Simple modal language picker used from both Settings and Home header.
// Handles the RTL-reload prompt when Arabic <-> LTR is toggled.
export default function LanguagePicker({ visible, onClose }) {
  const { t, i18n } = useTranslation();
  const { changeLanguage, state } = useApp();
  const current = i18n.language || state.language || 'en';

  const handlePick = async (code) => {
    if (code === current) { onClose(); return; }
    const needsReload = await changeLanguage(code);
    onClose();
    if (needsReload) {
      Alert.alert(
        t('settings.restartRequired'),
        t('settings.restartMessage'),
        [{ text: t('actions.ok') }]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('settings.language')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Icon name="close" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={LANGUAGES}
            keyExtractor={l => l.code}
            renderItem={({ item }) => {
              const isActive = item.code === current;
              return (
                <TouchableOpacity
                  style={[styles.row, isActive && styles.rowActive]}
                  onPress={() => handlePick(item.code)}
                  activeOpacity={0.7}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.native}>{item.nativeName}</Text>
                    <Text style={styles.english}>{item.name}</Text>
                  </View>
                  {isActive && <Icon name="check-circle" size={22} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sheet: {
    width: '86%', maxHeight: '76%', backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  rowActive: { backgroundColor: theme.colors.primary + '10' },
  native: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  english: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
});
