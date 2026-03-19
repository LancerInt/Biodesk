import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Dimensions, RefreshControl, Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import { StorageAccessFramework } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';

/**
 * Lazy-load expo-av to prevent crash when native module ExponentAV
 * isn't linked (e.g. stale prebuild or wrong Expo Go version).
 */
let AudioModule = null;
let avAvailable = false;
try {
  AudioModule = require('expo-av').Audio;
  avAvailable = !!AudioModule;
} catch {
  // expo-av native module not available
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const formatDuration = (secs) => {
  if (!secs || secs <= 0) return '00:00';
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const formatTime = (secs) => {
  if (!secs || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const MeetingAudioScreen = ({ navigation }) => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const soundRef = useRef(null);

  const loadRecordings = useCallback(async () => {
    setLoading(true);
    try {
      const [allAudio, allMeetings] = await Promise.all([
        DatabaseService.getAllAudioRecordings(),
        DatabaseService.getMeetings(),
      ]);

      const meetingMap = {};
      allMeetings.forEach(m => { meetingMap[m.id] = m; });

      const combined = [];
      for (const audio of allAudio) {
        if (audio.parentType !== 'meeting') continue;
        const info = await FileSystem.getInfoAsync(audio.filePath).catch(() => ({ exists: false }));
        if (!info.exists) continue;
        const meeting = meetingMap[audio.parentId];
        combined.push({
          ...audio,
          meetingTitle: meeting?.title || 'Unknown',
          eventName: meeting?.event || '',
          meetingId: audio.parentId,
        });
      }
      setRecordings(combined);
    } catch (e) {
      console.warn('MeetingAudio load error:', e);
    }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadRecordings();
    return () => unloadSound();
  }, [loadRecordings]));

  // Cleanup on unmount
  useEffect(() => {
    return () => { unloadSound(); };
  }, []);

  // ─── Unload current sound object ─────────────────────
  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {}
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
    setPlayingId(null);
    setIsPaused(false);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setTotalDuration(0);
  }, []);

  // ─── Playback status callback ────────────────────────
  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) return;

    const dur = (status.durationMillis || 1) / 1000;
    const cur = (status.positionMillis || 0) / 1000;
    setTotalDuration(dur);
    setCurrentTime(cur);
    setPlaybackProgress(dur > 0 ? cur / dur : 0);

    // Playback finished
    if (status.didJustFinish) {
      setPlayingId(null);
      setIsPaused(false);
      setPlaybackProgress(0);
      setCurrentTime(0);
      setTotalDuration(0);
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    }
  }, []);

  // ─── Stop playback ──────────────────────────────────
  const stopPlayback = useCallback(async () => {
    await unloadSound();
  }, [unloadSound]);

  // ─── Pause playback ─────────────────────────────────
  const pausePlayback = useCallback(async () => {
    if (soundRef.current && playingId) {
      try {
        await soundRef.current.pauseAsync();
        setIsPaused(true);
      } catch {}
    }
  }, [playingId]);

  // ─── Resume playback ───────────────────────────────
  const resumePlayback = useCallback(async () => {
    if (soundRef.current && playingId && isPaused) {
      try {
        await soundRef.current.playAsync();
        setIsPaused(false);
      } catch {}
    }
  }, [playingId, isPaused]);

  // ─── Play a recording ──────────────────────────────
  const playRecording = useCallback(async (item) => {
    try {
      // If same item is paused, resume
      if (playingId === item.id && isPaused) {
        await resumePlayback();
        return;
      }

      // Unload any currently playing sound
      await unloadSound();

      // Check expo-av availability
      if (!avAvailable) {
        Alert.alert(
          'Audio Unavailable',
          'Audio playback requires a development build.\n\nRun: npx expo prebuild && npx expo run:android'
        );
        return;
      }

      // Verify file exists
      if (!item.filePath) {
        Alert.alert('Error', 'Audio file path is missing.');
        return;
      }
      const fileInfo = await FileSystem.getInfoAsync(item.filePath);
      if (!fileInfo.exists) {
        Alert.alert('File Not Found', 'The audio file no longer exists.');
        return;
      }

      // Create and play sound using expo-av
      const { sound } = await AudioModule.Sound.createAsync(
        { uri: item.filePath },
        { shouldPlay: true, progressUpdateIntervalMillis: 200 },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setPlayingId(item.id);
      setIsPaused(false);
      setPlaybackProgress(0);
      setCurrentTime(0);
      setTotalDuration(item.duration || 0);
    } catch (err) {
      console.warn('Playback error:', err);
      Alert.alert('Playback Error', err.message || 'Failed to play audio.');
    }
  }, [unloadSound, playingId, isPaused, resumePlayback, onPlaybackStatusUpdate]);

  // ─── Navigate to meeting ─────────────────────────────
  const handleCardPress = useCallback(async (item) => {
    await stopPlayback();
    try {
      const meeting = await DatabaseService.getMeetingById(item.meetingId);
      if (meeting) {
        navigation.navigate('MeetingForm', { meeting, mode: 'edit' });
      }
    } catch {}
  }, [navigation, stopPlayback]);

  // ─── Delete single audio recording ─────────────────
  const deleteAudio = useCallback((item) => {
    Alert.alert(
      'Delete Recording',
      `Remove this audio from "${item.meetingTitle}"?\nThe meeting itself will NOT be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              if (playingId === item.id) await stopPlayback();
              await FileSystem.deleteAsync(item.filePath, { idempotent: true }).catch(() => {});
              await DatabaseService.deleteAudioRecording(item.id);
              loadRecordings();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete recording.');
            }
          },
        },
      ]
    );
  }, [playingId, stopPlayback, loadRecordings]);

  // ─── Download single audio file ────────────────────
  const downloadAudio = useCallback(async (item) => {
    try {
      const ext = (item.filePath || '').split('.').pop() || 'm4a';
      const safeName = (item.meetingTitle || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${safeName}_meeting_audio.${ext}`;
      const mime = ext === 'mp3' ? 'audio/mpeg' : ext === 'wav' ? 'audio/wav' : 'audio/mp4';

      try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) return;

        const newUri = await StorageAccessFramework.createFileAsync(
          permissions.directoryUri, fileName, mime
        );
        const content = await FileSystem.readAsStringAsync(item.filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(newUri, content, {
          encoding: FileSystem.EncodingType.Base64,
        });
        Alert.alert('Downloaded', `${fileName} saved to device.`);
      } catch (safErr) {
        const sharable = await Sharing.isAvailableAsync();
        if (sharable) {
          await Sharing.shareAsync(item.filePath, { mimeType: mime });
        } else {
          Alert.alert('Error', 'Unable to save file.');
        }
      }
    } catch (e) {
      Alert.alert('Download Failed', e.message || 'Unknown error');
    }
  }, []);

  // ─── Render card ───────────────────────────────────
  const renderCard = ({ item }) => {
    const isActive = playingId === item.id;
    const isItemPlaying = isActive && !isPaused;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardBody}
          activeOpacity={0.7}
          onPress={() => handleCardPress(item)}>
          {/* Left: play/pause circle */}
          <TouchableOpacity
            style={[styles.playCircle, isItemPlaying && styles.playCircleActive]}
            activeOpacity={0.7}
            onPress={() => {
              if (isItemPlaying) pausePlayback();
              else playRecording(item);
            }}>
            <Icon
              name={isItemPlaying ? 'pause' : 'play'}
              size={isTablet ? 28 : 24}
              color={isItemPlaying ? '#FFF' : theme.colors.secondary}
            />
          </TouchableOpacity>

          {/* Center: info */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>{item.meetingTitle}</Text>
            {item.eventName ? (
              <Text style={styles.cardEvent} numberOfLines={1}>{item.eventName}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Icon name="clock-outline" size={12} color={theme.colors.textLight} />
                <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
              </View>
              <View style={styles.metaChip}>
                <Icon name="calendar-outline" size={12} color={theme.colors.textLight} />
                <Text style={styles.metaText}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>

            {/* Playback controls & progress */}
            {isActive && (
              <View style={styles.playbackSection}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(playbackProgress * 100, 100)}%` }]} />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    activeOpacity={0.6}
                    onPress={() => isItemPlaying ? pausePlayback() : resumePlayback()}>
                    <Icon
                      name={isItemPlaying ? 'pause-circle' : 'play-circle'}
                      size={isTablet ? 36 : 32}
                      color={theme.colors.secondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    activeOpacity={0.6}
                    onPress={stopPlayback}>
                    <Icon
                      name="stop-circle"
                      size={isTablet ? 36 : 32}
                      color={theme.colors.error || '#D32F2F'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Right: download + delete + chevron */}
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.downloadBtn}
              activeOpacity={0.7}
              onPress={() => downloadAudio(item)}>
              <Icon name="download" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.7}
              onPress={() => deleteAudio(item)}>
              <Icon name="trash-can-outline" size={20} color={theme.colors.error || '#D32F2F'} />
            </TouchableOpacity>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Meeting Audio"
        subtitle={recordings.length + ' recordings'}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={recordings}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadRecordings}
            colors={[theme.colors.secondary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="microphone-off" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No Meeting Recordings</Text>
            <Text style={styles.emptyText}>
              Voice notes recorded during meetings will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: isTablet ? 24 : 16, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 18 : 14,
    gap: isTablet ? 16 : 12,
  },

  // Play button
  playCircle: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    backgroundColor: theme.colors.secondary + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircleActive: {
    backgroundColor: theme.colors.secondary,
  },

  // Info
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardEvent: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginTop: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },

  // Playback section
  playbackSection: {
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textLight,
    fontVariant: ['tabular-nums'],
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
  },
  controlBtn: {
    padding: 2,
  },
  rightActions: {
    alignItems: 'center',
    gap: 10,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.secondary + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: (theme.colors.error || '#D32F2F') + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MeetingAudioScreen;
