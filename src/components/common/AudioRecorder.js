import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import theme from '../../constants/theme';

/**
 * Safely import expo-audio — may crash in Expo Go if native modules
 * aren't linked. We lazy-load to prevent top-level crashes.
 */
let useAudioRecorderHook = null;
let AudioModuleRef = null;
let AudioPlayerClass = null;
let audioAvailable = false;

try {
  const expoAudio = require('expo-audio');
  useAudioRecorderHook = expoAudio.useAudioRecorder;
  AudioModuleRef = expoAudio.AudioModule;
  AudioPlayerClass = expoAudio.AudioPlayer;
  audioAvailable = typeof useAudioRecorderHook === 'function';
} catch {
  // expo-audio not available
}

// ═══════════════════════════════════════════════════════════════
// Inner component — uses the useAudioRecorder hook.
// Only rendered when expo-audio is available.
// ═══════════════════════════════════════════════════════════════
const AudioRecorderInner = forwardRef(({ parentType, parentId, recordings = [], onRecordingComplete, onRecordingDelete }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const timerRef = useRef(null);
  const durationRef = useRef(0);
  const audioRecorder = useAudioRecorderHook({
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  });
  const playerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playerRef.current) {
        try {
          if (playerRef.current._pollId) clearInterval(playerRef.current._pollId);
          playerRef.current.release();
        } catch {}
      }
    };
  }, []);

  // Keep durationRef in sync
  useEffect(() => { durationRef.current = recordingDuration; }, [recordingDuration]);

  const ensureDir = async () => {
    const dir = `${FileSystem.documentDirectory}${parentType}s/audio/${parentId}/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  };

  // ─── Core save logic (stop, move file, notify parent) ───
  const saveRecording = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await audioRecorder.stop();
      const sourceUri = audioRecorder.uri;
      if (!sourceUri) {
        Alert.alert('Error', 'No recording data found. Please try recording again.');
        setIsRecording(false);
        setRecordingDuration(0);
        return;
      }
      // Verify the temp file exists before moving
      const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
      if (!sourceInfo.exists) {
        Alert.alert('Error', 'Recording file not found at temporary location.');
        setIsRecording(false);
        setRecordingDuration(0);
        return;
      }
      const dir = await ensureDir();
      const filename = `recording_${Date.now()}.m4a`;
      const destPath = dir + filename;
      await FileSystem.moveAsync({ from: sourceUri, to: destPath });
      // Verify the file landed at destination
      const destInfo = await FileSystem.getInfoAsync(destPath);
      if (!destInfo.exists) {
        Alert.alert('Error', 'Failed to save recording file.');
        setIsRecording(false);
        setRecordingDuration(0);
        return;
      }
      const duration = durationRef.current;
      if (onRecordingComplete) {
        onRecordingComplete({ filePath: destPath, duration, parentType, parentId });
      }
    } catch (err) {
      Alert.alert('Save Error', 'Failed to save recording: ' + (err.message || 'Unknown error'));
    }
    setIsRecording(false);
    setRecordingDuration(0);
  }, [audioRecorder, parentType, parentId, onRecordingComplete]);

  // Expose saveIfRecording to parent forms via ref
  useImperativeHandle(ref, () => ({
    saveIfRecording: async () => {
      if (isRecording) await saveRecording();
    },
  }), [isRecording, saveRecording]);

  // ─── Recording Controls ──────────────────────────────
  const startRecording = async () => {
    try {
      const status = await AudioModuleRef.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission Required', 'Microphone permission is needed to record audio.');
        return;
      }
      audioRecorder.record();
      setIsRecording(true);
      setRecordingDuration(0);
      durationRef.current = 0;
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          durationRef.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording: ' + err.message);
    }
  };

  const pauseAndSave = async () => { await saveRecording(); };

  const discardRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try { await audioRecorder.stop(); } catch {}
    setIsRecording(false);
    setRecordingDuration(0);
  };

  // ─── Playback Controls ───────────────────────────────
  const playRecording = async (recording) => {
    try {
      await stopPlayback();
      if (!AudioPlayerClass) {
        Alert.alert('Error', 'Audio playback not available.');
        return;
      }
      // Verify file exists before attempting playback
      const fileInfo = await FileSystem.getInfoAsync(recording.filePath);
      if (!fileInfo.exists) {
        Alert.alert('File Not Found', 'The audio file no longer exists at:\n' + recording.filePath);
        return;
      }
      // expo-audio AudioPlayer requires a source URI string (file:// path)
      const player = new AudioPlayerClass({ uri: recording.filePath });
      playerRef.current = player;
      setPlayingId(recording.id);
      player.play();
      const pollId = setInterval(() => {
        try {
          if (player.playing) {
            const dur = player.duration || 1;
            setPlaybackProgress(player.currentTime / dur);
          } else if (!player.playing && player.currentTime > 0) {
            clearInterval(pollId);
            setPlayingId(null);
            setPlaybackProgress(0);
            try { player.release(); } catch {}
            playerRef.current = null;
          }
        } catch { clearInterval(pollId); }
      }, 250);
      player._pollId = pollId;
    } catch (err) {
      Alert.alert('Playback Error', 'Failed to play recording: ' + (err.message || 'Unknown error'));
    }
  };

  const stopPlayback = async () => {
    if (playerRef.current) {
      try {
        if (playerRef.current._pollId) clearInterval(playerRef.current._pollId);
        playerRef.current.release();
      } catch {}
      playerRef.current = null;
    }
    setPlayingId(null);
    setPlaybackProgress(0);
  };

  const deleteRecording = (recording) => {
    Alert.alert('Delete Recording', 'Are you sure you want to delete this recording?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await stopPlayback();
          try { await FileSystem.deleteAsync(recording.filePath, { idempotent: true }); } catch {}
          if (onRecordingDelete) onRecordingDelete(recording.id);
        },
      },
    ]);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ─── Render ──────────────────────────────────────────
  const renderRecordingItem = (item) => {
    const isPlaying = playingId === item.id;
    return (
      <View key={item.id} style={styles.recordingItem}>
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={() => isPlaying ? stopPlayback() : playRecording(item)}>
          <Icon name={isPlaying ? 'stop' : 'play'} size={18} color={isPlaying ? '#FFF' : theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName} numberOfLines={1}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
          <View style={styles.recordingMeta}>
            <Icon name="clock-outline" size={12} color={theme.colors.textLight} />
            <Text style={styles.recordingDurText}>{formatTime(item.duration || 0)}</Text>
          </View>
          {isPlaying && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${playbackProgress * 100}%` }]} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteRecording(item)}>
          <Icon name="trash-can-outline" size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsCard}>
        <View style={styles.controlsRow}>
          {!isRecording ? (
            <TouchableOpacity style={styles.recordBtn} onPress={startRecording} activeOpacity={0.7}>
              <Icon name="microphone" size={24} color="#FFF" />
              <Text style={styles.recordBtnText}>Record</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: '#E8F5E9' }]}
                onPress={pauseAndSave} activeOpacity={0.7}>
                <Icon name="content-save" size={20} color="#2E7D32" />
              </TouchableOpacity>
              <View style={styles.timerWrap}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
                <Text style={styles.recLabel}>RECORDING</Text>
              </View>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: '#FFEBEE' }]}
                onPress={() => {
                  Alert.alert('Discard?', 'Discard this recording?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: discardRecording },
                  ]);
                }}
                activeOpacity={0.7}>
                <Icon name="trash-can-outline" size={20} color="#D32F2F" />
              </TouchableOpacity>
            </>
          )}
        </View>
        {isRecording && (
          <Text style={styles.saveHint}>Tap the save icon to stop & save your recording</Text>
        )}
      </View>

      {recordings.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Recordings ({recordings.length})</Text>
          {recordings.map((item) => renderRecordingItem(item))}
        </View>
      )}
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════
// Wrapper: renders real recorder OR fallback, with proper ref
// ═══════════════════════════════════════════════════════════════
const AudioRecorder = forwardRef((props, ref) => {
  const innerRef = useRef(null);

  // Forward saveIfRecording to inner component, or no-op if unavailable
  useImperativeHandle(ref, () => ({
    saveIfRecording: async () => {
      if (innerRef.current && innerRef.current.saveIfRecording) {
        await innerRef.current.saveIfRecording();
      }
    },
  }));

  if (!audioAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackCard}>
          <Icon name="microphone-off" size={32} color={theme.colors.textLight} />
          <Text style={styles.fallbackTitle}>Audio Recording Unavailable</Text>
          <Text style={styles.fallbackText}>
            Audio recording requires a development build.{'\n'}
            It is not available in Expo Go.
          </Text>
        </View>
      </View>
    );
  }

  return <AudioRecorderInner ref={innerRef} {...props} />;
});

// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  controlsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  recordBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  timerWrap: { alignItems: 'center', minWidth: 80 },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
    marginBottom: 4,
  },
  timerText: { fontSize: 20, fontWeight: '700', color: theme.colors.text, fontVariant: ['tabular-nums'] },
  recLabel: { fontSize: 10, fontWeight: '700', color: '#D32F2F', marginTop: 2 },
  saveHint: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  listSection: { marginTop: 12 },
  listTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    gap: 10,
    ...theme.shadows.sm,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: { backgroundColor: theme.colors.primary },
  recordingInfo: { flex: 1 },
  recordingName: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  recordingMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  recordingDurText: { fontSize: 12, color: theme.colors.textLight },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: 2 },
  deleteBtn: { padding: 6 },
  fallbackCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    ...theme.shadows.sm,
  },
  fallbackTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginTop: 4 },
  fallbackText: { fontSize: 13, color: theme.colors.textLight, textAlign: 'center', lineHeight: 18 },
});

export default AudioRecorder;
