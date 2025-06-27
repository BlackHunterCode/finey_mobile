import FinancialIntegratorWebView from '@/types/FinancialIntegratorWebView';
import { Item } from 'pluggy-js';
import { JSX, useState, useEffect } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ConnectEventPayload } from 'react-native-pluggy-connect';
import { PluggyConnect } from 'react-native-pluggy-connect';

const PluggyConnectComponent: React.FC<{
  connectToken: string;
  onSuccess: (itemId: string) => void;
  onError?: (error: any) => void;
}> = ({ connectToken, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleSuccess = (data: { item: Item } | string) => {
    if (typeof data === 'string' && data === 'USER_DISMISSED') {
      return;
    }
    
    const itemData = data as { item: Item };
    if (itemData?.item?.id) {
      onSuccess(itemData.item.id);
    } else {
      onError?.(new Error('No item ID received from Pluggy Connect'));
    }
  };

  const handleError = (error: { message: string; data?: { item: Item } }) => {
    onError?.(new Error(error.message || 'An error occurred with Pluggy Connect'));
  };

  const handleOpen = () => {
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsLoading(false);
    onSuccess?.('USER_DISMISSED');
  };

  type PluggyEvent = {
    event: 'SUBMITTED_CONSENT' | 'LOGIN_SUCCESS' | 'ITEM_RESPONSE' | 'LOGIN_STEP_COMPLETED' | 
          'SUBMITTED_LOGIN' | 'SUBMITTED_MFA' | 'SELECTED_INSTITUTION' | 'LOGIN_MFA_SUCCESS' |
          'USER_CANCELLED' | 'WIDGET_CLOSED' | 'USER_DENIED_CONSENT' | string;
    [key: string]: any;
  };

  const handleEvent = (event: PluggyEvent) => {
    switch (event.event) {
      case 'ITEM_RESPONSE':
      case 'LOGIN_STEP_COMPLETED':
        setIsLoading(false);
        break;
      case 'SUBMITTED_CONSENT':
      case 'SUBMITTED_LOGIN':
      case 'SUBMITTED_MFA':
        // Keep loading for these events
        break;
      default:
        // For all other events, hide loading indicator
        setIsLoading(false);
    }
  };

  // Add a timeout to handle cases where the widget fails to load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        const errorMsg = 'Pluggy Connect widget took too long to load. Please check your internet connection and try again.';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(new Error(errorMsg));
      }
    }, 60000); // 60 seconds timeout

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, onError]);
  
  const handleClosePress = () => {
    handleClose();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClosePress}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              console.log('Retry button pressed');
              setError(null);
              setIsLoading(true);
              // Re-initialize the component
            }}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <PluggyConnect
            connectToken={connectToken}
            onSuccess={handleSuccess}
            onError={handleError}
            onOpen={handleOpen}
            onClose={handleClose}
            onEvent={handleEvent}
            language="pt"
            // Enable sandbox in development
            includeSandbox={__DEV__}
            // Optional: Uncomment and configure these as needed
            // theme="light"
            // connectorTypes={[]}
            // countries={['BR']}
          />
        </View>
      )}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Conectando ao banco...</Text>
        </View>
      )}
    </View>
  );
};

export class PluggyIntegratorWebView implements FinancialIntegratorWebView {
  public connect({ connectToken, onSuccess, onError }: {
    connectToken: string;
    onSuccess: (itemId: string) => void;
    onError?: (error: any) => void;
  }): JSX.Element {
    return (
      <PluggyConnectComponent 
        connectToken={connectToken} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
