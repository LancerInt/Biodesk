/**
 * Offline pdf.js loader.
 *
 * Reads the bundled pdf.min.js and pdf.worker.min.js as text strings
 * so they can be inlined directly in WebView HTML — no CDN, no file://
 * URLs, works on all Android versions offline.
 */

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

// Expo asset references (metro resolves via .data extension)
const PDF_JS_ASSET = require('../assets/pdfjs/pdf.min.data');
const PDF_WORKER_ASSET = require('../assets/pdfjs/pdf.worker.min.data');

// In-memory cache — load once per app session
let _cached = null;

/**
 * Returns the pdf.js library and worker source code as plain text strings.
 * Cached after first call.
 */
export async function loadPdfJsSources() {
  if (_cached) return _cached;

  const [pdfJsAsset, workerAsset] = [
    Asset.fromModule(PDF_JS_ASSET),
    Asset.fromModule(PDF_WORKER_ASSET),
  ];

  await Promise.all([pdfJsAsset.downloadAsync(), workerAsset.downloadAsync()]);

  if (!pdfJsAsset.localUri || !workerAsset.localUri) {
    throw new Error('Failed to resolve pdf.js assets');
  }

  const [pdfJsSource, workerSource] = await Promise.all([
    FileSystem.readAsStringAsync(pdfJsAsset.localUri, { encoding: 'utf8' }),
    FileSystem.readAsStringAsync(workerAsset.localUri, { encoding: 'utf8' }),
  ]);

  _cached = { pdfJsSource, workerSource };
  return _cached;
}
