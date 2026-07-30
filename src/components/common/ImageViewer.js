import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.8;

const ImageViewer = React.memo(({visible, imageUri, imageSource, onClose}) => {
  const insets = useSafeAreaInsets();
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({x: 0, y: 0});

  // Refs mirror state so gesture callbacks always see the latest values
  const scaleRef = useRef(1);
  const translateRef = useRef({x: 0, y: 0});
  const baseScale = useRef(1);
  const lastDistance = useRef(0);
  const panStart = useRef({x: 0, y: 0});

  const applyScale = (next) => {
    scaleRef.current = next;
    setScale(next);
  };
  const applyTranslate = (t) => {
    translateRef.current = t;
    setTranslate(t);
  };

  const reset = () => {
    applyScale(1);
    applyTranslate({x: 0, y: 0});
    baseScale.current = 1;
    lastDistance.current = 0;
  };

  const getDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Clamp pan so the image can't be dragged completely off-screen
  const clampTranslate = (t, s) => {
    if (s <= 1) return {x: 0, y: 0};
    const overflowX = (SCREEN_WIDTH * (s - 1)) / 2;
    const overflowY = (IMAGE_HEIGHT * (s - 1)) / 2;
    return {
      x: Math.max(-overflowX, Math.min(overflowX, t.x)),
      y: Math.max(-overflowY, Math.min(overflowY, t.y)),
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (gestureState.numberActiveTouches === 2) return true;
        if (gestureState.numberActiveTouches === 1 && scaleRef.current > 1) {
          const moved = Math.hypot(gestureState.dx, gestureState.dy);
          return moved > 4;
        }
        return false;
      },
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          lastDistance.current = getDistance(touches);
          baseScale.current = scaleRef.current;
        } else {
          panStart.current = {...translateRef.current};
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const distance = getDistance(touches);
          if (lastDistance.current > 0) {
            const ratio = distance / lastDistance.current;
            const next = Math.min(
              Math.max(baseScale.current * ratio, 0.5),
              MAX_SCALE,
            );
            applyScale(next);
            applyTranslate(clampTranslate(translateRef.current, next));
          }
        } else if (scaleRef.current > 1) {
          applyTranslate(
            clampTranslate(
              {
                x: panStart.current.x + gestureState.dx,
                y: panStart.current.y + gestureState.dy,
              },
              scaleRef.current,
            ),
          );
        }
      },
      onPanResponderRelease: () => {
        lastDistance.current = 0;
        if (scaleRef.current < MIN_SCALE) {
          reset();
        } else {
          baseScale.current = scaleRef.current;
          applyTranslate(clampTranslate(translateRef.current, scaleRef.current));
        }
      },
      onPanResponderTerminate: () => {
        lastDistance.current = 0;
        baseScale.current = scaleRef.current;
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    reset();
    if (onClose) onClose();
  }, [onClose]);

  const lastTap = useRef(0);
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (scaleRef.current > 1) {
        reset();
      } else {
        applyScale(2);
        baseScale.current = 2;
      }
    }
    lastTap.current = now;
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.closeButton, {top: insets.top + 12, right: insets.right + 16}]}
          onPress={handleClose}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <View style={styles.closeCircle}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <TouchableOpacity activeOpacity={1} onPress={handleTap}>
            {(imageUri || imageSource) ? (
              <Image
                source={imageSource || {uri: imageUri}}
                style={[
                  styles.image,
                  {
                    transform: [
                      {translateX: translate.x},
                      {translateY: translate.y},
                      {scale},
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 10,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
});

export default ImageViewer;
