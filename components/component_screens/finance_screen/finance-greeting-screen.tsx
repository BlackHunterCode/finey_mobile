import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Componente que exibe uma saudação elegante na tela de finanças
 * @returns React.JSX.Element
 */
export default function FinanceGreetingScreen() {
  const { theme } = useAppTheme();
  
  // Obter o nome do usuário (poderia vir de um contexto de autenticação)
  const userName = "Victor";
  
  // Obter a hora do dia para personalizar a saudação
  const currentHour = new Date().getHours();
  let greeting = "Bom dia";
  
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Boa tarde";
  } else if (currentHour >= 18) {
    greeting = "Boa noite";
  }

  return (
    <View style={styles.container}>
      <WRText style={[styles.greeting, { color: theme.colors.primary }]}>
        {greeting}, {userName}!
      </WRText>
      <WRText style={styles.description}>
        Aqui você encontra o controle completo das suas finanças: acompanhe suas transações bancárias, gerencie compromissos futuros e monitore o progresso das suas metas financeiras.
      </WRText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});