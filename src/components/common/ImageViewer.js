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

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ImageViewer = React.memo(({visible, imageUri, imageSource, onClose}) => {
  const [scale, setScale] = useState(1);
  const baseScale = useRef(1);
  const lastDistance = useRef(0);

  const getDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.numberActiveTouches === 2;
      },
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          lastDistance.current = getDistance(evt.nativeEvent.touches);
          baseScale.current = scale;
        }
      },
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          const distance = getDistance(evt.nativeEvent.touches);
          if (lastDistance.current > 0) {
            const newScale = baseScale.current * (distance / lastDistance.current);
            const clampedScale = Math.min(Math.max(newScale, 0.5), 4);
            setScale(clampedScale);
          }
        }
      },
      onPanResponderRelease: () => {
        lastDistance.current = 0;
        if (scale < 1) {
          setScale(1);
          baseScale.current = 1;
        } else {
          baseScale.current = scale;
        }
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    setScale(1);
    baseScale.current = 1;
    lastDistance.current = 0;
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleDoubleTap = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      baseScale.current = 1;
    } else {
      setScale(2);
      baseScale.current = 2;
    }
  }, [scale]);

  const lastTap = useRef(0);
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    }
    lastTap.current = now;
  }, [handleDoubleTap]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
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
                  {transform: [{scale}]},
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
    top: 50,
    right: 20,
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
    height: SCREEN_HEIGHT * 0.8,
  },
});

export default ImageViewer;
