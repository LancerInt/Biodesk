import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Header from '../components/common/Header';
import theme from '../constants/theme';
import { loadPdfJsSources } from '../utils/pdfJsLoader';

const CertificateViewerScreen = ({ route, navigation }) => {
  const { certName, authority, asset } = route.params;
  const [htmlFileUri, setHtmlFileUri] = useState(null);
  const [pdfJs, setPdfJs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPdf();
  }, []);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(null);

      let pdfFileUri = null;

      // Load pdf.js sources + resolve PDF file URI in parallel
      const [sources] = await Promise.all([
        loadPdfJsSources(),
        (async () => {
          const assetModule = Asset.fromModule(asset);
          await assetModule.downloadAsync();
          const localUri = assetModule.localUri;
          if (!localUri) throw new Error('Could not resolve PDF file path');
          pdfFileUri = localUri;
        })(),
      ]);

      setPdfJs(sources);

      if (Platform.OS === 'android') {
        // Build HTML and write to a temp file so WebView loads from file:// origin,
        // which allows XHR to access other file:// URIs (the PDF).
        const html = buildAndroidHtml(sources, pdfFileUri);
        const tempPath = FileSystem.cacheDirectory + 'cert_viewer_' + Date.now() + '.html';
        await FileSystem.writeAsStringAsync(tempPath, html, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setHtmlFileUri(tempPath);
      } else {
        // iOS can render PDFs natively in WebView
        setHtmlFileUri(pdfFileUri);
      }
    } catch (err) {
      console.warn('PDF load error:', err);
      setError(err.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const buildAndroidHtml = (pdfJsSources, pdfUri) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <script>${pdfJsSources.pdfJsSource}</script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      min-height: 100%;
      background: #e8e8e8;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x pan-y pinch-zoom;
    }
    #pdf-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      gap: 12px;
    }
    .page-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      overflow: visible;
      touch-action: pinch-zoom pan-x pan-y;
    }
    .page-inner {
      position: relative;
      transform-origin: center top;
      transition: transform 0.05s ease-out;
    }
    canvas {
      display: block;
      max-width: 100%;
      height: auto !important;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      border-radius: 4px;
    }
    .page-num {
      text-align: center;
      font-size: 12px;
      color: #888;
      font-family: -apple-system, sans-serif;
      padding: 4px 0 2px;
      font-weight: 500;
    }
    #loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #666;
      font-family: -apple-system, sans-serif;
    }
    #loading .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #2E7D32;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #error-msg {
      display: none;
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-family: -apple-system, sans-serif;
    }
    #error-msg h3 { color: #666; margin-bottom: 8px; }
    #page-info {
      position: fixed;
      bottom: 12px;
      right: 12px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-family: -apple-system, sans-serif;
      font-weight: 600;
      z-index: 10;
    }
    #zoom-controls {
      position: fixed;
      bottom: 12px;
      left: 12px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .zoom-btn {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      border: none;
      font-size: 22px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .zoom-btn:active { background: rgba(0,0,0,0.9); }
  </style>
</head>
<body>
  <div id="loading">
    <div class="spinner"></div>
    <div>Rendering document...</div>
  </div>
  <div id="pdf-container"></div>
  <div id="page-info" style="display:none;"></div>
  <div id="zoom-controls" style="display:none;">
    <button class="zoom-btn" id="zoom-out">\u2212</button>
    <button class="zoom-btn" id="zoom-in">+</button>
  </div>
  <div id="error-msg">
    <h3>Unable to render PDF</h3>
    <p id="error-detail"></p>
  </div>
  <script>
    // Create worker from inline source via Blob URL (fully offline)
    var workerBlob = new Blob([${JSON.stringify(pdfJsSources.workerSource)}], {type: 'application/javascript'});
    pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);

    var PDF_FILE_URI = "${pdfUri}";

    var loadingEl = document.getElementById('loading');
    var containerEl = document.getElementById('pdf-container');
    var pageInfoEl = document.getElementById('page-info');
    var zoomControlsEl = document.getElementById('zoom-controls');
    var errorEl = document.getElementById('error-msg');
    var errorDetail = document.getElementById('error-detail');

    var currentZoom = 1;
    var allPageWrappers = [];

    function applyZoom(z) {
      currentZoom = Math.max(0.5, Math.min(z, 4));
      allPageWrappers.forEach(function(w) {
        w.style.transform = 'scale(' + currentZoom + ')';
        w.style.transformOrigin = 'center top';
      });
    }

    document.getElementById('zoom-in').addEventListener('click', function() { applyZoom(currentZoom + 0.25); });
    document.getElementById('zoom-out').addEventListener('click', function() { applyZoom(currentZoom - 0.25); });

    // Load PDF via XHR — works because this HTML is loaded from file:// origin
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PDF_FILE_URI, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status !== 200 && xhr.status !== 0) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorDetail.textContent = 'Failed to load PDF (HTTP ' + xhr.status + ')';
        return;
      }
      var uint8 = new Uint8Array(xhr.response);
      pdfjsLib.getDocument({ data: uint8 }).promise.then(function(pdf) {
        loadingEl.style.display = 'none';
        var totalPages = pdf.numPages;
        pageInfoEl.style.display = 'block';
        pageInfoEl.textContent = totalPages + (totalPages === 1 ? ' page' : ' pages');
        zoomControlsEl.style.display = 'flex';

        var devicePixelRatio = window.devicePixelRatio || 1;
        var renderScale = Math.min(devicePixelRatio, 2.5);

        function renderPage(pageNum) {
          return pdf.getPage(pageNum).then(function(page) {
            var containerWidth = window.innerWidth - 16;
            var viewport = page.getViewport({ scale: 1 });
            var scale = containerWidth / viewport.width;
            var scaledViewport = page.getViewport({ scale: scale });

            var wrapper = document.createElement('div');
            wrapper.className = 'page-wrapper';
            var inner = document.createElement('div');
            inner.className = 'page-inner';
            allPageWrappers.push(inner);

            var canvas = document.createElement('canvas');
            canvas.width = scaledViewport.width * renderScale;
            canvas.height = scaledViewport.height * renderScale;
            canvas.style.width = scaledViewport.width + 'px';
            canvas.style.height = scaledViewport.height + 'px';

            var label = document.createElement('div');
            label.className = 'page-num';
            label.textContent = 'Page ' + pageNum + ' of ' + totalPages;

            inner.appendChild(canvas);
            inner.appendChild(label);
            wrapper.appendChild(inner);
            containerEl.appendChild(wrapper);

            var ctx = canvas.getContext('2d');
            ctx.scale(renderScale, renderScale);
            return page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
          });
        }

        var chain = Promise.resolve();
        for (var p = 1; p <= totalPages; p++) {
          (function(num) {
            chain = chain.then(function() { return renderPage(num); });
          })(p);
        }
      }).catch(function(err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorDetail.textContent = err.message || 'Unknown error';
      });
    };
    xhr.onerror = function() {
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      errorDetail.textContent = 'Failed to fetch PDF file';
    };
    xhr.send();
  </script>
