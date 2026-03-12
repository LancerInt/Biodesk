import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const SearchBar = ({value, onChangeText, placeholder = 'Search...', onClear}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const debouncedChange = useCallback(
    (text) => {
      setLocalValue(text);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        if (onChangeText) {
          onChangeText(text);
        }
      }, 300);
    },
    [onChangeText],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (onChangeText) {
      onChangeText('');
    }
    if (onClear) {
      onClear();
    }
  }, [onChangeText, onClear]);

  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color="#9E9E9E" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={debouncedChange}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        returnKeyType="search"
        autoCorrect={false}
      />
      {localValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="close-circle" size={18} color="#9E9E9E" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default SearchBar;
