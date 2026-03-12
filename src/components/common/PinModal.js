import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DatabaseService from '../../database/DatabaseService';

const DEFAULT_PIN = '1234';

const PinModal = ({visible, onClose, onSuccess}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setPin('');
      setError(false);
    }
  }, [visible]);

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
    ]).start();
  }, [shakeAnim]);

  const verifyPin = useCallback(
    async (enteredPin) => {
      try {
        const storedPin = await DatabaseService.getSetting('admin_pin');
        const correctPin = storedPin || DEFAULT_PIN;
        if (enteredPin === correctPin) {
          setPin('');
          setError(false);
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(true);
          triggerShake();
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      } catch {
        const correctPin = DEFAULT_PIN;
        if (enteredPin === correctPin) {
          setPin('');
          setError(false);
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(true);
          triggerShake();
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    },
    [onSuccess, triggerShake],
  );

  const handleKeyPress = useCallback(
    (digit) => {
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          setTimeout(() => verifyPin(newPin), 150);
        }
      }
    },
    [pin, verifyPin],
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            i < pin.length && styles.dotFilled,
            error && styles.dotError,
          ]}
        />,
      );
    }
    return dots;
  };

  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'back'],
    ];

    return keys.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keypadRow}>
        {row.map((key, keyIndex) => {
          if (key === '') {
            return <View key={keyIndex} style={styles.keyEmpty} />;
          }
          if (key === 'back') {
            return (
              <TouchableOpacity
                key={keyIndex}
                style={styles.key}
                onPress={handleBackspace}
                activeOpacity={0.6}>
                <Icon name="backspace-outline" size={24} color="#424242" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={keyIndex}
              style={styles.key}
              onPress={() => handleKeyPress(key)}
              activeOpacity={0.6}>
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.card, {transform: [{translateX: shakeAnim}]}]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={22} color="#757575" />
          </TouchableOpacity>

          <Text style={styles.title}>Enter Admin PIN</Text>

          <View style={styles.dotsContainer}>{renderDots()}</View>

          {error && <Text style={styles.errorText}>Incorrect PIN</Text>}

          <View style={styles.keypad}>{renderKeypad()}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 32,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  dotError: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 4,
  },
  keypad: {
    marginTop: 16,
    width: '100%',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    width: 64,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  keyEmpty: {
    width: 64,
    height: 52,
    marginHorizontal: 8,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#212121',
  },
});

export default PinModal;
