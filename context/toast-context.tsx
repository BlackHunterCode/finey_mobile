/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto para gerenciamento de toasts no aplicativo.
 */

import UIToast from '@/components/UI/UIToast';
import { TOAST_DURATION, ToastType } from '@/constants/constants.toast';
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

interface ToastContextData {
  showToast: (params: {
    message: string;
    type?: ToastType;
    duration?: number;
    traceId?: string; // Adicionando traceId
    action?: {
      label: string;
      onPress: () => void;
    };
    suport?: {
      errorObject: any;
    };
  }) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>(ToastType.NOTIFICATION);
  const [duration, setDuration] = useState(TOAST_DURATION);
  const [traceId, setTraceId] = useState<string | undefined>(undefined); // Adicionando estado para traceId
  const [action, setAction] = useState<{ label: string; onPress: () => void } | undefined>(undefined);
  const [suport, setSuport] = useState<{ errorObject: any } | undefined>(undefined);

  const showToast = ({
    message,
    type = ToastType.NOTIFICATION,
    duration = TOAST_DURATION,
    traceId,
    action,
    suport
  }: {
    message: string;
    type?: ToastType;
    duration?: number;
    traceId?: string;
    action?: {
      label: string;
      onPress: () => void;
    };
    suport?: {
      errorObject: any;
    };
  }) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setTraceId(traceId);
    setAction(action);
    setVisible(true);
    setSuport(suport);

    if(suport) {
      // enviar para o suporte por email ou API.
      Alert.alert(`Enviando erro: ${suport.errorObject} para suporte do aplicativo.`);
    }
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <UIToast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        traceId={traceId} // Passando o traceId para o componente
        onClose={hideToast}
        action={action}
        suport={suport}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}