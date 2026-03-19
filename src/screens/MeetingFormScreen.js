import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import AudioRecorder from '../components/common/AudioRecorder';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { generateId } from '../utils/helpers';

// Module-level sub-component to prevent remount on parent re-render (keyboard fix)
const MeetingField = ({ label, icon, value, onChange, placeholder, multiline, keyboardType }) => (
  <View style={styles.fieldWrap}>
    <View style={styles.fieldLabel}>
      <Icon name={icon} size={16} color={theme.colors.textLight} />
      <Text style={styles.fieldLabelText}>{label}</Text>
    </View>
    <TextInput
      style={[styles.input, multiline && styles.inputMulti]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder || label}
      placeholderTextColor={theme.colors.textLight}
      multiline={multiline}
      numberOfLines={multiline ? 6 : 1}
      textAlignVertical={multiline ? 'top' : 'center'}
      keyboardType={keyboardType || 'default'}
    />
  </View>
);

const MeetingFormScreen = ({ route, navigation }) => {
  const { meeting, mode } = route.params || {};
  const isEdit = mode === 'edit' && meeting;

  // Generate a stable ID for new meetings so audio can be linked before save
  const [meetingId] = useState(() => isEdit ? meeting.id : generateId('meet'));
  const [meetingNumber, setMeetingNumber] = useState(meeting?.meeting_number || '');

  // Generate meeting number for new meetings
  useEffect(() => {
    if (!isEdit && !meetingNumber) {
      DatabaseService.generateNextMeetingNumber().then(setMeetingNumber).catch(() => {});
    }
  }, [isEdit, meetingNumber]);

  const [form, setForm] = useState({
    title: meeting?.title || '',
    event: meeting?.event || '',
    date: meeting?.date || new Date().toISOString().split('T')[0],
    location: meeting?.location || '',
    attendees: meeting?.attendees || '',
    notes: meeting?.notes || '',
    associatedLeads: meeting?.associatedLeads || [],
  });

  const isCreate = !isEdit;

  const [audioRecordings, setAudioRecordings] = useState([]);
  const [pendingAudio, setPendingAudio] = useState([]);
  const audioRef = useRef(null);
  const pendingAudioRef = useRef([]);
  const savedRef = useRef(false);

  // Load existing audio recordings for edit mode
  useEffect(() => {
    if (isEdit) {
      DatabaseService.getAudioRecordings('meeting', meetingId)
        .then(setAudioRecordings)
        .catch(() => {});
    }
  }, [isEdit, meetingId]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleRecordingComplete = useCallback(async (recording) => {
    if (isCreate) {
      // Defer DB insert — store in pending state, commit only on Save
      const tempId = 'pending_aud_' + Date.now();
      const entry = {
        id: tempId, filePath: recording.filePath, duration: recording.duration,
        createdAt: new Date().toISOString(),
      };
      pendingAudioRef.current = [entry, ...pendingAudioRef.current];
      setPendingAudio(prev => [entry, ...prev]);
    } else {
      // Edit mode: save immediately (meeting already exists)
      try {
        const id = await DatabaseService.insertAudioRecording({
          ...recording, parentType: 'meeting', parentId: meetingId,
        });
        setAudioRecordings(prev => [{
          id, filePath: recording.filePath, duration: recording.duration,
          createdAt: new Date().toISOString(),
        }, ...prev]);
      } catch (e) {
        Alert.alert('Error', 'Failed to save recording.');
      }
    }
  }, [meetingId, isCreate]);

  const handleRecordingDelete = useCallback(async (id) => {
    const isPending = typeof id === 'string' && id.startsWith('pending_');
    if (isPending) {
      const rec = pendingAudioRef.current.find(r => r.id === id);
      if (rec) {
        try {
          const FileSystem = require('expo-file-system/legacy');
          await FileSystem.deleteAsync(rec.filePath, { idempotent: true });
        } catch {}
      }
      pendingAudioRef.current = pendingAudioRef.current.filter(r => r.id !== id);
      setPendingAudio(prev => prev.filter(r => r.id !== id));
    } else {
      try {
        await DatabaseService.deleteAudioRecording(id);
        setAudioRecordings(prev => prev.filter(r => r.id !== id));
      } catch {}
    }
  }, []);

  // Cleanup temp audio when user exits without saving (new meetings only)
  useEffect(() => {
    if (!isCreate) return;
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (savedRef.current) return;
      const FileSystem = require('expo-file-system/legacy');
      pendingAudioRef.current.forEach(rec => {
        FileSystem.deleteAsync(rec.filePath, { idempotent: true }).catch(() => {});
      });
    });
    return unsubscribe;
  }, [isCreate, navigation]);

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a meeting title.');
      return;
    }
    // Auto-save any active recording before submitting
    if (audioRef.current) {
      await audioRef.current.saveIfRecording();
    }
    try {
      const FileSystem = require('expo-file-system/legacy');

      if (isEdit) {
        await DatabaseService.updateMeeting(meeting.id, form);
        Alert.alert('Updated', 'Meeting updated successfully.');
      } else {
        await DatabaseService.insertMeeting({ ...form, id: meetingId, meeting_number: meetingNumber });

        // Commit pending audio: move from cache → permanent + insert DB
        for (const rec of pendingAudioRef.current) {
          try {
            const permDir = `${FileSystem.documentDirectory}meetings/audio/${meetingId}/`;
            const permDirInfo = await FileSystem.getInfoAsync(permDir);
            if (!permDirInfo.exists) await FileSystem.makeDirectoryAsync(permDir, { intermediates: true });
            const filename = rec.filePath.split('/').pop();
            const permPath = permDir + filename;
            await FileSystem.moveAsync({ from: rec.filePath, to: permPath });
            await DatabaseService.insertAudioRecording({
              parentType: 'meeting', parentId: meetingId, filePath: permPath, duration: rec.duration,
            });
          } catch {}
        }

        Alert.alert('Saved', 'Meeting saved successfully!');
      }
      savedRef.current = true;
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [form, isEdit, meeting, meetingId, meetingNumber, navigation]);

  return (
    <View style={styles.container}>
      <Header
        title={isEdit ? 'Edit Meeting' : 'New Meeting'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {meetingNumber ? (
            <View style={styles.meetingNumberBadge}>
              <Icon name="pound-box" size={18} color={theme.colors.primary} />
              <Text style={styles.meetingNumberText}>{meetingNumber}</Text>
            </View>
          ) : null}
          <View style={styles.card}>
            <MeetingField label="Meeting Title *" icon="tag-text" value={form.title} onChange={v => set('title', v)} placeholder="e.g. BioFach 2025 Follow-up" />
            <MeetingField label="Event / Conference" icon="calendar-star" value={form.event} onChange={v => set('event', v)} />
            <MeetingField label="Date" icon="calendar" value={form.date} onChange={v => set('date', v)} />
            <MeetingField label="Location / City" icon="map-marker" value={form.location} onChange={v => set('location', v)} />
            <MeetingField label="Attendees" icon="account-multiple" value={form.attendees} onChange={v => set('attendees', v)} placeholder="Names of attendees..." />
          </View>

          <Text style={styles.notesLabel}>Meeting Notes</Text>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              value={form.notes}
              onChangeText={v => set('notes', v)}
              placeholder="Record key discussion points, action items, follow-ups..."
              placeholderTextColor={theme.colors.textLight}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          {/* Audio Recorder */}
          <Text style={styles.notesLabel}>Audio Notes</Text>
          <AudioRecorder
            ref={audioRef}
            parentType="meeting"
            parentId={meetingId}
            recordings={[...audioRecordings, ...pendingAudio]}
            onRecordingComplete={handleRecordingComplete}
            onRecordingDelete={handleRecordingDelete}
            tempMode={isCreate}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Icon name={isEdit ? 'content-save' : 'plus-circle'} size={22} color="#FFF" />
            <Text style={styles.saveBtnText}>{isEdit ? 'Update Meeting' : 'Save Meeting'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 40 },
  meetingNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: theme.colors.primary + '14',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  meetingNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  card: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 16, ...theme.shadows.sm },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: theme.colors.divider },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  fieldLabelText: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
  input: { fontSize: 15, color: theme.colors.text, paddingVertical: Platform.OS === 'ios' ? 4 : 2 },
  inputMulti: { minHeight: 80, paddingTop: 6 },
  notesLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  notesCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, ...theme.shadows.sm, marginBottom: 20 },
  notesInput: { fontSize: 15, color: theme.colors.text, minHeight: 180 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    marginTop: 12,
    ...theme.shadows.md,
  },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});

export default MeetingFormScreen;
