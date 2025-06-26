// integrators/PluggyIntegratorWebView.tsx

import FinancialIntegratorWebView from '@/types/FinancialIntegratorWebView';
import { JSX } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export class PluggyIntegratorWebView implements FinancialIntegratorWebView {
  public connect({ connectToken, onSuccess, onError }: {
      connectToken: string;
      onSuccess: (itemId: string) => void;
      onError?: (error: any) => void;
    }): JSX.Element {
    const widgetUrl = `https://connect.pluggy.ai/?connectToken=${connectToken}`;

    const injectedJavaScript = `
      window.addEventListener("message", function(event) {
        if (event.data.type === "success") {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "success", itemId: event.data.itemId }));
        } else if (event.data.type === "error") {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error", error: event.data.error }));
        }
      });
      true;
    `;

    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: widgetUrl }}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'success') {
                onSuccess(data.itemId);
              } else if (data.type === 'error') {
                onError?.(data.error);
              }
            } catch (err) {
              console.error('Error parsing message from Pluggy:', err);
            }
          }}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" color="#000" />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
