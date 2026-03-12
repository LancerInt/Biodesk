import { useState, useCallback, useRef } from 'react';
import { searchProducts } from '../constants/productData';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef(null);

  const performSearch = useCallback((text) => {
    setQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!text || text.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    timerRef.current = setTimeout(() => {
      const productResults = searchProducts(text);
      setResults(productResults);
      setIsSearching(false);
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { query, setQuery: performSearch, results, isSearching, clearSearch };
};

export default useSearch;
