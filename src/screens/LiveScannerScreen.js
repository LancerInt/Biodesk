import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import theme from '../constants/theme';

let VisionCamera = null;
let useCameraDevice = null;
let useCameraPermission = null;

try {
  const vc = require('react-native-vision-camera');
  useCameraDevice = vc.useCameraDevice;
  useCameraPermission = vc.useCameraPermission;
} catch {
  // Vision Camera not available
}

let OCRCamera = null;
try {
  OCRCamera = require('react-native-vision-camera-ocr-plus').Camera;
} catch {
  // OCR Camera not available
}

/**
 * LiveScannerScreen — real-time OCR using Vision Camera.
 *
 * route.params:
 *   onTextRecognized: (text: string) => void  — callback with raw recognized text
 *   title?: string — header title
 *   scanRegion?: { left, top, width, height } — percentage-based scan region
 */
const LiveScannerScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { onTextRecognized, title, scanRegion } = route.params || {};
  const screenTitle = title || t('liveScanner.scanText', { defaultValue: 'Scan Text' });

  const [recognizedText, setRecognizedText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const lastTextRef = useRef('');
  const stableCountRef = useRef(0);

  // Camera device & permission
  const device = useCameraDevice ? useCameraDevice('back') : null;
  const permission = useCameraPermission ? useCameraPermission() : { hasPermission: false, requestPermission: async () => false };

  const handleCallback = useCallback((data) => {
    if (!data) return;
    const text = typeof data === 'string' ? data : data.resultText || '';
    if (!text.trim()) return;

    setRecognizedText(text);

    // Stability detection: confirm text when it stays the same for 3 consecutive frames
    if (text === lastTextRef.current) {
      stableCountRef.current += 1;
    } else {
      stableCountRef.current = 0;
      lastTextRef.current = text;
    }
  }, []);

  const handleCapture = useCallback(() => {
    const text = recognizedText.trim();
    if (!text) {
      Alert.alert(t('liveScanner.noTextDetected'), t('liveScanner.noTextDetectedDesc'));
      return;
    }
    if (onTextRecognized) {
      onTextRecognized(text);
    }
    navigation.goBack();
  }, [recognizedText, onTextRecognized, navigation]);

  // ─── Permission check ────────────────────────────────────
  if (!useCameraDevice || !OCRCamera) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Icon name="camera-off" size={48} color="#999" />
        <Text style={styles.errorText}>
          {t('liveScanner.visionNotAvailable')}
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>{t('liveScanner.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission.hasPermission) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Icon name="camera-lock" size={48} color="#999" />
        <Text style={styles.errorText}>{t('liveScanner.cameraPermissionRequired')}</Text>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.primary }]}
          onPress={async () => {
            const granted = await permission.requestPermission();
            if (!granted) {
              Alert.alert(t('common.permissionDenied'), t('common.cameraAccessRequired'));
            }
          }}>
          <Text style={[styles.backBtnText, { color: '#FFF' }]}>{t('liveScanner.grantPermission')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>{t('liveScanner.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.errorText}>{t('liveScanner.loadingCamera')}</Text>
      </View>
    );
  }

  const ocrOptions = {
    language: 'latin',
    frameSkipThreshold: 10,
    useLightweightMode: Platform.OS === 'android',
    ...(scanRegion ? { scanRegion } : {}),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <OCRCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        mode="recognize"
        options={ocrOptions}
        callback={handleCallback}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{screenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Scan guide box */}
      <View style={styles.scanGuideContainer}>
        <View style={styles.scanGuide}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.scanHint}>{t('liveScanner.positionText')}</Text>
      </View>

      {/* Bottom bar — recognized text preview + capture button */}
      <View style={styles.bottomBar}>
        {recognizedText ? (
          <View style={styles.textPreview}>
            <Text style={styles.textPreviewLabel}>{t('liveScanner.detectedText')}</Text>
            <Text style={styles.textPreviewContent} numberOfLines={4}>
              {recognizedText}
            </Text>
          </View>
        ) : (
          <View style={styles.textPreview}>
            <Text style={styles.textPreviewLabel}>{t('liveScanner.scanning')}</Text>
            <Text style={styles.textPreviewContent}>{t('liveScanner.pointCamera')}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.captureBtn, !recognizedText && styles.captureBtnDisabled]}
          onPress={handleCapture}
          disabled={!recognizedText}
          activeOpacity={0.7}>
          <Icon name="check-circle" size={22} color="#FFF" />
          <Text style={styles.captureBtnText}>{t('liveScanner.useThisText')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1, backgroundColor: '#000', justifyContent: 'center',
    alignItems: 'center', padding: 32,
  },
  errorText: {
    color: '#CCC', fontSize: 15, textAlign: 'center', marginTop: 16, lineHeight: 22,
  },
  backBtn: {
    marginTop: 20, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 10, borderWidth: 1, borderColor: '#555',
  },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#CCC' },

  // Top bar
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  // Scan guide
  scanGuideContainer: {
    position: 'absolute', top: '20%', left: '8%', right: '8%', bottom: '35%',
    justifyContent: 'center', alignItems: 'center',
  },
  scanGuide: {
    width: '100%', height: '100%',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12,
  },
  corner: {
    position: 'absolute', width: 24, height: 24,
    borderColor: theme.colors.primary, borderWidth: 3,
  },
  cornerTL: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
  cornerTR: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
  cornerBL: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
  scanHint: {
    position: 'absolute', bottom: -28, alignSelf: 'center',
    fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  textPreview: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  textPreviewLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.primary, marginBottom: 4 },
  textPreviewContent: { fontSize: 13, color: '#DDD', lineHeight: 19 },
  captureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  captureBtnDisabled: { backgroundColor: '#555' },
  captureBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});

export default LiveScannerScreen;
