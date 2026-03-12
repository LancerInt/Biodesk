import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import AudioRecorder from '../components/common/AudioRecorder';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { generateId } from '../utils/helpers';

const MeetingFormScreen = ({ route, navigation }) => {
  const { meeting, mode } = route.params || {};
  const isEdit = mode === 'edit' && meeting;

  // Generate a stable ID for new meetings so audio can be linked before save
  const [meetingId] = useState(() => isEdit ? meeting.id : generateId('meet'));

  const [form, setForm] = useState({
    title: meeting?.title || '',
    event: meeting?.event || '',
    date: meeting?.date || new Date().toISOString().split('T')[0],
    location: meeting?.location || '',
    attendees: meeting?.attendees || '',
    notes: meeting?.notes || '',
    associatedLeads: meeting?.associatedLeads || [],
  });

  const [audioRecordings, setAudioRecordings] = useState([]);
  const audioRef = useRef(null);

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
    try {
      const id = await DatabaseService.insertAudioRecording({
        ...recording,
        parentType: 'meeting',
        parentId: meetingId,
      });
      setAudioRecordings(prev => [{
        id,
        filePath: recording.filePath,
        duration: recording.duration,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save recording.');
    }
  }, [meetingId]);

  const handleRecordingDelete = useCallback(async (id) => {
    try {
      await DatabaseService.deleteAudioRecording(id);
      setAudioRecordings(prev => prev.filter(r => r.id !== id));
    } catch {}
  }, []);

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
      if (isEdit) {
        await DatabaseService.updateMeeting(meeting.id, form);
        Alert.alert('Updated', 'Meeting updated successfully.');
      } else {
        await DatabaseService.insertMeeting({ ...form, id: meetingId });
        Alert.alert('Saved', 'Meeting saved successfully!');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [form, isEdit, meeting, meetingId, navigation]);

  const Field = ({ label, icon, value, onChange, placeholder, multiline, keyboardType }) => (
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

  return (
    <View style={styles.container}>
      <Header
        title={isEdit ? 'Edit Meeting' : 'New Meeting'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Field label="Meeting Title *" icon="tag-text" value={form.title} onChange={v => set('title', v)} placeholder="e.g. BioFach 2025 Follow-up" />
            <Field label="Event / Conference" icon="calendar-star" value={form.event} onChange={v => set('event', v)} />
            <Field label="Date" icon="calendar" value={form.date} onChange={v => set('date', v)} />
            <Field label="Location / City" icon="map-marker" value={form.location} onChange={v => set('location', v)} />
            <Field label="Attendees" icon="account-multiple" value={form.attendees} onChange={v => set('attendees', v)} placeholder="Names of attendees..." />
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
            recordings={audioRecordings}
            onRecordingComplete={handleRecordingComplete}
            onRecordingDelete={handleRecordingDelete}
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
