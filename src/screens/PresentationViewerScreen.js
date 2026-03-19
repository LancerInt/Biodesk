import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import theme from '../constants/theme';
import { loadPdfJsSources } from '../utils/pdfJsLoader';

const PresentationViewerScreen = ({ route, navigation }) => {
  const { title, asset } = route.params;
  const { width: winW, height: winH } = useWindowDimensions();
  const [htmlFileUri, setHtmlFileUri] = useState(null);
  const [pdfJs, setPdfJs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const webViewRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    loadPdf();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (controlsVisible) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setControlsVisible(false), 4000);
    }
  }, [controlsVisible, currentPage]);

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

      // Build HTML and write to a temp file so WebView loads from file:// origin,
      // which allows XHR to access other file:// URIs (the PDF).
      const html = buildHtml(sources, pdfFileUri);
      const tempPath = FileSystem.cacheDirectory + 'pres_viewer_' + Date.now() + '.html';
      await FileSystem.writeAsStringAsync(tempPath, html, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setHtmlFileUri(tempPath);
    } catch (err) {
      setError(err.message || 'Failed to load presentation');
    } finally {
      setLoading(false);
    }
  };

  const buildHtml = (pdfJsSources, pdfUri) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script>${pdfJsSources.pdfJsSource}</script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #000;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    #slide-container {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
    }
    canvas {
      display: block;
      transform-origin: center center;
      transition: transform 0.05s ease-out;
    }
    #loading {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: #aaa; font-family: -apple-system, sans-serif;
    }
    #loading .spinner {
      width: 40px; height: 40px;
      border: 4px solid #333; border-top-color: #2E7D32;
      border-radius: 50%; animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="slide-container">
    <div id="loading">
      <div class="spinner"></div>
      <div>Rendering slides...</div>
    </div>
    <canvas id="slide-canvas"></canvas>
  </div>
  <script>
    // Create worker from inline source via Blob URL (fully offline)
    var workerBlob = new Blob([${JSON.stringify(pdfJsSources.workerSource)}], {type: 'application/javascript'});
    pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);

    var PDF_FILE_URI = "${pdfUri}";

    var pdfDoc = null;
    var currentPage = 1;
    var totalPages = 0;
    var rendering = false;
    var canvas = document.getElementById('slide-canvas');
    var ctx = canvas.getContext('2d');
    var containerEl = document.getElementById('slide-container');
    var loadingEl = document.getElementById('loading');

    // Zoom & pan state
    var zoomLevel = 1;
    var panX = 0, panY = 0;
    var isPinching = false;
    var lastPinchDist = 0;
    var pinchBaseZoom = 1;
    var lastPanX = 0, lastPanY = 0;
    var pinchMidX = 0, pinchMidY = 0;

    // Swipe detection (single finger only when not zoomed)
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;
    var isSingleTouch = false;

    function sendMessage(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

    function applyTransform() {
      canvas.style.transform = 'scale(' + zoomLevel + ') translate(' + (panX / zoomLevel) + 'px, ' + (panY / zoomLevel) + 'px)';
    }

    function resetZoom() {
      zoomLevel = 1; panX = 0; panY = 0;
      applyTransform();
      sendMessage({ type: 'zoomChange', zoom: zoomLevel });
    }

    window.setZoom = function(z) {
      zoomLevel = Math.max(1, Math.min(z, 5));
      if (zoomLevel === 1) { panX = 0; panY = 0; }
      applyTransform();
      sendMessage({ type: 'zoomChange', zoom: zoomLevel });
    };

    function getPinchDist(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function renderPage(num) {
      if (rendering) return;
      rendering = true;
      currentPage = Math.max(1, Math.min(num, totalPages));
      resetZoom();

      pdfDoc.getPage(currentPage).then(function(page) {
        var cw = containerEl.clientWidth;
        var ch = containerEl.clientHeight;
        var vp = page.getViewport({ scale: 1 });

        var scaleW = cw / vp.width;
        var scaleH = ch / vp.height;
        var scale = Math.min(scaleW, scaleH);

        var dpr = window.devicePixelRatio || 1;
        var renderScale = Math.min(dpr, 2.5);
        var viewport = page.getViewport({ scale: scale });

        canvas.width = viewport.width * renderScale;
        canvas.height = viewport.height * renderScale;
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';

        ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);

        page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function() {
          rendering = false;
          sendMessage({ type: 'pageChange', page: currentPage, total: totalPages });
        });
      });
    }

    window.goToPage = function(num) { renderPage(num); };

    // Touch handlers
    containerEl.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        isPinching = true;
        isSingleTouch = false;
        lastPinchDist = getPinchDist(e.touches);
        pinchBaseZoom = zoomLevel;
        pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        lastPanX = pinchMidX;
        lastPanY = pinchMidY;
      } else if (e.touches.length === 1) {
        isSingleTouch = true;
        isPinching = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        lastPanX = e.touches[0].clientX;
        lastPanY = e.touches[0].clientY;
      }
    }, { passive: true });

    containerEl.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        isPinching = true;
        isSingleTouch = false;
        var dist = getPinchDist(e.touches);
        var newZoom = pinchBaseZoom * (dist / lastPinchDist);
        zoomLevel = Math.max(1, Math.min(newZoom, 5));
        var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        if (zoomLevel > 1) {
          panX += midX - lastPanX;
          panY += midY - lastPanY;
        } else {
          panX = 0; panY = 0;
        }
        lastPanX = midX;
        lastPanY = midY;
        applyTransform();
      } else if (e.touches.length === 1 && zoomLevel > 1 && !isPinching) {
        var dx = e.touches[0].clientX - lastPanX;
        var dy = e.touches[0].clientY - lastPanY;
        panX += dx;
        panY += dy;
        lastPanX = e.touches[0].clientX;
        lastPanY = e.touches[0].clientY;
        applyTransform();
        isSingleTouch = false;
      }
    }, { passive: true });

    containerEl.addEventListener('touchend', function(e) {
      if (isPinching) {
        isPinching = false;
        if (zoomLevel <= 1.05) resetZoom();
        else sendMessage({ type: 'zoomChange', zoom: zoomLevel });
        return;
      }

      if (!isSingleTouch) return;

      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      var dt = Date.now() - touchStartTime;
      var absDx = Math.abs(dx);
      var absDy = Math.abs(dy);

      // Double-tap detection
      if (absDx < 15 && absDy < 15 && dt < 300) {
        var now = Date.now();
        if (window._lastTapTime && (now - window._lastTapTime) < 350) {
          if (zoomLevel > 1.1) {
            resetZoom();
          } else {
            zoomLevel = 2.5; panX = 0; panY = 0;
            applyTransform();
            sendMessage({ type: 'zoomChange', zoom: zoomLevel });
          }
          window._lastTapTime = 0;
          return;
        }
        window._lastTapTime = now;
        sendMessage({ type: 'tap' });
        return;
      }

      // Swipe only when not zoomed
      if (zoomLevel <= 1.05 && absDx > 50 && absDx > absDy * 1.5) {
        if (dx < 0 && currentPage < totalPages) renderPage(currentPage + 1);
        else if (dx > 0 && currentPage > 1) renderPage(currentPage - 1);
      }
    }, { passive: true });

    // Load PDF via XHR — works because this HTML is loaded from file:// origin
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PDF_FILE_URI, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status !== 200 && xhr.status !== 0) {
        loadingEl.innerHTML = '<div style="color:#f44;">Failed to load PDF (HTTP ' + xhr.status + ')</div>';
        return;
      }
      var uint8 = new Uint8Array(xhr.response);
      pdfjsLib.getDocument({ data: uint8 }).promise.then(function(pdf) {
        pdfDoc = pdf;
        totalPages = pdf.numPages;
        loadingEl.style.display = 'none';
        sendMessage({ type: 'ready', total: totalPages });
        renderPage(1);
      }).catch(function(err) {
        loadingEl.innerHTML = '<div style="color:#f44;">Failed to load: ' + err.message + '</div>';
      });
    };
    xhr.onerror = function() {
      loadingEl.innerHTML = '<div style="color:#f44;">Failed to fetch PDF file</div>';
    };
    xhr.send();
  </script>
