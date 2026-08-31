// ═══════════════════════════════════════════════════════════════
// TRANSLATE TOGGLE
// ═══════════════════════════════════════════════════════════════
// A floating pill that flips the app between English and whichever
// language the user last had selected.
//
// It only ever offers the OTHER language:
//   • running in Spanish → "Translate to English"
//   • switched to English → "Translate to Español"
// so a rep can bounce back and forth while showing a customer.
//
// The pill shows for VISIBLE_MS on every page change and on every
// language change, then fades out so it does not sit over content.
// Tapping it restarts that window, leaving the reverse option ready.
//
// Nothing is offered when the app has only ever been in English —
// there is no second language to go back to.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { getLanguage, DEFAULT_LANGUAGE } from '../../i18n/languages';
import theme from '../../constants/theme';

const VISIBLE_MS = 20000;

// Screens that are already full-bleed or modal — a floating pill would
// sit over the content with nothing useful to translate.
const HIDDEN_ON = ['Landing', 'CertificateViewer', 'PresentationViewer', 'LiveScanner'];

// `routeName` is passed in by AppNavigator: this component lives outside
// Stack.Navigator, so navigation hooks would throw here.
const TranslateToggle = ({ routeName }) => {
  const { i18n } = useTranslation();
  const { changeLanguage } = useApp();

  const current = (i18n.language || DEFAULT_LANGUAGE).split('-')[0];
  const isEnglish = current === DEFAULT_LANGUAGE;

  // The non-English language to come back to. Remembered across toggles so
  // "Translate to Español" still works after switching to English.
  const lastOther = useRef(isEnglish ? null : current);
  if (!isEnglish) lastOther.current = current;

  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  // Show for a fresh window; any pending hide is cancelled first.
  const reveal = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
  }, []);

  // A new page or a language switch both re-offer the toggle.
  useEffect(() => { reveal(); }, [routeName, current, reveal]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  // Nothing to toggle to, or a screen we stay out of
  const target = isEnglish ? lastOther.current : DEFAULT_LANGUAGE;
  if (!target || HIDDEN_ON.includes(routeName)) return null;

  // Always label in the language being offered, so it reads as an invitation
  const label = isEnglish
    ? `Translate to ${getLanguage(target).nativeName}`
    : 'Translate to English';

  return (
    <Animated.View
      style={[styles.wrap, { opacity }]}
      pointerEvents={visible ? 'box-none' : 'none'}>
      <TouchableOpacity
        style={styles.pill}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => {
          changeLanguage(target);
          reveal(); // keep it up so the reverse switch is one tap away
        }}>
        <Icon name="translate" size={16} color="#FFF" />
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Bottom-left: the floating action button sits bottom-right at 24
  wrap: {
    position: 'absolute',
    left: 16,
    bottom: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TranslateToggle;
