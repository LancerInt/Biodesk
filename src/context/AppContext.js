import React, { createContext, useContext, useReducer, useEffect } from 'react';
import DatabaseService from '../database/DatabaseService';
import { PRODUCTS } from '../constants/productData';

const AppContext = createContext();

const initialState = {
  dbReady: false,
  adminAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DB_READY':
      return { ...state, dbReady: true };
    case 'ADMIN_AUTH':
      return { ...state, adminAuthenticated: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        await DatabaseService.getDatabase();
        await DatabaseService.populateSearchIndex(PRODUCTS);
        dispatch({ type: 'DB_READY' });
      } catch (e) {
        console.warn('DB init error:', e);
      }
    };
    init();
  }, []);

  const verifyPin = async (pin) => {
    const storedPin = await DatabaseService.getSetting('admin_pin');
    const valid = pin === (storedPin || '1234');
    if (valid) dispatch({ type: 'ADMIN_AUTH', payload: true });
    return valid;
  };

  const lockAdmin = () => dispatch({ type: 'ADMIN_AUTH', payload: false });

  return (
    <AppContext.Provider value={{ state, dispatch, verifyPin, lockAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
