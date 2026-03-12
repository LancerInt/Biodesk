import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import DatabaseService from '../database/DatabaseService';

/**
 * ImageManager — centralized image management for products, technology, and other entities.
 *
 * Storage structure:
 *   {documentDirectory}/images/{entityType}/{entityId}/{filename}
 *
 * Entity types: 'products', 'technology', 'media', 'leads', 'meetings'
 */
const ImageManager = {
  /**
   * Get the base directory for an entity's images.
   */
  getEntityDir(entityType, entityId) {
    return `${FileSystem.documentDirectory}images/${entityType}/${entityId}/`;
  },

  /**
   * Ensure the directory exists for an entity.
   */
  async ensureDir(entityType, entityId) {
    const dir = this.getEntityDir(entityType, entityId);
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  },

  /**
   * Pick an image from camera or gallery and store it.
   * @returns {{ filePath, label, id }} or null if cancelled
   */
  async pickAndStore({ entityType, entityId, label = '', useCamera = false }) {
    let result;

    if (useCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return null;
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
      });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return null;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
      });
    }

    if (result.canceled || !result.assets || result.assets.length === 0) return null;

    const sourceUri = result.assets[0].uri;
    const dir = await this.ensureDir(entityType, entityId);
    const ext = sourceUri.split('.').pop() || 'jpg';
    const filename = `${label.replace(/\s+/g, '_').toLowerCase() || 'image'}_${Date.now()}.${ext}`;
    const destPath = dir + filename;

    await FileSystem.copyAsync({ from: sourceUri, to: destPath });

    // Save metadata to DB
    const id = await DatabaseService.insertImage({
      entityType,
      entityId,
      filePath: destPath,
      label,
    });

    return { id, filePath: destPath, label };
  },

  /**
   * Replace an existing image file.
   */
  async replaceImage({ imageId, entityType, entityId, useCamera = false }) {
    let result;

    if (useCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return null;
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
      });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return null;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
      });
    }

    if (result.canceled || !result.assets || result.assets.length === 0) return null;

    const sourceUri = result.assets[0].uri;
    const dir = await this.ensureDir(entityType, entityId);
    const ext = sourceUri.split('.').pop() || 'jpg';
    const filename = `replaced_${Date.now()}.${ext}`;
    const destPath = dir + filename;

    await FileSystem.copyAsync({ from: sourceUri, to: destPath });
    await DatabaseService.replaceImage(imageId, destPath);

    return { id: imageId, filePath: destPath };
  },

  /**
   * Get all images for an entity.
   */
  async getImages(entityType, entityId) {
    return DatabaseService.getImages(entityType, entityId);
  },

  /**
   * Delete an image file and its DB record.
   */
  async deleteImage(imageId, filePath) {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    } catch {}
    await DatabaseService.deleteImage(imageId);
  },

  /**
   * Clean up all images for an entity (e.g., when deleting a product).
   */
  async clearEntityImages(entityType, entityId) {
    const images = await this.getImages(entityType, entityId);
    for (const img of images) {
      try {
        await FileSystem.deleteAsync(img.filePath, { idempotent: true });
      } catch {}
      await DatabaseService.deleteImage(img.id);
    }
    // Try to remove directory
    try {
      const dir = this.getEntityDir(entityType, entityId);
      await FileSystem.deleteAsync(dir, { idempotent: true });
    } catch {}
  },
};

export default ImageManager;
