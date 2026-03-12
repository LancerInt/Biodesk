import { useState, useEffect, useCallback } from 'react';
import DatabaseService from '../database/DatabaseService';

const useDatabase = () => {
  const [leads, setLeads] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshLeads = useCallback(async () => {
    try {
      const data = await DatabaseService.getLeads();
      setLeads(data);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const refreshMeetings = useCallback(async () => {
    try {
      const data = await DatabaseService.getMeetings();
      setMeetings(data);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await DatabaseService.getDatabase();
        await refreshLeads();
        await refreshMeetings();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [refreshLeads, refreshMeetings]);

  const addLead = useCallback(async (lead) => {
    const id = await DatabaseService.insertLead(lead);
    await refreshLeads();
    return id;
  }, [refreshLeads]);

  const updateLead = useCallback(async (id, lead) => {
    await DatabaseService.updateLead(id, lead);
    await refreshLeads();
  }, [refreshLeads]);

  const deleteLead = useCallback(async (id) => {
    await DatabaseService.deleteLead(id);
    await refreshLeads();
  }, [refreshLeads]);

  const addMeeting = useCallback(async (meeting) => {
    const id = await DatabaseService.insertMeeting(meeting);
    await refreshMeetings();
    return id;
  }, [refreshMeetings]);

  const updateMeeting = useCallback(async (id, meeting) => {
    await DatabaseService.updateMeeting(id, meeting);
    await refreshMeetings();
  }, [refreshMeetings]);

  const deleteMeeting = useCallback(async (id) => {
    await DatabaseService.deleteMeeting(id);
    await refreshMeetings();
  }, [refreshMeetings]);

  const exportLeadsCSV = useCallback(async () => {
    return await DatabaseService.getLeadsAsCSV();
  }, []);

  return {
    leads, meetings, loading, error,
    addLead, updateLead, deleteLead,
    addMeeting, updateMeeting, deleteMeeting,
    refreshLeads, refreshMeetings, exportLeadsCSV,
  };
};

export default useDatabase;
