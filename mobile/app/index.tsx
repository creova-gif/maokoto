import { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_URL } from '../config';

export default function HomeScreen() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationStateChange = useCallback((state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  }, []);

  const handleLoad = useCallback(() => setLoading(false), []);
  const handleError = useCallback(() => { setLoading(false); setError(true); }, []);
  const handleReload = useCallback(() => {
    setError(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!error ? (
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          style={styles.webview}
          onLoadEnd={handleLoad}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled
          domStorageEnabled
          allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
          pullToRefreshEnabled
          cacheEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          onShouldStartLoadWithRequest={() => true}
          userAgent={`PesaPlan/1.0 (${Platform.OS})`}
          injectedJavaScript={`
            // Suppress console logs in production
            window.__PESAPLAN_NATIVE__ = true;
            window.__PESAPLAN_PLATFORM__ = '${Platform.OS}';
            true;
          `}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>No Connection</Text>
          <Text style={styles.errorSubtitle}>
            Check your internet and try again
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !error && (
        <View style={styles.splashOverlay}>
          <View style={styles.splashCard}>
            <Text style={styles.splashEmoji}>💰</Text>
            <Text style={styles.splashTitle}>PesaPlan</Text>
            <Text style={styles.splashSub}>Dhibiti pesa zako</Text>
            <ActivityIndicator
              size="small"
              color="#059669"
              style={{ marginTop: 24 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  webview: {
    flex: 1,
    backgroundColor: '#030712',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  splashCard: {
    alignItems: 'center',
  },
  splashEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  splashSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 6,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
