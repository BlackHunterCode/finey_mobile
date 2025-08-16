/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela de Aprendizado e Curiosidades.
 */

import UIButton from '@/components/UI/UIButton';
import UICard from '@/components/UI/UICard';
import UIIcon from '@/components/UI/UIIcon';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LearnScreen() {
  const { theme, isDark } = useAppTheme();
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  // Dados de feedback dos usuários
  const feedbacks = [
    {
      name: "Maria Silva",
      photo: require('@/assets/images/finey/finey_rico.png'),
      text: "O Finey me ajudou a organizar minhas finanças e finalmente consegui juntar dinheiro para minha viagem dos sonhos!",
      rating: 5
    },
    {
      name: "João Oliveira",
      photo: require('@/assets/images/finey/hunter_sentado.png'),
      text: "Nunca entendi muito de investimentos, mas com o Finey consegui começar a investir de forma simples e segura.",
      rating: 5
    },
    {
      name: "Ana Costa",
      photo: require('@/assets/images/finey/finey_rico.png'),
      text: "Finalmente consigo ver para onde vai meu dinheiro! O app é muito intuitivo e as dicas são excelentes.",
      rating: 4
    }
  ];

  // Função para renderizar ícones com gradiente
  const renderIcon = (name: React.ComponentProps<typeof Ionicons>['name'], backgroundLightColor: string[]) => {
    return (
      isDark ? (
        <UIIcon 
          useGradient
          withBackground
          backgroundSize={50}
          gradientColors={['#323232', '#111111']}
          name={name}
          color={theme.colors.primary}
          size={24}
        />
      ) : (
        <UIIcon 
          useGradient
          withBackground
          backgroundSize={50}
          gradientColors={backgroundLightColor}
          name={name}
          color={"#FFF"}
          size={24}
        />
      )
    )
  }

  // Função para navegar para o onboarding
  const startOnboarding = () => {
    // Aqui você implementaria a navegação para o onboarding
    console.log("Iniciando onboarding");
  };

  // Função para avançar para o próximo feedback
  const nextFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) => 
      prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Função para voltar ao feedback anterior
  const prevFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) => 
      prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
    );
  };

  // Renderizar estrelas de avaliação
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={16} 
          color={i <= rating ? "#FFC300" : theme.colors.muted} 
          style={{marginRight: 2}}
        />
      );
    }
    return stars;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.muted,
      textAlign: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    cardText: {
      flex: 1,
    },
    onboardingCard: {
      marginVertical: 10,
    },
    onboardingContent: {
      alignItems: 'center',
      padding: 10,
    },
    onboardingImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 16,
    },
    onboardingText: {
      textAlign: 'center',
      marginBottom: 16,
    },
    feedbackCard: {
      marginVertical: 10,
      padding: 10,
    },
    feedbackHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    feedbackAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    feedbackUser: {
      flex: 1,
    },
    feedbackName: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    feedbackStars: {
      flexDirection: 'row',
    },
    feedbackText: {
      marginBottom: 10,
      fontStyle: 'italic',
    },
    feedbackNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    navButton: {
      padding: 8,
    },
    curiosityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      padding: 10,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
    },
    curiosityIcon: {
      marginRight: 10,
    },
    curiosityText: {
      flex: 1,
    },
    gradientCard: {
      borderRadius: 8,
      padding: 16,
      marginVertical: 10,
    },
    gradientCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    gradientCardText: {
      flex: 1,
      color: '#FFFFFF',
    },
    gradientCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
  });

  return (
    <WRScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <WRText style={styles.title}>Aprenda com o Finey</WRText>
          <WRText style={styles.subtitle}>Descubra como o Finey pode transformar sua vida financeira</WRText>
        </View>

        {/* Seção sobre o App */}
        <WRText style={styles.sectionTitle}>O que é o Finey?</WRText>
        <UICard>
          <View style={styles.cardContent}>
            {renderIcon('wallet-outline', ['#933BF2', '#570BA9'])}
            <View style={styles.cardText}>
              <WRText style={{fontWeight: 'bold', marginBottom: 4}}>Seu assistente financeiro pessoal</WRText>
              <WRText>O Finey é um aplicativo que ajuda você a controlar suas finanças, visualizar gastos, planejar investimentos e tomar decisões financeiras mais inteligentes.</WRText>
            </View>
          </View>
        </UICard>

        <LinearGradient
          colors={['#6823D1', '#46198B']}
          style={styles.gradientCard}
        >
          <View style={styles.gradientCardContent}>
            <UIIcon 
              name="trending-up-outline"
              size={24}
              color="#FFFFFF"
              style={{marginRight: 16}}
            />
            <View style={styles.gradientCardText}>
              <WRText style={styles.gradientCardTitle}>Organize suas finanças</WRText>
              <WRText style={{color: '#FFFFFF'}}>Visualize seus gastos, receba insights personalizados e planeje seu futuro financeiro com facilidade.</WRText>
            </View>
          </View>
        </LinearGradient>

        {/* Seção de Onboarding */}
        <WRText style={styles.sectionTitle}>Conheça o Finey</WRText>
        <UICard style={styles.onboardingCard}>
          <View style={styles.onboardingContent}>
            <Image 
              source={require('@/assets/images/finey/finey_rico.png')} 
              style={styles.onboardingImage}
              resizeMode="contain"
            />
            <WRText style={styles.onboardingText}>Faça um tour pelo aplicativo e descubra todas as funcionalidades disponíveis para você.</WRText>
            <UIButton 
              text="Iniciar Tour"
              icon="play-circle-outline"
              onPress={startOnboarding}
            />
          </View>
        </UICard>

        {/* Seção de Curiosidades */}
        <WRText style={styles.sectionTitle}>Curiosidades Financeiras</WRText>
        
        <View style={styles.curiosityItem}>
          <UIIcon 
            name="bulb-outline"
            color={theme.colors.primary}
            size={24}
            style={styles.curiosityIcon}
          />
          <WRText style={styles.curiosityText}>Sabia que economizar apenas 10% do seu salário mensalmente pode gerar uma reserva significativa em 5 anos?</WRText>
        </View>

        <View style={styles.curiosityItem}>
          <UIIcon 
            name="bulb-outline"
            color={theme.colors.primary}
            size={24}
            style={styles.curiosityIcon}
          />
          <WRText style={styles.curiosityText}>Investir em renda fixa pode ser mais seguro que a poupança e render até 3x mais ao longo do tempo.</WRText>
        </View>

        <View style={styles.curiosityItem}>
          <UIIcon 
            name="bulb-outline"
            color={theme.colors.primary}
            size={24}
            style={styles.curiosityIcon}
          />
          <WRText style={styles.curiosityText}>A regra 50-30-20 sugere usar 50% da renda para necessidades, 30% para desejos e 20% para poupar.</WRText>
        </View>

        {/* Seção de Feedbacks */}
        <WRText style={styles.sectionTitle}>O que nossos usuários dizem</WRText>
        <UICard style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Image 
              source={feedbacks[currentFeedbackIndex].photo} 
              style={styles.feedbackAvatar}
            />
            <View style={styles.feedbackUser}>
              <WRText style={styles.feedbackName}>{feedbacks[currentFeedbackIndex].name}</WRText>
              <View style={styles.feedbackStars}>
                {renderStars(feedbacks[currentFeedbackIndex].rating)}
              </View>
            </View>
          </View>
          <WRText style={styles.feedbackText}>"{feedbacks[currentFeedbackIndex].text}"</WRText>
          <View style={styles.feedbackNavigation}>
            <TouchableOpacity onPress={prevFeedback} style={styles.navButton}>
              <UIIcon name="chevron-back-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextFeedback} style={styles.navButton}>
              <UIIcon name="chevron-forward-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </UICard>
      </View>
    </WRScreenContainer>
  );
}