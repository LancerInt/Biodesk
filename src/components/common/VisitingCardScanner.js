import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Image,
  TextInput, ActivityIndicator, ScrollView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import theme from '../../constants/theme';
import { isOCRAvailable, recognizeTextFromImage } from '../../utils/ocrService';

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE-BASED BUSINESS CARD PARSER
//  Works on unstructured, label-free visiting card text.
// ═══════════════════════════════════════════════════════════════

/**
 * Master extraction function.
 * Strategy:
 *  1. First pass — extract high-confidence fields (email, phone, website)
 *     using unambiguous regex patterns.
 *  2. Second pass — extract company name using keyword/suffix matching.
 *  3. Third pass — extract designation using title keyword matching.
 *  4. Fourth pass — extract address using postal/city/state patterns.
 *  5. Fifth pass — infer person name from remaining unused lines,
 *     preferring lines near the top, with name-like characteristics.
 */
const parseBusinessCard = (rawText) => {
  if (!rawText || !rawText.trim()) return {};

  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const result = {
    name: '',
    company: '',
    jobTitle: '',
    phone: '',
    email: '',
    website: '',
    address: '',
  };

  // Track which lines have been consumed
  const usedLines = new Set();

  // ─── PASS 1: Email (highest confidence — @ symbol) ──────────
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(emailRegex);
    if (match) {
      result.email = match[0].toLowerCase();
      usedLines.add(i);
      break;
    }
  }

  // ─── PASS 2: Website (domain patterns, exclude email) ──────
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?/i;
  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    const line = lines[i];
    // Skip if line is just an email
    if (emailRegex.test(line) && !line.replace(emailRegex, '').trim()) continue;
    const match = line.match(websiteRegex);
    if (match && !match[0].includes('@')) {
      // Verify it looks like a real domain
      const domain = match[0].toLowerCase();
      if (/\.(com|org|net|in|co|io|biz|info|gov|edu|tech|co\.in|org\.in)/.test(domain)) {
        result.website = domain.replace(/^https?:\/\//, '');
        usedLines.add(i);
        break;
      }
    }
  }

  // ─── PASS 3: Phone numbers ────────────────────────────────
  // Indian phones: +91 XXXXX XXXXX, 0XXXX-XXXXXX, etc.
  // International: +XX XXXX XXXXXXX, with optional dashes/dots/spaces
  const phonePatterns = [
    /(?:\+91[\s\-.]?)?\d{5}[\s\-.]?\d{5}/,           // +91 73976 67074
    /(?:\+\d{1,3}[\s\-.]?)?\(?\d{2,5}\)?[\s\-.]?\d{3,5}[\s\-.]?\d{3,5}/, // general intl
    /\b0\d{2,4}[\s\-.]?\d{6,8}\b/,                    // 044-12345678 (landline)
    /\b\d{10,13}\b/,                                   // plain 10+ digits
  ];

  // Collect ALL phone numbers (some cards have multiple: mobile + office + fax)
  const phoneNumbers = [];
  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    const line = lines[i];
    // Remove common prefixes like "Ph:", "Tel:", "M:", "Mob:", "Fax:", etc.
    const cleaned = line.replace(/^(?:ph|tel|telephone|mob|mobile|cell|fax|office|direct|t|m|f|p)\s*[:.\-]\s*/i, '');

    for (const pattern of phonePatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const digits = match[0].replace(/\D/g, '');
        if (digits.length >= 7 && digits.length <= 15) {
          phoneNumbers.push({ line: i, number: match[0].trim(), digits });
          break;
        }
      }
    }
  }

  // Prefer mobile numbers (10-digit Indian or +91 prefixed)
  if (phoneNumbers.length > 0) {
    const mobile = phoneNumbers.find(p => p.digits.length === 10 || p.digits.startsWith('91'));
    const chosen = mobile || phoneNumbers[0];
    result.phone = chosen.number;
    usedLines.add(chosen.line);
    // Mark other phone lines as used too (don't let them become name/company)
    phoneNumbers.forEach(p => usedLines.add(p.line));
  }

  // ─── PASS 4: Company name (keyword/suffix matching) ────────
  const companyPatterns = [
    /\b(?:Pvt\.?\s*Ltd\.?|Private\s+Limited|Ltd\.?|Limited|LLC|LLP|Inc\.?|Corp\.?|Corporation)\b/i,
    /\b(?:Group|Enterprises|Industries|Technologies|Solutions|Services|Systems)\b/i,
    /\b(?:Chemicals|Pharma|Pharmaceuticals|Biochem|Biotech|Biotechnology)\b/i,
    /\b(?:International|Global|India|Trading|Exports?|Imports?|Manufacturing)\b/i,
    /\b(?:Company|Co\.?|Associates|Consultants|Agencies|Ventures)\b/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    for (const pattern of companyPatterns) {
      if (pattern.test(lines[i])) {
        result.company = lines[i];
        usedLines.add(i);
        break;
      }
    }
    if (result.company) break;
  }

  // ─── PASS 5: Designation / Job Title ───────────────────────
  const titlePatterns = [
    // C-suite
    /\b(?:CEO|CTO|CFO|COO|CIO|CMO|CXO|Chairman|Chairperson)\b/i,
    // Directors & VPs
    /\b(?:Director|Managing\s+Director|VP|Vice[\s\-]?President|President)\b/i,
    // Manager-level
    /\b(?:General\s+Manager|Manager|Asst\.?\s+Manager|Deputy\s+Manager|Sr\.?\s+Manager)\b/i,
    /\b(?:Marketing\s+Manager|Sales\s+Manager|Business\s+Development|Area\s+Manager|Regional\s+Manager)\b/i,
    /\b(?:Product\s+Manager|Project\s+Manager|Operations\s+Manager|Account\s+Manager)\b/i,
    // Head/Lead
    /\b(?:Head|Team\s+Lead|Lead|Principal|Chief)\b/i,
    // Roles
    /\b(?:Executive|Officer|Coordinator|Specialist|Analyst|Advisor|Consultant)\b/i,
    /\b(?:Engineer|Developer|Designer|Architect|Scientist|Researcher)\b/i,
    // Proprietor, Partner, Founder
    /\b(?:Proprietor|Partner|Founder|Co[\s\-]?Founder|Owner)\b/i,
    // Sales-related
    /\b(?:Sales\s+Head|Sales\s+Executive|Sales\s+Officer|Marketing\s+Executive)\b/i,
    /\b(?:Techno[\s\-]?Commercial|Technical\s+Manager|Quality|R\s*&\s*D)\b/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    // Skip lines that are too long (likely addresses, not titles)
    if (lines[i].length > 60) continue;
    for (const pattern of titlePatterns) {
      if (pattern.test(lines[i])) {
        result.jobTitle = lines[i];
        usedLines.add(i);
        break;
      }
    }
    if (result.jobTitle) break;
  }

  // ─── PASS 6: Address (postal codes, state names, city names) ─
  const addressIndicators = [
    /\b\d{6}\b/,  // Indian PIN code (6 digits)
    /\b\d{5}(?:\-\d{4})?\b/, // US ZIP code
    // Indian states
    /\b(?:Tamil\s*Nadu|Karnataka|Maharashtra|Kerala|Andhra\s*Pradesh|Telangana|Gujarat|Rajasthan|Punjab|Haryana|Uttar\s*Pradesh|Madhya\s*Pradesh|West\s*Bengal|Bihar|Odisha|Assam|Chhattisgarh|Jharkhand|Uttarakhand|Himachal\s*Pradesh|Goa|Tripura|Meghalaya|Manipur|Mizoram|Arunachal\s*Pradesh|Nagaland|Sikkim)\b/i,
    // Common address words
    /\b(?:Street|St\.|Road|Rd\.|Avenue|Ave\.|Lane|Nagar|Colony|Layout|Phase|Sector|Block|Plot|Floor|Tower|Building|Bldg|Complex|Apartment|Apt|Industrial\s+Area|Estate|Junction|Main\s+Road|Cross)\b/i,
    // Cities
    /\b(?:Chennai|Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Kolkata|Pune|Ahmedabad|Salem|Coimbatore|Madurai|Trichy|Thane|Noida|Gurgaon|Gurugram|Jaipur|Lucknow|Indore|Bhopal|Surat|Vadodara|Nagpur|Visakhapatnam|Kochi|Trivandrum|Mysore|Mangalore|Nashik|Aurangabad)\b/i,
    // Country
    /\b(?:India|USA|UK|Singapore|Dubai|UAE|Germany|China|Bangladesh|Sri\s+Lanka|Nepal)\b/i,
  ];

  const addressLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    const line = lines[i];
    // Check if line contains address indicators
    const isAddress = addressIndicators.some(pattern => pattern.test(line));
    // Also consider: line has a mix of numbers and text, length > 10 (street address pattern)
    const hasStreetPattern = /\d+[\/\-]?\d*[\s,]/.test(line) && /[a-zA-Z]/.test(line) && line.length > 10;

    if (isAddress || hasStreetPattern) {
      addressLines.push(line);
      usedLines.add(i);
    }
  }
  result.address = addressLines.join(', ');

  // ─── PASS 7: Person Name (infer from remaining lines) ─────
  // Strategy: Look at unused lines, prefer lines near the top,
  // that consist of alphabetic words (2-5 words), no special patterns.
  const nameCandidate = [];
  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    const line = lines[i];
    // Skip very short or very long lines
    if (line.length < 2 || line.length > 40) continue;
    // Skip lines that are mostly digits
    if (/^\d+$/.test(line.replace(/\s/g, ''))) continue;
    // Skip lines with @ or www
    if (/@|www\.|\.com|\.in|\.org/.test(line.toLowerCase())) continue;
    // A person's name: mostly alphabetic with dots/spaces, 1-5 words
    // Allow initials like "S." or "K.V."
    if (/^[A-Za-z\s.'''\-]{2,40}$/.test(line)) {
      const words = line.split(/\s+/).filter(w => w.length > 0);
      if (words.length >= 1 && words.length <= 5) {
        nameCandidate.push({ index: i, line, words: words.length });
      }
    }
  }

  if (nameCandidate.length > 0) {
    // Heuristic: prefer the candidate that appears earliest (top of card = name)
    // If the first candidate is on line 0-2, strongly prefer it.
    // Among equals, prefer 2-3 word candidates (more name-like).
    let best = nameCandidate[0];
    for (const c of nameCandidate) {
      // Prefer earlier lines
      if (c.index < best.index) {
        best = c;
      } else if (c.index === best.index && c.words >= 2 && c.words <= 3) {
        best = c;
      }
    }
    result.name = best.line;
    usedLines.add(best.index);
  }

  // ─── Fallback: If company not found, check if there's a line ─
  // near the email domain that matches
  if (!result.company && result.email) {
    const emailDomain = result.email.split('@')[1]?.split('.')[0];
    if (emailDomain && emailDomain.length > 2) {
      for (let i = 0; i < lines.length; i++) {
        if (usedLines.has(i)) continue;
        if (lines[i].toLowerCase().includes(emailDomain.toLowerCase())) {
          result.company = lines[i];
          usedLines.add(i);
          break;
        }
      }
    }
  }

  // ─── Fallback: If name not found, use first unused alphabetic line ─
  if (!result.name) {
    for (let i = 0; i < lines.length; i++) {
      if (usedLines.has(i)) continue;
      if (/[a-zA-Z]/.test(lines[i]) && lines[i].length > 2 && lines[i].length < 40) {
        result.name = lines[i];
        usedLines.add(i);
        break;
      }
    }
  }

  return result;
};

// ═══════════════════════════════════════════════════════════════
//  VISITING CARD SCANNER COMPONENT
// ═══════════════════════════════════════════════════════════════
const VisitingCardScanner = ({ leadId, cards = [], onCardScanned, onCardDelete, onAutoFill, tempMode, navigation }) => {
  const [processing, setProcessing] = useState(false);
  const [previewCard, setPreviewCard] = useState(null);
  const [editFields, setEditFields] = useState(null);

  const ensureDir = async () => {
    const baseDir = tempMode ? FileSystem.cacheDirectory : FileSystem.documentDirectory;
    const dir = `${baseDir}leads/visiting_cards/${leadId}/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  };

  // ─── Image Capture ───────────────────────────────────────
  const captureCard = async (useCamera) => {
    try {
      let result;
      if (useCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission Required', 'Camera permission is needed.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.85,
          allowsEditing: true,
        });
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission Required', 'Gallery permission is needed.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.85,
          allowsEditing: true,
        });
      }

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const imageUri = result.assets[0].uri;
      setProcessing(true);

      // Save image to structured path
      const dir = await ensureDir();
      const filename = `card_${Date.now()}.jpg`;
      const destPath = dir + filename;
      await FileSystem.copyAsync({ from: imageUri, to: destPath });

      // Run OCR if available
      let extracted = {};
      let rawText = '';

      if (isOCRAvailable()) {
        try {
          const ocrResult = await recognizeTextFromImage(destPath);
          rawText = ocrResult.text || '';
          extracted = parseBusinessCard(rawText);
        } catch (ocrErr) {
          console.warn('OCR failed:', ocrErr);
          rawText = '';
          extracted = {};
        }
      }

      const cardData = {
        imagePath: destPath,
        leadId,
        rawText,
        extractedName: extracted.name || '',
        extractedCompany: extracted.company || '',
        extractedJobTitle: extracted.jobTitle || '',
        extractedPhone: extracted.phone || '',
        extractedEmail: extracted.email || '',
        extractedWebsite: extracted.website || '',
        extractedAddress: extracted.address || '',
      };

      setPreviewCard(cardData);
      setEditFields({ ...cardData });
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      Alert.alert('Error', 'Failed to process visiting card: ' + err.message);
    }
  };

  // ─── Confirm / Save scanned card ─────────────────────────
  const confirmCard = (shouldAutoFill = true) => {
    if (!editFields) return;
    const finalCard = { ...editFields };
    if (onCardScanned) onCardScanned(finalCard);
    if (shouldAutoFill && onAutoFill) {
      // Only auto-fill if there's at least one non-empty extracted field
      const hasData = finalCard.extractedName || finalCard.extractedCompany ||
        finalCard.extractedPhone || finalCard.extractedEmail || finalCard.extractedWebsite;
      if (hasData) {
        onAutoFill({
          name: finalCard.extractedName,
          company: finalCard.extractedCompany,
          phone: finalCard.extractedPhone,
          email: finalCard.extractedEmail,
          website: finalCard.extractedWebsite,
        });
      }
    }
    setPreviewCard(null);
    setEditFields(null);
  };

  const cancelPreview = () => {
    setPreviewCard(null);
    setEditFields(null);
  };

  const setField = (key, value) => setEditFields(prev => ({ ...prev, [key]: value }));

  // ─── Delete Card ──────────────────────────────────────────
  const handleDelete = (card) => {
    Alert.alert('Delete Card', 'Remove this visiting card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try { await FileSystem.deleteAsync(card.imagePath, { idempotent: true }); } catch {}
          if (onCardDelete) onCardDelete(card.id);
        },
      },
    ]);
  };

  // ─── Re-extract: re-run parsing on a saved card ──────────
  const reExtract = (card) => {
    if (!card.rawText) {
      Alert.alert('No OCR Data', 'This card has no OCR text to re-extract from.');
      return;
    }
    const extracted = parseBusinessCard(card.rawText);
    const updatedFields = {
      ...card,
      extractedName: extracted.name || card.extractedName || '',
      extractedCompany: extracted.company || card.extractedCompany || '',
      extractedJobTitle: extracted.jobTitle || card.extractedJobTitle || '',
      extractedPhone: extracted.phone || card.extractedPhone || '',
      extractedEmail: extracted.email || card.extractedEmail || '',
      extractedWebsite: extracted.website || card.extractedWebsite || '',
      extractedAddress: extracted.address || card.extractedAddress || '',
    };
    setPreviewCard(updatedFields);
    setEditFields({ ...updatedFields });
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER: Preview / Edit Mode
  // ═══════════════════════════════════════════════════════════
  if (previewCard && editFields) {
    const hasAnyExtracted = editFields.extractedName || editFields.extractedCompany ||
      editFields.extractedPhone || editFields.extractedEmail || editFields.extractedWebsite;

    return (
      <View style={styles.container}>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>
            {hasAnyExtracted ? 'Review Extracted Data' : 'Enter Card Details'}
          </Text>

          {/* Card image preview */}
          <Image source={{ uri: previewCard.imagePath }} style={styles.previewImage} resizeMode="contain" />

          {/* Manual entry notice when OCR is unavailable or returned nothing */}
          {(!isOCRAvailable() || !editFields.rawText) && (
            <View style={styles.manualNotice}>
              <Icon name="pencil-box-outline" size={18} color="#F57C00" />
              <Text style={styles.manualNoticeText}>
                {!isOCRAvailable()
                  ? 'OCR is not available in Expo Go. Please type the details from the card image above into the fields below, then tap "Save & Auto-Fill".'
                  : 'OCR could not detect text from this image. Please enter the details manually below.'
                }
              </Text>
            </View>
          )}

          {/* Raw OCR text display — only when OCR returned data */}
          {editFields.rawText ? (
            <View style={styles.rawTextCard}>
              <View style={styles.rawTextHeader}>
                <Icon name="text-recognition" size={14} color={theme.colors.primary} />
                <Text style={styles.rawTextLabel}>Detected Text</Text>
              </View>
              <Text style={styles.rawTextContent} selectable>{editFields.rawText}</Text>
            </View>
          ) : null}

          {/* Editable fields */}
          <ExtractField label="Person Name" icon="account" value={editFields.extractedName} onChange={v => setField('extractedName', v)} />
          <ExtractField label="Company" icon="office-building" value={editFields.extractedCompany} onChange={v => setField('extractedCompany', v)} />
          <ExtractField label="Job Title" icon="badge-account" value={editFields.extractedJobTitle} onChange={v => setField('extractedJobTitle', v)} />
          <ExtractField label="Phone" icon="phone" value={editFields.extractedPhone} onChange={v => setField('extractedPhone', v)} keyboardType="phone-pad" />
          <ExtractField label="Email" icon="email" value={editFields.extractedEmail} onChange={v => setField('extractedEmail', v)} keyboardType="email-address" />
          <ExtractField label="Website" icon="web" value={editFields.extractedWebsite} onChange={v => setField('extractedWebsite', v)} />
          <ExtractField label="Address" icon="map-marker" value={editFields.extractedAddress} onChange={v => setField('extractedAddress', v)} multiline />

          {/* Action buttons */}
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelPreview}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmCard(true)}>
              <Icon name="check" size={18} color="#FFF" />
              <Text style={styles.confirmBtnText}>Save & Auto-Fill</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  RENDER: Default Mode — capture buttons + saved cards list
  // ═══════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      {/* Capture Buttons */}
      <View style={styles.captureRow}>
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={() => captureCard(true)}
          disabled={processing}
          activeOpacity={0.7}>
          <Icon name="camera" size={22} color={theme.colors.primary} />
          <Text style={styles.captureBtnText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={() => captureCard(false)}
          disabled={processing}
          activeOpacity={0.7}>
          <Icon name="image-multiple" size={22} color={theme.colors.primary} />
          <Text style={styles.captureBtnText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Live Scan Button */}
      {navigation && isOCRAvailable() && (
        <TouchableOpacity
          style={styles.liveScanBtn}
          onPress={() => {
            navigation.navigate('LiveScanner', {
              title: 'Scan Visiting Card',
              onTextRecognized: (text) => {
                const extracted = parseBusinessCard(text);
                const cardData = {
                  imagePath: '',
                  leadId,
                  rawText: text,
                  extractedName: extracted.name || '',
                  extractedCompany: extracted.company || '',
                  extractedJobTitle: extracted.jobTitle || '',
                  extractedPhone: extracted.phone || '',
                  extractedEmail: extracted.email || '',
                  extractedWebsite: extracted.website || '',
                  extractedAddress: extracted.address || '',
                };
                setPreviewCard(cardData);
                setEditFields({ ...cardData });
              },
            });
          }}
          disabled={processing}
          activeOpacity={0.7}>
          <Icon name="text-recognition" size={20} color="#FFF" />
          <Text style={styles.liveScanBtnText}>Live Scan</Text>
          <Text style={styles.liveScanBtnHint}>Real-time OCR</Text>
        </TouchableOpacity>
      )}

      {/* Processing indicator */}
      {processing && (
        <View style={styles.processingWrap}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.processingText}>Processing card...</Text>
        </View>
      )}

      {/* OCR status */}
      <View style={styles.ocrStatusRow}>
        <Icon
          name={isOCRAvailable() ? 'check-circle' : 'alert-circle-outline'}
          size={14}
          color={isOCRAvailable() ? '#2E7D32' : '#F57C00'}
        />
        <Text style={[styles.ocrStatusText, { color: isOCRAvailable() ? '#2E7D32' : '#F57C00' }]}>
          {isOCRAvailable() ? 'OCR enabled (on-device)' : 'Manual entry mode (dev build required for OCR)'}
        </Text>
      </View>

      {/* Saved Cards List */}
      {cards.length > 0 && (
        <View style={styles.cardsSection}>
          <Text style={styles.cardsTitle}>Scanned Cards ({cards.length})</Text>
          {cards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <Image source={{ uri: card.imagePath }} style={styles.cardThumb} resizeMode="cover" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {card.extractedName || 'No name detected'}
                </Text>
                {card.extractedCompany ? (
                  <Text style={styles.cardCompany} numberOfLines={1}>{card.extractedCompany}</Text>
                ) : null}
                {card.extractedPhone ? (
                  <Text style={styles.cardDetail} numberOfLines={1}>{card.extractedPhone}</Text>
                ) : null}
              </View>
              {/* Re-extract button */}
              {card.rawText ? (
                <TouchableOpacity style={styles.cardActionBtn} onPress={() => reExtract(card)}>
                  <Icon name="refresh" size={16} color={theme.colors.secondary} />
                </TouchableOpacity>
              ) : null}
              {/* Auto-fill button */}
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() => onAutoFill && onAutoFill({
                  name: card.extractedName,
                  company: card.extractedCompany,
                  phone: card.extractedPhone,
                  email: card.extractedEmail,
                  website: card.extractedWebsite,
                })}>
                <Icon name="auto-fix" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              {/* Delete button */}
              <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleDelete(card)}>
                <Icon name="trash-can-outline" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
//  Extracted Field Editor
// ═══════════════════════════════════════════════════════════════
const ExtractField = ({ label, icon, value, onChange, keyboardType, multiline, placeholder }) => (
  <View style={styles.extractField}>
    <View style={styles.extractLabel}>
      <Icon name={icon} size={14} color={theme.colors.textLight} />
      <Text style={styles.extractLabelText}>{label}</Text>
      {value ? (
        <View style={styles.extractBadge}>
          <Text style={styles.extractBadgeText}>detected</Text>
        </View>
      ) : null}
    </View>
    <TextInput
      style={[styles.extractInput, multiline && { minHeight: 60, textAlignVertical: 'top' }]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder || label}
      placeholderTextColor={theme.colors.textLight}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
    />
  </View>
);

// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { marginBottom: 8 },

  // Capture
  captureRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  captureBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
  },
  captureBtnText: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },

  // Live Scan
  liveScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  liveScanBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  liveScanBtnHint: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginLeft: 2 },

  // Processing
  processingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  processingText: { fontSize: 14, color: theme.colors.primary, fontWeight: '500' },

  // OCR status
  ocrStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  ocrStatusText: { fontSize: 11, fontWeight: '500' },

  // Cards list
  cardsSection: { marginTop: 8 },
  cardsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    gap: 8,
    ...theme.shadows.sm,
  },
  cardThumb: { width: 50, height: 32, borderRadius: 4, backgroundColor: '#F0F0F0' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  cardCompany: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 1 },
  cardDetail: { fontSize: 11, color: theme.colors.textLight, marginTop: 1 },
  cardActionBtn: { padding: 6 },

  // Preview
  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    ...theme.shadows.md,
  },
  previewTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  manualNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  manualNoticeText: { flex: 1, fontSize: 12, color: '#E65100', lineHeight: 18 },
  rawTextCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  rawTextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rawTextLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.primary },
  rawTextContent: { fontSize: 12, color: theme.colors.text, lineHeight: 18 },

  // Extract fields
  extractField: { marginBottom: 10 },
  extractLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  extractLabelText: { fontSize: 11, color: theme.colors.textLight, fontWeight: '500' },
  extractBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  extractBadgeText: { fontSize: 9, color: '#2E7D32', fontWeight: '700' },
  extractInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Actions
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});

export default VisitingCardScanner;
