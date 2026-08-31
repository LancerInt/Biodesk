import React, { createContext, useContext, useReducer, useEffect } from 'react';
import DatabaseService from '../database/DatabaseService';
import { PRODUCTS } from '../constants/productData';
import { setAppLanguage, LANGUAGES } from '../i18n';

/**
 * Lazy-load expo-av to prevent crash when ExponentAV native module
 * isn't linked (stale prebuild). Audio mode setup is best-effort.
 */
let AVAudio = null;
try {
  AVAudio = require('expo-av').Audio;
} catch {
  // expo-av not available — audio features will show fallback
}

const AppContext = createContext();

const initialState = {
  dbReady: false,
  adminAuthenticated: false,
  language: 'en',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DB_READY':
      return { ...state, dbReady: true };
    case 'ADMIN_AUTH':
      return { ...state, adminAuthenticated: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      // Configure audio mode for recording + playback (best-effort)
      if (AVAudio) {
        try {
          await AVAudio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });
        } catch (e) {
          console.warn('Audio mode init error:', e);
        }
      }
      try {
        await DatabaseService.getDatabase();
        await DatabaseService.populateSearchIndex(PRODUCTS);
        // Load persisted language and apply it (falls through to device
        // locale if nothing saved yet — set by i18n init at import time)
        const savedLang = await DatabaseService.getSetting('app_language');
        if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
          await setAppLanguage(savedLang);
          dispatch({ type: 'SET_LANGUAGE', payload: savedLang });
        }
        dispatch({ type: 'DB_READY' });
      } catch (e) {
        console.warn('DB init error:', e);
      }
    };
    init();
  }, []);

  const changeLanguage = async (code) => {
    const needsReload = await setAppLanguage(code);
    await DatabaseService.setSetting('app_language', code);
    dispatch({ type: 'SET_LANGUAGE', payload: code });
    return needsReload;
  };

  const verifyPin = async (pin) => {
    const storedPin = await DatabaseService.getSetting('admin_pin');
    const valid = pin === (storedPin || '1234');
    if (valid) dispatch({ type: 'ADMIN_AUTH', payload: true });
    return valid;
  };

  const lockAdmin = () => dispatch({ type: 'ADMIN_AUTH', payload: false });

  return (
    <AppContext.Provider value={{ state, dispatch, verifyPin, lockAdmin, changeLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
