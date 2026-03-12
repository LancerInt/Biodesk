import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import AudioRecorder from '../components/common/AudioRecorder';
import VisitingCardScanner from '../components/common/VisitingCardScanner';
import theme from '../constants/theme';
import DatabaseService from '../database/DatabaseService';
import { PRODUCTS } from '../constants/productData';
import { generateId } from '../utils/helpers';

const PARTNER_TYPES = ['Distributor', 'Importer', 'Retailer', 'Farmer Group', 'Manufacturer', 'Private Label'];
const INTEREST_TAGS = ['Microbials', 'Azadirachtin', 'Spinosad', 'Biofertilizers', 'Bio Stimulants', 'All Products'];
const BUSINESS_TAGS = ['Bulk Buyer', 'Distributor', 'Private Label', 'Registration Inquiry', 'Trial Interest'];
const VOLUME_OPTIONS = ['< 1 ton', '1 – 5 tons', '5 – 20 tons', '20+ tons'];

const LeadFormScreen = ({ route, navigation }) => {
  const { lead, mode } = route.params || {};
  const isEdit = mode === 'edit' && lead;

  // Stable ID for new leads so audio/cards can be linked before save
  const [leadId] = useState(() => isEdit ? lead.id : generateId('lead'));

  const [form, setForm] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    country: lead?.country || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    website: lead?.website || '',
    event: lead?.event || '',
    booth: lead?.booth || '',
    city: lead?.city || '',
    meetingCountry: lead?.meetingCountry || '',
    meetingDate: lead?.meetingDate || new Date().toISOString().split('T')[0],
    interestedProducts: lead?.interestedProducts || [],
    partnerType: lead?.partnerType || '',
    interestTags: lead?.interestTags || [],
    businessTags: lead?.businessTags || [],
    countryOfOperation: lead?.countryOfOperation || '',
    estimatedVolume: lead?.estimatedVolume || '',
    notes: lead?.notes || '',
    visitingCardUri: lead?.visitingCardUri || '',
  });

  const [audioRecordings, setAudioRecordings] = useState([]);
  const audioRef = useRef(null);
  const [visitingCards, setVisitingCards] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);

  // All product names for the Interested Product dropdown
  const allProducts = useMemo(() => PRODUCTS, []);
  const filteredProducts = useMemo(() => {
    if (!productSearch) return showAllProducts ? allProducts : allProducts.slice(0, 12);
    const q = productSearch.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || (p.activeIngredient || '').toLowerCase().includes(q)
    );
  }, [allProducts, productSearch, showAllProducts]);

  // Load existing audio + visiting cards in edit mode
  useEffect(() => {
    if (isEdit) {
      DatabaseService.getAudioRecordings('lead', leadId)
        .then(setAudioRecordings).catch(() => {});
      DatabaseService.getVisitingCards(leadId)
        .then(setVisitingCards).catch(() => {});
    }
  }, [isEdit, leadId]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleTag = (key, val) => {
    const cur = form[key];
    set(key, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  // ─── Audio handlers ──────────────────────────────────────────
  const handleRecordingComplete = useCallback(async (recording) => {
    try {
      const id = await DatabaseService.insertAudioRecording({
        ...recording,
        parentType: 'lead',
        parentId: leadId,
      });
      setAudioRecordings(prev => [{
        id, filePath: recording.filePath, duration: recording.duration,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    } catch { Alert.alert('Error', 'Failed to save recording.'); }
  }, [leadId]);

  const handleRecordingDelete = useCallback(async (id) => {
    try {
      await DatabaseService.deleteAudioRecording(id);
      setAudioRecordings(prev => prev.filter(r => r.id !== id));
    } catch {}
  }, []);

  // ─── Visiting card handlers ──────────────────────────────────
  const handleCardScanned = useCallback(async (cardData) => {
    try {
      const id = await DatabaseService.insertVisitingCard({ ...cardData, leadId });
      setVisitingCards(prev => [{ id, ...cardData, createdAt: new Date().toISOString() }, ...prev]);
    } catch { Alert.alert('Error', 'Failed to save visiting card.'); }
  }, [leadId]);

  const handleCardDelete = useCallback(async (id) => {
    try {
      await DatabaseService.deleteVisitingCard(id);
      setVisitingCards(prev => prev.filter(c => c.id !== id));
    } catch {}
  }, []);

  const handleAutoFill = useCallback((fields) => {
    // Check if there's any actual data to fill
    const hasData = fields.name || fields.company || fields.phone || fields.email || fields.website;
    if (!hasData) {
      Alert.alert('No Data', 'No extracted data available to auto-fill. Please enter details manually in the card preview.');
      return;
    }

    let filledCount = 0;
    setForm(f => {
      const updates = {};
      if (fields.name && !f.name) { updates.name = fields.name; filledCount++; }
      if (fields.company && !f.company) { updates.company = fields.company; filledCount++; }
      if (fields.phone && !f.phone) { updates.phone = fields.phone; filledCount++; }
      if (fields.email && !f.email) { updates.email = fields.email; filledCount++; }
      if (fields.website && !f.website) { updates.website = fields.website; filledCount++; }
      return { ...f, ...updates };
    });

    if (filledCount > 0) {
      Alert.alert('Auto-Filled', 'Contact fields have been populated from the visiting card.');
    } else {
      Alert.alert('Already Filled', 'All contact fields already have values. Clear a field first to auto-fill it.');
    }
  }, []);

  // ─── Save ────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter the contact name.');
      return;
    }
    // Auto-save any active recording before submitting
    if (audioRef.current) {
      await audioRef.current.saveIfRecording();
    }
    try {
      if (isEdit) {
        await DatabaseService.updateLead(lead.id, form);
        Alert.alert('Updated', 'Lead updated successfully.');
      } else {
        await DatabaseService.insertLead({ ...form, id: leadId });
        Alert.alert('Saved', 'Lead captured successfully!');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save lead: ' + e.message);
    }
  }, [form, isEdit, lead, leadId, navigation]);

  // ─── Sub-components ──────────────────────────────────────────
  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const Field = ({ label, icon, value, onChange, placeholder, keyboardType, multiline }) => (
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
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  const Picker = ({ label, options, value, onSelect }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabelText}>{label}</Text>
      <View style={styles.pickerRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.optChip, value === opt && styles.optChipActive]}
            onPress={() => onSelect(value === opt ? '' : opt)}>
            <Text style={[styles.optText, value === opt && styles.optTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const MultiSelect = ({ label, options, selected, onToggle }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabelText}>{label}</Text>
      <View style={styles.pickerRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.optChip, selected.includes(opt) && styles.optChipActive]}
            onPress={() => onToggle(opt)}>
            {selected.includes(opt) && <Icon name="check" size={12} color="#FFF" />}
            <Text style={[styles.optText, selected.includes(opt) && styles.optTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={isEdit ? 'Edit Lead' : 'New Lead'}
        subtitle={isEdit ? lead.name : 'Capture contact info'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Visiting Card Scanner */}
          <Section title="Visiting Card Scanner">
            <View style={styles.scannerWrap}>
              <VisitingCardScanner
                leadId={leadId}
                cards={visitingCards}
                onCardScanned={handleCardScanned}
                onCardDelete={handleCardDelete}
                onAutoFill={handleAutoFill}
              />
            </View>
          </Section>

          <Section title="Contact Information">
            <Field label="Full Name *" icon="account" value={form.name} onChange={v => set('name', v)} placeholder="Contact name" />
            <Field label="Company" icon="office-building" value={form.company} onChange={v => set('company', v)} />
            <Field label="Country" icon="flag" value={form.country} onChange={v => set('country', v)} />
            <Field label="Phone" icon="phone" value={form.phone} onChange={v => set('phone', v)} keyboardType="phone-pad" />
            <Field label="Email" icon="email" value={form.email} onChange={v => set('email', v)} keyboardType="email-address" />
            <Field label="Website" icon="web" value={form.website} onChange={v => set('website', v)} keyboardType="url" />
          </Section>

          <Section title="Meeting Information">
            <Field label="Event / Show" icon="calendar-star" value={form.event} onChange={v => set('event', v)} />
            <Field label="Booth / Stand" icon="map-marker" value={form.booth} onChange={v => set('booth', v)} />
            <Field label="City" icon="city" value={form.city} onChange={v => set('city', v)} />
            <Field label="Country" icon="earth" value={form.meetingCountry} onChange={v => set('meetingCountry', v)} />
            <Field label="Date" icon="calendar" value={form.meetingDate} onChange={v => set('meetingDate', v)} />
          </Section>

          <Section title="Business Information">
            <Picker
              label="Partner Type"
              options={PARTNER_TYPES}
              value={form.partnerType}
              onSelect={v => set('partnerType', v)}
            />
            <Field label="Country of Operation" icon="earth" value={form.countryOfOperation} onChange={v => set('countryOfOperation', v)} />
            <Picker
              label="Estimated Purchase Volume"
              options={VOLUME_OPTIONS}
              value={form.estimatedVolume}
              onSelect={v => set('estimatedVolume', v)}
            />
          </Section>

          <Section title="Tags & Interests">
            <MultiSelect
              label="Interest Tags"
              options={INTEREST_TAGS}
              selected={form.interestTags}
              onToggle={val => toggleTag('interestTags', val)}
            />
            <MultiSelect
              label="Business Tags"
              options={BUSINESS_TAGS}
              selected={form.businessTags}
              onToggle={val => toggleTag('businessTags', val)}
            />
          </Section>

          {/* Enhanced Interested Products — full product database with search */}
          <Section title="Interested Products">
            <View style={styles.fieldWrap}>
              <View style={styles.productSearchWrap}>
                <Icon name="magnify" size={16} color={theme.colors.textLight} />
                <TextInput
                  style={styles.productSearchInput}
                  value={productSearch}
                  onChangeText={setProductSearch}
                  placeholder="Search products..."
                  placeholderTextColor={theme.colors.textLight}
                />
                {productSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setProductSearch('')}>
                    <Icon name="close-circle" size={16} color={theme.colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.pickerRow}>
                {filteredProducts.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.optChip, form.interestedProducts.includes(p.id) && styles.optChipActive]}
                    onPress={() => toggleTag('interestedProducts', p.id)}>
                    {form.interestedProducts.includes(p.id) && <Icon name="check" size={11} color="#FFF" />}
                    <Text style={[styles.optText, form.interestedProducts.includes(p.id) && styles.optTextActive]} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!productSearch && !showAllProducts && allProducts.length > 12 && (
                <TouchableOpacity style={styles.showAllBtn} onPress={() => setShowAllProducts(true)}>
                  <Text style={styles.showAllText}>Show all {allProducts.length} products</Text>
                  <Icon name="chevron-down" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
              {form.interestedProducts.length > 0 && (
                <Text style={styles.selectedCount}>
                  {form.interestedProducts.length} product{form.interestedProducts.length !== 1 ? 's' : ''} selected
                </Text>
              )}
            </View>
          </Section>

          {/* Notes with Audio Recorder */}
          <Section title="Notes">
            <Field label="Meeting Notes" icon="note-text" value={form.notes} onChange={v => set('notes', v)} placeholder="Add meeting notes..." multiline />
          </Section>

          <Text style={styles.audioLabel}>Voice Notes</Text>
          <AudioRecorder
            ref={audioRef}
            parentType="lead"
            parentId={leadId}
            recordings={audioRecordings}
            onRecordingComplete={handleRecordingComplete}
            onRecordingDelete={handleRecordingDelete}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Icon name={isEdit ? 'content-save' : 'account-plus'} size={22} color="#FFF" />
            <Text style={styles.saveBtnText}>{isEdit ? 'Update Lead' : 'Save Lead'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 40 },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: { backgroundColor: '#FFF', ...theme.shadows.sm },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: theme.colors.divider },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  fieldLabelText: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
  input: {
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  inputMulti: { minHeight: 100, paddingTop: 8 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  optChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 4,
  },
  optChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  optText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  optTextActive: { color: '#FFF', fontWeight: '600' },

  // Product search
  productSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  productSearchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 6,
    paddingVertical: 2,
  },
  showAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    gap: 4,
  },
  showAllText: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
  selectedCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },

  // Scanner wrap
  scannerWrap: { padding: 16 },

  // Audio label
  audioLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    margin: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    ...theme.shadows.md,
  },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});

export default LeadFormScreen;