</body>
</html>`;
  };

  const goToPage = (page) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`goToPage(${page}); true;`);
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.5, 5);
    setZoomLevel(newZoom);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`setZoom(${newZoom}); true;`);
    }
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`setZoom(${newZoom}); true;`);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`setZoom(1); true;`);
    }
  };

  const toggleControls = () => setControlsVisible(prev => !prev);

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'pageChange') {
        setCurrentPage(data.page);
        setTotalPages(data.total);
        setZoomLevel(1);
        setControlsVisible(true);
      } else if (data.type === 'ready') {
        setTotalPages(data.total);
        setControlsVisible(true);
      } else if (data.type === 'tap') {
        toggleControls();
      } else if (data.type === 'zoomChange') {
        setZoomLevel(Math.round(data.zoom * 10) / 10);
        setControlsVisible(true);
      }
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading presentation...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.centered}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.textLight} />
          <Text style={styles.errorTitle}>Unable to load presentation</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadPdf} activeOpacity={0.7}>
            <Icon name="refresh" size={18} color="#FFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!htmlFileUri || !pdfJs) return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Preparing viewer...</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <WebView
        ref={webViewRef}
        source={{ uri: htmlFileUri }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        onMessage={onMessage}
        scrollEnabled={false}
        bounces={false}
      />

      {/* Overlay Controls */}
      {controlsVisible && (
        <>
          {/* Top bar — close + title */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topCloseBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.topTitle} numberOfLines={1}>{title || 'Presentation'}</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Bottom bar — page nav + zoom */}
          <View style={styles.bottomBar}>
            {/* Zoom controls — left side */}
            <View style={styles.zoomGroup}>
              <TouchableOpacity
                style={[styles.zoomBtn, zoomLevel <= 1 && styles.navBtnDisabled]}
                onPress={zoomOut}
                activeOpacity={0.7}>
                <Icon name="magnify-minus-outline" size={22} color={zoomLevel > 1 ? '#FFF' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetZoom} activeOpacity={0.7}>
                <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.zoomBtn, zoomLevel >= 5 && styles.navBtnDisabled]}
                onPress={zoomIn}
                activeOpacity={0.7}>
                <Icon name="magnify-plus-outline" size={22} color={zoomLevel < 5 ? '#FFF' : '#666'} />
              </TouchableOpacity>
            </View>

            {/* Page nav — right side */}
            <View style={styles.navGroup}>
              <TouchableOpacity
                style={[styles.navBtn, currentPage <= 1 && styles.navBtnDisabled]}
                onPress={() => currentPage > 1 && goToPage(currentPage - 1)}
                activeOpacity={0.7}>
                <Icon name="chevron-left" size={28} color={currentPage > 1 ? '#FFF' : '#666'} />
              </TouchableOpacity>

              <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>

              <TouchableOpacity
                style={[styles.navBtn, currentPage >= totalPages && styles.navBtnDisabled]}
                onPress={() => currentPage < totalPages && goToPage(currentPage + 1)}
                activeOpacity={0.7}>
                <Icon name="chevron-right" size={28} color={currentPage < totalPages ? '#FFF' : '#666'} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#000',
  },
  loadingText: { fontSize: 15, color: '#aaa', marginTop: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginTop: 16 },
  errorText: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 20,
  },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  closeBtn: { marginTop: 16 },
  closeBtnText: { fontSize: 15, fontWeight: '600', color: '#aaa' },

  // Top overlay
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 10, paddingBottom: 12, paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topCloseBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: {
    flex: 1, fontSize: 16, fontWeight: '700', color: '#FFF', textAlign: 'center',
  },

  // Bottom overlay
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // Zoom controls
  zoomGroup: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  zoomBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  zoomText: {
    fontSize: 13, fontWeight: '700', color: '#FFF',
    minWidth: 44, textAlign: 'center',
  },

  // Page nav
  navGroup: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  navBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.05)' },
  pageText: {
    fontSize: 15, fontWeight: '700', color: '#FFF', minWidth: 56, textAlign: 'center',
  },
});

export default PresentationViewerScreen;
