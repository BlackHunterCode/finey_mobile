import { useSplashErrorMessage } from '@/context/splash-error-message-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ErrorScreen() {
  const router = useRouter();
  const { errorMessage, setErrorMessage } = useSplashErrorMessage();

  const handleBackToLogin = () => {
    setErrorMessage(null);
    router.replace('/unauthenticated/(stack)/login/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>😥</Text>
      <Text style={styles.title}>Ocorreu um erro</Text>
      <Text style={styles.message}>
        {errorMessage || 'Não foi possível concluir a operação. Tente novamente ou volte para a tela de login.'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
        <Text style={styles.buttonText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#d32f2f',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