</body>
</html>`;
  };

  const renderLoading = () => (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading certificate...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centered}>
      <Icon name="alert-circle-outline" size={64} color={theme.colors.textLight} />
      <Text style={styles.errorTitle}>Unable to load certificate</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={loadPdf} activeOpacity={0.7}>
        <Icon name="refresh" size={18} color="#FFF" />
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPdf = () => {
    if (!htmlFileUri || !pdfJs) return renderLoading();

    if (Platform.OS === 'ios') {
      return (
        <WebView
          source={{ uri: htmlFileUri }}
          style={styles.webview}
          scalesPageToFit
          bounces={false}
          startInLoadingState
          renderLoading={() => renderLoading()}
        />
      );
    }

    // Android: load the temp HTML file from file:// so XHR can access local PDFs
    return (
      <WebView
        source={{ uri: htmlFileUri }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        startInLoadingState
        renderLoading={() => renderLoading()}
        scalesPageToFit
        setBuiltInZoomControls
        setDisplayZoomControls={false}
        nestedScrollEnabled
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={certName}
        subtitle={authority}
        onBack={() => navigation.goBack()}
      />
      {loading ? renderLoading() : error ? renderError() : renderPdf()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  webview: { flex: 1, backgroundColor: '#e8e8e8' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: { fontSize: 15, color: theme.colors.textSecondary, marginTop: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 16 },
  errorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});

export default CertificateViewerScreen;
