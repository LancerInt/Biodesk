/**
 * OCR Service — wraps react-native-vision-camera-ocr-plus
 *
 * Provides two modes:
 *  1. Static image OCR via PhotoRecognizer (visiting card capture, gallery upload)
 *  2. Live OCR via Camera component (real-time scanning)
 *
 * Falls back gracefully when the native module is unavailable (Expo Go, etc.)
 */

let PhotoRecognizer = null;
let _available = false;

try {
  const ocrModule = require('react-native-vision-camera-ocr-plus');
  PhotoRecognizer = ocrModule.PhotoRecognizer;
  _available = typeof PhotoRecognizer === 'function';
} catch {
  // Not available — manual entry fallback
}

/**
 * Check if OCR is available at runtime.
 */
export const isOCRAvailable = () => _available;

/**
 * Recognize text from a static image file.
 *
 * @param {string} uri - Local file URI (file:// or content://)
 * @param {'portrait'|'landscapeRight'|'landscapeLeft'|'portraitUpsideDown'} [orientation]
 * @returns {Promise<{ text: string, blocks: Array }>}
 */
export async function recognizeTextFromImage(uri, orientation = 'portrait') {
  if (!_available) {
    throw new Error('OCR is not available. Build with dev-client for OCR support.');
  }

  if (!uri) {
    throw new Error('No image URI provided for OCR.');
  }

  try {
    const result = await PhotoRecognizer({ uri, orientation });

    if (!result) {
      return { text: '', blocks: [] };
    }

    return {
      text: result.resultText || '',
      blocks: (result.blocks || []).map(block => ({
        text: block.blockText || '',
        lines: (block.lines || []).map(line => ({
          text: line.lineText || '',
          frame: line.lineFrame,
          elements: (line.elements || []).map(el => ({
            text: el.elementText || '',
            frame: el.elementFrame,
          })),
        })),
        frame: block.blockFrame,
      })),
    };
  } catch (err) {
    // Wrap native errors with a user-friendly message
    const message = err?.message || 'Unknown OCR error';
    if (message.includes('Invalid image') || message.includes('decode')) {
      throw new Error('Could not read this image. Try capturing again with better lighting.');
    }
    throw new Error('OCR failed: ' + message);
  }
}
