import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  Alert, Platform, KeyboardAvoidingView, Image,
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

// ─── Sub-components (module-level to prevent remount on parent re-render) ──
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Field = ({ label, icon, value, onChange, placeholder, keyboardType, multiline, readOnly }) => (
  <View style={styles.fieldWrap}>
    <View style={styles.fieldLabel}>
      <Icon name={icon} size={16} color={theme.colors.textLight} />
      <Text style={styles.fieldLabelText}>{label}</Text>
    </View>
    {readOnly ? (
      <Text style={[styles.input, styles.readOnlyText, multiline && styles.inputMulti]}>
        {value || '—'}
      </Text>
    ) : (
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
    )}
  </View>
);

const Picker = ({ label, options, value, onSelect, readOnly }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabelText}>{label}</Text>
    {readOnly ? (
      <Text style={[styles.input, styles.readOnlyText]}>{value || '—'}</Text>
    ) : (
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
    )}
  </View>
);

const MultiSelect = ({ label, options, selected, onToggle, readOnly }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabelText}>{label}</Text>
    {readOnly ? (
      <Text style={[styles.input, styles.readOnlyText]}>
        {selected.length > 0 ? selected.join(', ') : '—'}
      </Text>
    ) : (
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
    )}
  </View>
);

const LeadFormScreen = ({ route, navigation }) => {
  const { lead, mode } = route.params || {};
  const isCreate = mode === 'create' || !lead;
  const [isEditing, setIsEditing] = useState(isCreate || mode === 'edit');
  const readOnly = !isEditing;

  // Stable ID for new leads so audio/cards can be linked before save
  const [leadId] = useState(() => lead ? lead.id : generateId('lead'));
  const [leadNumber, setLeadNumber] = useState(lead?.lead_number || '');

  // Generate lead number for new leads
  useEffect(() => {
    if (isCreate && !leadNumber) {
      DatabaseService.generateNextLeadNumber().then(setLeadNumber).catch(() => {});
    }
  }, [isCreate, leadNumber]);

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
  const [capturedImages, setCapturedImages] = useState([]);

  // Pending media — temp storage for new leads, only committed on Save
  const [pendingImages, setPendingImages] = useState([]);
  const [pendingAudio, setPendingAudio] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const savedRef = useRef(false);
  const pendingImagesRef = useRef([]);
  const pendingAudioRef = useRef([]);
  const pendingCardsRef = useRef([]);

  // All product names for the Interested Product dropdown
  const allProducts = useMemo(() => PRODUCTS, []);
  const filteredProducts = useMemo(() => {
    if (!productSearch) return showAllProducts ? allProducts : allProducts.slice(0, 12);
    const q = productSearch.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || (p.activeIngredient || '').toLowerCase().includes(q)
    );
  }, [allProducts, productSearch, showAllProducts]);

  // Load existing audio + visiting cards + images when viewing/editing existing lead
  useEffect(() => {
    if (lead) {
      DatabaseService.getAudioRecordings('lead', leadId)
        .then(setAudioRecordings).catch(() => {});
      DatabaseService.getVisitingCards(leadId)
        .then(setVisitingCards).catch(() => {});
      DatabaseService.getImages('lead', leadId)
        .then(setCapturedImages).catch(() => {});
    }
  }, [lead, leadId]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleTag = (key, val) => {
    const cur = form[key];
    set(key, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  // ─── Camera image capture ──────────────────────────────────────
  const handleCaptureImage = useCallback(async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to capture images.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.85,
        allowsEditing: true,
      });
      if (result.canceled) return;

      const FileSystem = require('expo-file-system/legacy');
      const imageUri = result.assets[0].uri;
      // New leads: save to cache dir (temp); existing leads: save to permanent dir
      const baseDir = isCreate ? FileSystem.cacheDirectory : FileSystem.documentDirectory;
      const dir = `${baseDir}leads/images/${leadId}/`;
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const filename = `photo_${Date.now()}.jpg`;
      const destPath = dir + filename;
      await FileSystem.copyAsync({ from: imageUri, to: destPath });

      if (isCreate) {
        // Defer DB insert — add to pending state
        const tempId = 'pending_img_' + Date.now();
        const entry = { id: tempId, filePath: destPath, label: 'Lead Photo', createdAt: new Date().toISOString() };
        pendingImagesRef.current = [entry, ...pendingImagesRef.current];
        setPendingImages(prev => [entry, ...prev]);
      } else {
        const id = await DatabaseService.insertImage({
          entityType: 'lead', entityId: leadId, filePath: destPath, label: 'Lead Photo',
        });
        setCapturedImages(prev => [{ id, filePath: destPath, label: 'Lead Photo', createdAt: new Date().toISOString() }, ...prev]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to capture image: ' + (e.message || 'Unknown error'));
    }
  }, [leadId, isCreate]);

  const handleDeleteImage = useCallback(async (imageId, filePath) => {
    const isPending = typeof imageId === 'string' && imageId.startsWith('pending_');
    Alert.alert('Delete Photo', 'Remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const FileSystem = require('expo-file-system/legacy');
            await FileSystem.deleteAsync(filePath, { idempotent: true });
          } catch {}
          if (isPending) {
            pendingImagesRef.current = pendingImagesRef.current.filter(i => i.id !== imageId);
            setPendingImages(prev => prev.filter(i => i.id !== imageId));
          } else {
            try { await DatabaseService.deleteImage(imageId); } catch {}
            setCapturedImages(prev => prev.filter(i => i.id !== imageId));
          }
        },
      },
    ]);
  }, []);

  // ─── Audio handlers ──────────────────────────────────────────
  const handleRecordingComplete = useCallback(async (recording) => {
    if (isCreate) {
      // Defer DB insert — add to pending state
      const tempId = 'pending_aud_' + Date.now();
      const entry = {
        id: tempId, filePath: recording.filePath, duration: recording.duration,
        createdAt: new Date().toISOString(),
      };
      pendingAudioRef.current = [entry, ...pendingAudioRef.current];
      setPendingAudio(prev => [entry, ...prev]);
    } else {
      try {
        const id = await DatabaseService.insertAudioRecording({
          ...recording, parentType: 'lead', parentId: leadId,
        });
        setAudioRecordings(prev => [{
          id, filePath: recording.filePath, duration: recording.duration,
          createdAt: new Date().toISOString(),
        }, ...prev]);
      } catch { Alert.alert('Error', 'Failed to save recording.'); }
    }
  }, [leadId, isCreate]);

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

  // ─── Visiting card handlers ──────────────────────────────────
  const handleCardScanned = useCallback(async (cardData) => {
    if (isCreate) {
      // Defer DB insert — add to pending state
      const tempId = 'pending_card_' + Date.now();
      const entry = { id: tempId, ...cardData, createdAt: new Date().toISOString() };
      pendingCardsRef.current = [entry, ...pendingCardsRef.current];
      setPendingCards(prev => [entry, ...prev]);
    } else {
      try {
        const id = await DatabaseService.insertVisitingCard({ ...cardData, leadId });
        setVisitingCards(prev => [{ id, ...cardData, createdAt: new Date().toISOString() }, ...prev]);
      } catch { Alert.alert('Error', 'Failed to save visiting card.'); }
    }
  }, [leadId, isCreate]);

  const handleCardDelete = useCallback(async (id) => {
    const isPending = typeof id === 'string' && id.startsWith('pending_');
    if (isPending) {
      const card = pendingCardsRef.current.find(c => c.id === id);
      if (card) {
        try {
          const FileSystem = require('expo-file-system/legacy');
          await FileSystem.deleteAsync(card.imagePath, { idempotent: true });
        } catch {}
      }
      pendingCardsRef.current = pendingCardsRef.current.filter(c => c.id !== id);
      setPendingCards(prev => prev.filter(c => c.id !== id));
    } else {
      try {
        await DatabaseService.deleteVisitingCard(id);
        setVisitingCards(prev => prev.filter(c => c.id !== id));
      } catch {}
    }
  }, []);

  const handleAutoFill = useCallback((fields) => {
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

  // ─── Cleanup temp media when user exits without saving (new leads) ──
  useEffect(() => {
    if (!isCreate) return;
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (savedRef.current) return;
      const FileSystem = require('expo-file-system/legacy');
      pendingImagesRef.current.forEach(img => {
        FileSystem.deleteAsync(img.filePath, { idempotent: true }).catch(() => {});
      });
      pendingAudioRef.current.forEach(rec => {
        FileSystem.deleteAsync(rec.filePath, { idempotent: true }).catch(() => {});
      });
      pendingCardsRef.current.forEach(card => {
        FileSystem.deleteAsync(card.imagePath, { idempotent: true }).catch(() => {});
      });
    });
    return unsubscribe;
  }, [isCreate, navigation]);

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
      const FileSystem = require('expo-file-system/legacy');

      if (!isCreate && lead) {
        await DatabaseService.updateLead(lead.id, form);
        Alert.alert('Updated', 'Lead updated successfully.');
        setIsEditing(false);
      } else {
        await DatabaseService.insertLead({ ...form, id: leadId, lead_number: leadNumber });

        // ── Commit pending images: move from cache → permanent + insert DB ──
        for (const img of pendingImagesRef.current) {
          try {
            const permDir = `${FileSystem.documentDirectory}leads/images/${leadId}/`;
            const permDirInfo = await FileSystem.getInfoAsync(permDir);
            if (!permDirInfo.exists) await FileSystem.makeDirectoryAsync(permDir, { intermediates: true });
            const filename = img.filePath.split('/').pop();
            const permPath = permDir + filename;
            await FileSystem.moveAsync({ from: img.filePath, to: permPath });
            await DatabaseService.insertImage({
              entityType: 'lead', entityId: leadId, filePath: permPath, label: img.label,
            });
          } catch {}
        }

        // ── Commit pending audio: move from cache → permanent + insert DB ──
        for (const rec of pendingAudioRef.current) {
          try {
            const permDir = `${FileSystem.documentDirectory}leads/audio/${leadId}/`;
            const permDirInfo = await FileSystem.getInfoAsync(permDir);
            if (!permDirInfo.exists) await FileSystem.makeDirectoryAsync(permDir, { intermediates: true });
            const filename = rec.filePath.split('/').pop();
            const permPath = permDir + filename;
            await FileSystem.moveAsync({ from: rec.filePath, to: permPath });
            await DatabaseService.insertAudioRecording({
              parentType: 'lead', parentId: leadId, filePath: permPath, duration: rec.duration,
            });
          } catch {}
        }

        // ── Commit pending visiting cards: move from cache → permanent + insert DB ──
        for (const card of pendingCardsRef.current) {
          try {
            const permDir = `${FileSystem.documentDirectory}leads/visiting_cards/${leadId}/`;
            const permDirInfo = await FileSystem.getInfoAsync(permDir);
            if (!permDirInfo.exists) await FileSystem.makeDirectoryAsync(permDir, { intermediates: true });
            const filename = card.imagePath.split('/').pop();
            const permPath = permDir + filename;
            await FileSystem.moveAsync({ from: card.imagePath, to: permPath });
            await DatabaseService.insertVisitingCard({
              leadId, imagePath: permPath, rawText: card.rawText || '',
              extractedName: card.extractedName || '', extractedCompany: card.extractedCompany || '',
              extractedJobTitle: card.extractedJobTitle || '', extractedPhone: card.extractedPhone || '',
              extractedEmail: card.extractedEmail || '', extractedWebsite: card.extractedWebsite || '',
              extractedAddress: card.extractedAddress || '',
            });
          } catch {}
        }

        savedRef.current = true;
        Alert.alert('Saved', 'Lead captured successfully!');
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save lead: ' + e.message);
    }
  }, [form, isCreate, lead, leadId, leadNumber, navigation]);

  return (
    <View style={styles.container}>
      <Header
        title={isCreate ? 'New Lead' : isEditing ? 'Edit Lead' : 'Lead Details'}
        subtitle={lead ? lead.name : 'Capture contact info'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Lead Number badge */}
          {leadNumber ? (
            <View style={styles.leadNumberBadge}>
              <Icon name="pound" size={18} color={theme.colors.primary} />
              <Text style={styles.leadNumberText}>{leadNumber}</Text>
            </View>
          ) : null}

          {/* Edit Lead button — visible only in view mode */}
          {readOnly && (
            <TouchableOpacity
              style={styles.editLeadBtn}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.85}>
              <Icon name="pencil-outline" size={20} color="#FFF" />
              <Text style={styles.editLeadBtnText}>Edit Lead</Text>
            </TouchableOpacity>
          )}

          {/* Visiting Card Scanner — only in edit/create mode */}
          {!readOnly && (
            <Section title="Visiting Card Scanner">
              <View style={styles.scannerWrap}>
                <VisitingCardScanner
                  leadId={leadId}
                  cards={[...visitingCards, ...pendingCards]}
                  onCardScanned={handleCardScanned}
                  onCardDelete={handleCardDelete}
                  onAutoFill={handleAutoFill}
                  tempMode={isCreate}
                  navigation={navigation}
                />
              </View>
            </Section>
          )}

          {/* Visiting cards — read-only gallery in view mode */}
          {readOnly && visitingCards.length > 0 && (
            <Section title="Visiting Cards">
              <View style={styles.scannerWrap}>
                <View style={styles.imageGrid}>
                  {visitingCards.map(card => (
                    <View key={card.id} style={styles.imageThumb}>
                      <Image source={{ uri: card.imagePath }} style={styles.thumbImage} />
                    </View>
                  ))}
                </View>
              </View>
            </Section>
          )}

          {/* Camera Image Capture / Photo gallery */}
          <Section title="Photos">
            <View style={styles.scannerWrap}>
              {!readOnly && (
                <>
                  <TouchableOpacity style={styles.captureBtn} onPress={handleCaptureImage} activeOpacity={0.7}>
                    <Icon name="camera" size={22} color="#FFF" />
                    <Text style={styles.captureBtnText}>Capture Photo</Text>
                  </TouchableOpacity>
                  {isCreate && pendingImages.length > 0 && (
                    <View style={styles.pendingHint}>
                      <Icon name="information-outline" size={14} color={theme.colors.secondary} />
                      <Text style={styles.pendingHintText}>
                        {pendingImages.length} photo{pendingImages.length !== 1 ? 's' : ''} — will be saved when you submit the lead
                      </Text>
                    </View>
                  )}
                </>
              )}
              {[...capturedImages, ...pendingImages].length > 0 && (
                <View style={styles.imageGrid}>
                  {[...capturedImages, ...pendingImages].map(img => (
                    <View key={img.id} style={styles.imageThumb}>
                      <Image source={{ uri: img.filePath }} style={styles.thumbImage} />
                      {!readOnly && (
                        <TouchableOpacity
                          style={styles.thumbDelete}
                          onPress={() => handleDeleteImage(img.id, img.filePath)}>
                          <Icon name="close-circle" size={20} color={theme.colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {readOnly && capturedImages.length === 0 && (
                <Text style={styles.readOnlyText}>No photos captured</Text>
              )}
            </View>
          </Section>

          <Section title="Contact Information">
            <Field label="Full Name *" icon="account" value={form.name} onChange={v => set('name', v)} placeholder="Contact name" readOnly={readOnly} />
            <Field label="Company" icon="office-building" value={form.company} onChange={v => set('company', v)} readOnly={readOnly} />
            <Field label="Country" icon="flag" value={form.country} onChange={v => set('country', v)} readOnly={readOnly} />
            <Field label="Phone" icon="phone" value={form.phone} onChange={v => set('phone', v)} keyboardType="phone-pad" readOnly={readOnly} />
            <Field label="Email" icon="email" value={form.email} onChange={v => set('email', v)} keyboardType="email-address" readOnly={readOnly} />
            <Field label="Website" icon="web" value={form.website} onChange={v => set('website', v)} keyboardType="url" readOnly={readOnly} />
          </Section>

          <Section title="Meeting Information">
            <Field label="Event / Show" icon="calendar-star" value={form.event} onChange={v => set('event', v)} readOnly={readOnly} />
            <Field label="Booth / Stand" icon="map-marker" value={form.booth} onChange={v => set('booth', v)} readOnly={readOnly} />
            <Field label="City" icon="city" value={form.city} onChange={v => set('city', v)} readOnly={readOnly} />
            <Field label="Country" icon="earth" value={form.meetingCountry} onChange={v => set('meetingCountry', v)} readOnly={readOnly} />
            <Field label="Date" icon="calendar" value={form.meetingDate} onChange={v => set('meetingDate', v)} readOnly={readOnly} />
          </Section>

          <Section title="Business Information">
            <Picker
              label="Partner Type"
              options={PARTNER_TYPES}
              value={form.partnerType}
              onSelect={v => set('partnerType', v)}
              readOnly={readOnly}
            />
            <Field label="Country of Operation" icon="earth" value={form.countryOfOperation} onChange={v => set('countryOfOperation', v)} readOnly={readOnly} />
            <Picker
              label="Estimated Purchase Volume"
              options={VOLUME_OPTIONS}
              value={form.estimatedVolume}
              onSelect={v => set('estimatedVolume', v)}
              readOnly={readOnly}
            />
          </Section>

          <Section title="Tags & Interests">
            <MultiSelect
              label="Interest Tags"
              options={INTEREST_TAGS}
              selected={form.interestTags}
              onToggle={val => toggleTag('interestTags', val)}
              readOnly={readOnly}
            />
            <MultiSelect
              label="Business Tags"
              options={BUSINESS_TAGS}
              selected={form.businessTags}
              onToggle={val => toggleTag('businessTags', val)}
              readOnly={readOnly}
            />
          </Section>

          {/* Enhanced Interested Products — full product database with search */}
          <Section title="Interested Products">
            <View style={styles.fieldWrap}>
              {readOnly ? (
                <Text style={[styles.input, styles.readOnlyText]}>
                  {form.interestedProducts.length > 0
                    ? allProducts.filter(p => form.interestedProducts.includes(p.id)).map(p => p.name).join(', ')
                    : '—'}
                </Text>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.browseProductsBtn}
                    onPress={() => navigation.navigate('Products')}
                    activeOpacity={0.7}>
                    <Icon name="package-variant" size={16} color={theme.colors.primary} />
                    <Text style={styles.browseProductsText}>Browse Full Product Catalog</Text>
                    <Icon name="chevron-right" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
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
                </>
              )}
            </View>
          </Section>

          {/* Notes with Audio Recorder */}
          <Section title="Notes">
            <Field label="Meeting Notes" icon="note-text" value={form.notes} onChange={v => set('notes', v)} placeholder="Add meeting notes..." multiline readOnly={readOnly} />
          </Section>

          <Text style={styles.audioLabel}>Voice Notes</Text>
          {readOnly ? (
            <View style={styles.readOnlyAudioList}>
              {audioRecordings.length > 0 ? audioRecordings.map(item => (
                <View key={item.id} style={styles.readOnlyAudioItem}>
                  <Icon name="microphone" size={16} color={theme.colors.primary} />
                  <Text style={styles.readOnlyAudioText}>
                    {new Date(item.createdAt).toLocaleString()} — {Math.floor((item.duration || 0) / 60).toString().padStart(2, '0')}:{((item.duration || 0) % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
              )) : (
                <Text style={styles.readOnlyText}>No voice notes recorded</Text>
              )}
            </View>
          ) : (
            <AudioRecorder
              ref={audioRef}
              parentType="lead"
              parentId={leadId}
              recordings={[...audioRecordings, ...pendingAudio]}
              onRecordingComplete={handleRecordingComplete}
              onRecordingDelete={handleRecordingDelete}
              tempMode={isCreate}
            />
          )}

          {/* Save button — only in edit/create mode */}
          {!readOnly && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Icon name={isCreate ? 'account-plus' : 'content-save'} size={22} color="#FFF" />
              <Text style={styles.saveBtnText}>{isCreate ? 'Save Lead' : 'Update Lead'}</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 40 },
  leadNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '14',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 6,
  },
  leadNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
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

  // Camera capture
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  captureBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  imageThumb: { width: 72, height: 72, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  thumbImage: { width: '100%', height: '100%' },
  thumbDelete: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FFF', borderRadius: 10 },

  // Pending media hint
  pendingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary + '12',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  pendingHintText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '500',
  },

  // Browse products button
  browseProductsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  browseProductsText: { flex: 1, fontSize: 13, color: theme.colors.primary, fontWeight: '600' },

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

  // View mode styles
  readOnlyText: {
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  editLeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    ...theme.shadows.md,
  },
  editLeadBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  readOnlyAudioList: { paddingHorizontal: 16, paddingBottom: 8 },
  readOnlyAudioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    gap: 10,
    ...theme.shadows.sm,
  },
  readOnlyAudioText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
});

export default LeadFormScreen;
