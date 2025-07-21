/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Componente de Toast para exibição de mensagens sobrepostas.
 */

import { ToastType } from '@/constants/constants.toast';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface UIToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  traceId?: string;
  suport?: {
    errorObject: any;
  };
}

export default function UIToast({
  visible,
  message,
  type = ToastType.NOTIFICATION,
  duration = 3000,
  onClose,
  action,
  traceId,
  suport
}: UIToastProps) {
  const { theme } = useAppTheme();
  const [isVisible, setIsVisible] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  
  useEffect(() => {
    setIsVisible(visible);
    if (visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      // Auto-fechamento após a duração especificada (se não houver ação)
      if (!action) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [visible]);
  
  const handleClose = () => {
    // Animação de saída
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsVisible(false);
      if (onClose) onClose();
    });
  };
  
  // Configurações de estilo baseadas no tipo de toast
  const getToastStyles = (): { backgroundColor: string; iconName: string; iconColor: string } => {
    switch (type) {
      case ToastType.SUCCESS:
        return {
          backgroundColor: '#4CAF50', // Verde
          iconName: 'checkmark-circle',
          iconColor: '#FFFFFF'
        };
      case ToastType.WARNING:
        return {
          backgroundColor: '#FFC107', // Amarelo
          iconName: 'warning',
          iconColor: '#FFFFFF'
        };
      case ToastType.ERROR:
        return {
          backgroundColor: theme.colors.error,
          iconName: 'alert-circle',
          iconColor: '#FFFFFF'
        };
      case ToastType.NOTIFICATION:
      default:
        return {
          backgroundColor: '#2196F3', // Azul
          iconName: 'information-circle',
          iconColor: '#FFFFFF'
        };
    }
  };
  
  const toastStyles = getToastStyles();
  
  if (!isVisible) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }]
        }
      ]}
    >
      <View style={[styles.toast, { backgroundColor: toastStyles.backgroundColor }]}>
        <View style={styles.toastContent}>
          <View style={styles.contentContainer}>
            <Ionicons name={toastStyles.iconName as any} size={24} color={toastStyles.iconColor} />
            <Text style={styles.message}>{message}</Text>
          </View>
          
          {action && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                action.onPress();
                handleClose();
              }}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
          
          <View>
            {/* Exibição do trace ID no footer */}
            {traceId && (
              <View style={styles.traceContainer}>
                <Text style={styles.traceText}>trace-id: {traceId}</Text>
              </View>
            )}

            {suport && (
              <View style={styles.suportContainer}>
                <Text style={styles.suportText}>O erro foi enviado para o suporte analisar.</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  toast: {
    width: width - 32,
    minHeight: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  toastContent: {
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  message: {
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500'
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-end',
    marginTop: 8
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14
  },
  traceContainer: {
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  suportContainer: {
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  traceText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400'
  },
  suportText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 'bold'
  }
});