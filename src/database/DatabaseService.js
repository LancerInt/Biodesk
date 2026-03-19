import * as SQLite from 'expo-sqlite';

let dbInstance = null;

const DatabaseService = {
  async getDatabase() {
    if (dbInstance) return dbInstance;
    dbInstance = await SQLite.openDatabaseAsync('BioDesk.db');
    await this.initDatabase(dbInstance);
    return dbInstance;
  },

  async initDatabase(database) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        lead_number TEXT,
        name TEXT NOT NULL,
        company TEXT,
        country TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        event TEXT,
        booth TEXT,
        city TEXT,
        meetingCountry TEXT,
        meetingDate TEXT,
        interestedProducts TEXT,
        partnerType TEXT,
        interestTags TEXT,
        businessTags TEXT,
        countryOfOperation TEXT,
        estimatedVolume TEXT,
        notes TEXT,
        visitingCardUri TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY,
        meeting_number TEXT,
        title TEXT NOT NULL,
        event TEXT,
        date TEXT,
        location TEXT,
        attendees TEXT,
        notes TEXT,
        associatedLeads TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS search_index (
        productId TEXT,
        name TEXT,
        category TEXT,
        activeIngredient TEXT,
        targetCrops TEXT,
        targetPests TEXT,
        description TEXT
      );
      CREATE TABLE IF NOT EXISTS audio_recordings (
        id TEXT PRIMARY KEY,
        parentType TEXT NOT NULL,
        parentId TEXT NOT NULL,
        filePath TEXT NOT NULL,
        duration INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS visiting_cards (
        id TEXT PRIMARY KEY,
        leadId TEXT NOT NULL,
        imagePath TEXT NOT NULL,
        extractedName TEXT,
        extractedCompany TEXT,
        extractedJobTitle TEXT,
        extractedPhone TEXT,
        extractedEmail TEXT,
        extractedWebsite TEXT,
        extractedAddress TEXT,
        rawText TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        entityType TEXT NOT NULL,
        entityId TEXT NOT NULL,
        filePath TEXT NOT NULL,
        label TEXT,
        sortOrder INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT (datetime('now'))
      );
    `);

    // Migrate: add lead_number column if missing (existing databases)
    try {
      const tableInfo = await database.getAllAsync("PRAGMA table_info('leads')");
      const hasLeadNumber = tableInfo.some(col => col.name === 'lead_number');
      if (!hasLeadNumber) {
        await database.execAsync('ALTER TABLE leads ADD COLUMN lead_number TEXT');
      }
      // Back-fill any leads missing a lead_number (ordered by creation date)
      const unNumbered = await database.getAllAsync(
        "SELECT id FROM leads WHERE lead_number IS NULL ORDER BY createdAt ASC"
      );
      if (unNumbered.length > 0) {
        const existing = await database.getAllAsync(
          "SELECT lead_number FROM leads WHERE lead_number IS NOT NULL"
        );
        const used = new Set();
        for (const r of existing) {
          const m = (r.lead_number || '').match(/^LEAD-(\d+)$/);
          if (m) used.add(parseInt(m[1], 10));
        }
        let next = 1;
        for (const row of unNumbered) {
          while (used.has(next)) next++;
          const num = `LEAD-${next.toString().padStart(2, '0')}`;
          await database.runAsync('UPDATE leads SET lead_number = ? WHERE id = ?', [num, row.id]);
          used.add(next);
          next++;
        }
      }
    } catch {}

    // Migrate: add meeting_number column if missing (existing databases)
    try {
      const meetingInfo = await database.getAllAsync("PRAGMA table_info('meetings')");
      const hasMeetingNumber = meetingInfo.some(col => col.name === 'meeting_number');
      if (!hasMeetingNumber) {
        await database.execAsync('ALTER TABLE meetings ADD COLUMN meeting_number TEXT');
      }
      // Back-fill any meetings missing a meeting_number (ordered by creation date)
      const unNumberedMeetings = await database.getAllAsync(
        "SELECT id FROM meetings WHERE meeting_number IS NULL ORDER BY createdAt ASC"
      );
      if (unNumberedMeetings.length > 0) {
        const existingMeetings = await database.getAllAsync(
          "SELECT meeting_number FROM meetings WHERE meeting_number IS NOT NULL"
        );
        const usedMeet = new Set();
        for (const r of existingMeetings) {
          const m = (r.meeting_number || '').match(/^MEET-(\d+)$/);
          if (m) usedMeet.add(parseInt(m[1], 10));
        }
        let nextMeet = 1;
        for (const row of unNumberedMeetings) {
          while (usedMeet.has(nextMeet)) nextMeet++;
          const num = `MEET-${nextMeet.toString().padStart(2, '0')}`;
          await database.runAsync('UPDATE meetings SET meeting_number = ? WHERE id = ?', [num, row.id]);
          usedMeet.add(nextMeet);
          nextMeet++;
        }
      }
    } catch {}

    const pin = await database.getFirstAsync(
      'SELECT value FROM settings WHERE key = ?', ['admin_pin']
    );
    if (!pin) {
      await database.runAsync(
        'INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_pin', '1234']
      );
    }
  },

  // ═══════════ LEADS ═══════════

  /**
   * Find the smallest available lead number (gap-filling).
   * Returns formatted string like "LEAD-01", "LEAD-02", etc.
   */
  async generateNextLeadNumber() {
    const database = await this.getDatabase();
    const rows = await database.getAllAsync(
      "SELECT lead_number FROM leads WHERE lead_number IS NOT NULL"
    );
    const usedNumbers = new Set();
    for (const row of rows) {
      const match = (row.lead_number || '').match(/^LEAD-(\d+)$/);
      if (match) usedNumbers.add(parseInt(match[1], 10));
    }
    let next = 1;
    while (usedNumbers.has(next)) next++;
    return `LEAD-${next.toString().padStart(2, '0')}`;
  },

  async insertLead(lead) {
    const database = await this.getDatabase();
    const id = lead.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const leadNumber = lead.lead_number || await this.generateNextLeadNumber();
    await database.runAsync(
      `INSERT INTO leads (id, lead_number, name, company, country, phone, email, website, event, booth, city,
        meetingCountry, meetingDate, interestedProducts, partnerType, interestTags, businessTags,
        countryOfOperation, estimatedVolume, notes, visitingCardUri)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, leadNumber, lead.name, lead.company, lead.country, lead.phone, lead.email, lead.website,
       lead.event, lead.booth, lead.city, lead.meetingCountry, lead.meetingDate,
       JSON.stringify(lead.interestedProducts || []), lead.partnerType,
       JSON.stringify(lead.interestTags || []), JSON.stringify(lead.businessTags || []),
       lead.countryOfOperation, lead.estimatedVolume, lead.notes, lead.visitingCardUri]
    );
    return { id, leadNumber };
  },

  async getLeads() {
    const database = await this.getDatabase();
    const rows = await database.getAllAsync('SELECT * FROM leads ORDER BY createdAt DESC');
    return rows.map(row => ({
      ...row,
      interestedProducts: JSON.parse(row.interestedProducts || '[]'),
      interestTags: JSON.parse(row.interestTags || '[]'),
      businessTags: JSON.parse(row.businessTags || '[]'),
    }));
  },

  async getLeadById(id) {
    const database = await this.getDatabase();
    const row = await database.getFirstAsync('SELECT * FROM leads WHERE id = ?', [id]);
    if (!row) return null;
    return {
      ...row,
      interestedProducts: JSON.parse(row.interestedProducts || '[]'),
      interestTags: JSON.parse(row.interestTags || '[]'),
      businessTags: JSON.parse(row.businessTags || '[]'),
    };
  },

  async updateLead(id, lead) {
    const database = await this.getDatabase();
    await database.runAsync(
      `UPDATE leads SET name=?, company=?, country=?, phone=?, email=?, website=?,
       event=?, booth=?, city=?, meetingCountry=?, meetingDate=?, interestedProducts=?,
       partnerType=?, interestTags=?, businessTags=?, countryOfOperation=?,
       estimatedVolume=?, notes=?, visitingCardUri=?, updatedAt=datetime('now')
       WHERE id=?`,
      [lead.name, lead.company, lead.country, lead.phone, lead.email, lead.website,
       lead.event, lead.booth, lead.city, lead.meetingCountry, lead.meetingDate,
       JSON.stringify(lead.interestedProducts || []), lead.partnerType,
       JSON.stringify(lead.interestTags || []), JSON.stringify(lead.businessTags || []),
       lead.countryOfOperation, lead.estimatedVolume, lead.notes, lead.visitingCardUri, id]
    );
  },

  async deleteLead(id) {
    const database = await this.getDatabase();
    // Cascade: delete linked images, visiting cards, audio recordings + files
    const images = await database.getAllAsync('SELECT * FROM images WHERE entityType = ? AND entityId = ?', ['lead', id]);
    for (const img of images) {
      if (img.filePath) {
        try { const fs = require('expo-file-system/legacy'); await fs.deleteAsync(img.filePath, { idempotent: true }); } catch {}
      }
      await database.runAsync('DELETE FROM images WHERE id = ?', [img.id]);
    }
    const cards = await database.getAllAsync('SELECT * FROM visiting_cards WHERE leadId = ?', [id]);
    for (const card of cards) {
      if (card.imagePath) {
        try { const fs = require('expo-file-system/legacy'); await fs.deleteAsync(card.imagePath, { idempotent: true }); } catch {}
      }
      await database.runAsync('DELETE FROM visiting_cards WHERE id = ?', [card.id]);
    }
    const audios = await database.getAllAsync('SELECT * FROM audio_recordings WHERE parentType = ? AND parentId = ?', ['lead', id]);
    for (const audio of audios) {
      if (audio.filePath) {
        try { const fs = require('expo-file-system/legacy'); await fs.deleteAsync(audio.filePath, { idempotent: true }); } catch {}
      }
      await database.runAsync('DELETE FROM audio_recordings WHERE id = ?', [audio.id]);
    }
    await database.runAsync('DELETE FROM leads WHERE id = ?', [id]);
  },

  // ═══════════ MEETINGS ═══════════

  /**
   * Find the smallest available meeting number (gap-filling).
   * Returns formatted string like "MEET-01", "MEET-02", etc.
   */
  async generateNextMeetingNumber() {
    const database = await this.getDatabase();
    const rows = await database.getAllAsync(
      "SELECT meeting_number FROM meetings WHERE meeting_number IS NOT NULL"
    );
    const usedNumbers = new Set();
    for (const row of rows) {
      const match = (row.meeting_number || '').match(/^MEET-(\d+)$/);
      if (match) usedNumbers.add(parseInt(match[1], 10));
    }
    let next = 1;
    while (usedNumbers.has(next)) next++;
    return `MEET-${next.toString().padStart(2, '0')}`;
  },

  async insertMeeting(meeting) {
    const database = await this.getDatabase();
    const id = meeting.id || `meet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const meetingNumber = meeting.meeting_number || await this.generateNextMeetingNumber();
    await database.runAsync(
      `INSERT INTO meetings (id, meeting_number, title, event, date, location, attendees, notes, associatedLeads)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, meetingNumber, meeting.title, meeting.event, meeting.date, meeting.location,
       meeting.attendees, meeting.notes, JSON.stringify(meeting.associatedLeads || [])]
    );
    return { id, meetingNumber };
  },

  async getMeetings() {
    const database = await this.getDatabase();
    const rows = await database.getAllAsync('SELECT * FROM meetings ORDER BY createdAt DESC');
    return rows.map(row => ({
      ...row,
      associatedLeads: JSON.parse(row.associatedLeads || '[]'),
    }));
  },

  async getMeetingById(id) {
    const database = await this.getDatabase();
    const row = await database.getFirstAsync('SELECT * FROM meetings WHERE id = ?', [id]);
    if (!row) return null;
    return { ...row, associatedLeads: JSON.parse(row.associatedLeads || '[]') };
  },

  async updateMeeting(id, meeting) {
    const database = await this.getDatabase();
    await database.runAsync(
      `UPDATE meetings SET title=?, event=?, date=?, location=?, attendees=?,
       notes=?, associatedLeads=?, updatedAt=datetime('now') WHERE id=?`,
      [meeting.title, meeting.event, meeting.date, meeting.location,
       meeting.attendees, meeting.notes,
       JSON.stringify(meeting.associatedLeads || []), id]
    );
  },

  async deleteMeeting(id) {
    const database = await this.getDatabase();
    // Cascade: delete linked audio recordings + files
    const audios = await database.getAllAsync('SELECT * FROM audio_recordings WHERE parentType = ? AND parentId = ?', ['meeting', id]);
    for (const audio of audios) {
      if (audio.filePath) {
        try { const fs = require('expo-file-system/legacy'); await fs.deleteAsync(audio.filePath, { idempotent: true }); } catch {}
      }
      await database.runAsync('DELETE FROM audio_recordings WHERE id = ?', [audio.id]);
    }
    await database.runAsync('DELETE FROM meetings WHERE id = ?', [id]);
  },

  // ═══════════ SETTINGS ═══════════
  async getSetting(key) {
    const database = await this.getDatabase();
    const row = await database.getFirstAsync(
      'SELECT value FROM settings WHERE key = ?', [key]
    );
    return row ? row.value : null;
  },

  async setSetting(key, value) {
    const database = await this.getDatabase();
    await database.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]
    );
  },

  // ═══════════ SEARCH ═══════════
  async populateSearchIndex(products) {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM search_index');
    for (const p of products) {
      await database.runAsync(
        `INSERT INTO search_index (productId, name, category, activeIngredient, targetCrops, targetPests, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.category, p.activeIngredient || '',
         (p.targetCrops || []).join(', '), (p.targetPests || []).join(', '), p.description || '']
      );
    }
  },

  async searchFTS(query) {
    const database = await this.getDatabase();
    const q = `%${query}%`;
    const rows = await database.getAllAsync(
      `SELECT * FROM search_index
       WHERE name LIKE ? OR category LIKE ? OR activeIngredient LIKE ? OR targetCrops LIKE ?
       LIMIT 20`,
      [q, q, q, q]
    );
    return rows;
  },

  // ═══════════ EXPORT ═══════════
  async getLeadsAsCSV() {
    const leads = await this.getLeads();
    if (leads.length === 0) return '';
    const headers = ['Lead Number', 'Name', 'Company', 'Country', 'Phone', 'Email', 'Website',
      'Event', 'Booth', 'City', 'Meeting Country', 'Meeting Date',
      'Interested Products', 'Partner Type', 'Interest Tags', 'Business Tags',
      'Country of Operation', 'Estimated Volume', 'Notes', 'Created At'];
    const rows = leads.map(l => [
      l.lead_number, l.name, l.company, l.country, l.phone, l.email, l.website,
      l.event, l.booth, l.city, l.meetingCountry, l.meetingDate,
      (l.interestedProducts || []).join('; '), l.partnerType,
      (l.interestTags || []).join('; '), (l.businessTags || []).join('; '),
      l.countryOfOperation, l.estimatedVolume, l.notes, l.createdAt,
    ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
  },

  async getLeadCount() {
    const database = await this.getDatabase();
    const row = await database.getFirstAsync('SELECT COUNT(*) as count FROM leads');
    return row ? row.count : 0;
  },

  async getMeetingCount() {
    const database = await this.getDatabase();
    const row = await database.getFirstAsync('SELECT COUNT(*) as count FROM meetings');
    return row ? row.count : 0;
  },

  // ═══════════ AUDIO RECORDINGS ═══════════
  async insertAudioRecording(recording) {
    const database = await this.getDatabase();
    const id = recording.id || `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await database.runAsync(
      `INSERT INTO audio_recordings (id, parentType, parentId, filePath, duration)
       VALUES (?, ?, ?, ?, ?)`,
      [id, recording.parentType, recording.parentId, recording.filePath, recording.duration || 0]
    );
    return id;
  },

  async getAudioRecordings(parentType, parentId) {
    const database = await this.getDatabase();
    return database.getAllAsync(
      'SELECT * FROM audio_recordings WHERE parentType = ? AND parentId = ? ORDER BY createdAt DESC',
      [parentType, parentId]
    );
  },

  async deleteAudioRecording(id) {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM audio_recordings WHERE id = ?', [id]);
  },

  // Returns a Set of parentIds that have audio recordings for the given type
  async getEntitiesWithAudio(parentType) {
    const database = await this.getDatabase();
    const rows = await database.getAllAsync(
      'SELECT DISTINCT parentId FROM audio_recordings WHERE parentType = ?',
      [parentType]
    );
    return new Set(rows.map(r => r.parentId));
  },

  // Get all audio recordings across all entities (for gallery)
  async getAllAudioRecordings() {
    const database = await this.getDatabase();
    return database.getAllAsync('SELECT * FROM audio_recordings ORDER BY createdAt DESC');
  },

  // Get all images across all entities (for gallery)
  async getAllImages() {
    const database = await this.getDatabase();
    return database.getAllAsync('SELECT * FROM images ORDER BY createdAt DESC');
  },

  // Get all visiting card images (for gallery)
  async getAllVisitingCards() {
    const database = await this.getDatabase();
    return database.getAllAsync('SELECT * FROM visiting_cards ORDER BY createdAt DESC');
  },

  // ═══════════ VISITING CARDS ═══════════
  async insertVisitingCard(card) {
    const database = await this.getDatabase();
    const id = card.id || `vcard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await database.runAsync(
      `INSERT INTO visiting_cards (id, leadId, imagePath, extractedName, extractedCompany,
       extractedJobTitle, extractedPhone, extractedEmail, extractedWebsite, extractedAddress, rawText)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, card.leadId, card.imagePath, card.extractedName || '', card.extractedCompany || '',
       card.extractedJobTitle || '', card.extractedPhone || '', card.extractedEmail || '',
       card.extractedWebsite || '', card.extractedAddress || '', card.rawText || '']
    );
    return id;
  },

  async getVisitingCards(leadId) {
    const database = await this.getDatabase();
    return database.getAllAsync(
      'SELECT * FROM visiting_cards WHERE leadId = ? ORDER BY createdAt DESC', [leadId]
    );
  },

  async deleteVisitingCard(id) {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM visiting_cards WHERE id = ?', [id]);
  },

  // ═══════════ IMAGE MANAGEMENT ═══════════
  async insertImage(image) {
    const database = await this.getDatabase();
    const id = image.id || `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await database.runAsync(
      `INSERT INTO images (id, entityType, entityId, filePath, label, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, image.entityType, image.entityId, image.filePath, image.label || '', image.sortOrder || 0]
    );
    return id;
  },

  async getImages(entityType, entityId) {
    const database = await this.getDatabase();
    return database.getAllAsync(
      'SELECT * FROM images WHERE entityType = ? AND entityId = ? ORDER BY sortOrder ASC, createdAt DESC',
      [entityType, entityId]
    );
  },

  async deleteImage(id) {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM images WHERE id = ?', [id]);
  },

  async replaceImage(id, newFilePath) {
    const database = await this.getDatabase();
    await database.runAsync(
      'UPDATE images SET filePath = ?, createdAt = datetime(\'now\') WHERE id = ?',
      [newFilePath, id]
    );
  },

  async clearLeads() {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM leads');
  },

  async clearAll() {
    const database = await this.getDatabase();
    await database.runAsync('DELETE FROM leads');
    await database.runAsync('DELETE FROM meetings');
  },
};

export default DatabaseService;
