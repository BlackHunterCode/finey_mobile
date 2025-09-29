import { useAppTheme } from '@/context/theme-context';
import { Props } from '@/types/JSXTypes';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import WRText from '../wrappers/WRText';

interface TabItem {
  /**
   * Identificador único da tab
   */
  id: string;
  
  /**
   * Título da tab
   */
  title: string;
  
  /**
   * Conteúdo da tab
   */
  content: ReactNode;
  
  /**
   * Se a tab está desabilitada
   * @default false
   */
  disabled?: boolean;
}

interface UIPageManProps extends Omit<Props, 'children'> {
  /**
   * Conteúdo opcional para o componente
   */
  children?: React.ReactNode;
  /**
   * Lista de tabs a serem exibidas
   */
  tabs: TabItem[];
  
  /**
   * ID da tab inicialmente selecionada
   * @default primeira tab da lista
   */
  initialTabId?: string;
  
  /**
   * Callback chamado quando uma tab é selecionada
   */
  onTabChange?: (tabId: string) => void;
  
  /**
   * Estilo adicional para o container das tabs
   */
  tabsContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Estilo adicional para cada tab
   */
  tabStyle?: StyleProp<ViewStyle>;
  
  /**
   * Estilo adicional para a tab selecionada
   */
  activeTabStyle?: StyleProp<ViewStyle>;
  
  /**
   * Estilo adicional para o texto da tab
   */
  tabTextStyle?: StyleProp<ViewStyle>;
  
  /**
   * Estilo adicional para o texto da tab selecionada
   */
  activeTabTextStyle?: StyleProp<ViewStyle>;
  
  /**
   * Se deve mostrar o indicador de tab ativa
   * @default true
   */
  showIndicator?: boolean;
  
  /**
   * Estilo adicional para o indicador de tab ativa
   */
  indicatorStyle?: StyleProp<ViewStyle>;
  
  /**
   * Se deve permitir scroll horizontal nas tabs
   * @default true
   */
  scrollableTabs?: boolean;
  
  /**
   * Se deve animar a transição entre tabs
   * @default true
   */
  animateTransition?: boolean;
  
  /**
   * Duração da animação de transição em milissegundos
   * @default 300
   */
  animationDuration?: number;
}

/**
 * Componente de tabs com paginação que segue o padrão de design da aplicação
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UIPageMan({
  tabs,
  initialTabId,
  onTabChange,
  style,
  tabsContainerStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  showIndicator = true,
  indicatorStyle,
  scrollableTabs = true,
  animateTransition = true,
  animationDuration = 300,
  children
}: UIPageManProps) {
  const { theme } = useAppTheme();
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId || (tabs.length > 0 ? tabs[0].id : ''));
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabPositions, setTabPositions] = useState<{ [key: string]: number }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const windowWidth = Dimensions.get('window').width;
  
  // Valores animados
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);
  
  // Atualiza a posição do indicador quando a tab ativa muda
  useEffect(() => {
    if (tabPositions[activeTabId] !== undefined && tabWidths[activeTabId] !== undefined) {
      // Anima o indicador para a posição da tab ativa
      indicatorPosition.value = withSpring(tabPositions[activeTabId], {
        damping: 20,
        stiffness: 90,
      });
      indicatorWidth.value = withSpring(tabWidths[activeTabId], {
        damping: 20,
        stiffness: 90,
      });
      
      // Centraliza a tab ativa no scroll view
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, tabPositions[activeTabId] - windowWidth / 2 + tabWidths[activeTabId] / 2),
          animated: true
        });
      }
      
      // Atualiza a posição do conteúdo
      const tabIndex = tabs.findIndex(tab => tab.id === activeTabId);
      if (animateTransition) {
        contentTranslateX.value = withTiming(-tabIndex * windowWidth, {
          duration: animationDuration,
        });
      } else {
        contentTranslateX.value = -tabIndex * windowWidth;
      }
      
      // Chama o callback se existir
      if (onTabChange) {
        onTabChange(activeTabId);
      }
    }
  }, [activeTabId, tabPositions, tabWidths, indicatorPosition, indicatorWidth, contentTranslateX, windowWidth]);
  
  // Estilo animado para o indicador
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
    };
  });
  
  // Estilo animado para o conteúdo
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: contentTranslateX.value }],
    };
  });
  
  // Função para mudar a tab ativa com feedback tátil
  const handleTabPress = useCallback((tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    
    // Efeito de feedback tátil sutil
    const pressedTab = tabPositions[tabId];
    if (pressedTab !== undefined) {
      // Pequena animação de pressionar
      const tabIndex = tabs.findIndex(tab => tab.id === tabId);
      const targetPosition = -tabIndex * windowWidth;
      
      // Animação sutil ao trocar de tab
      if (animateTransition) {
        contentTranslateX.value = withTiming(targetPosition, {
          duration: animationDuration,
        });
      } else {
        contentTranslateX.value = targetPosition;
      }
    }
    
    setActiveTabId(tabId);
  }, [tabs, tabPositions, contentTranslateX, windowWidth, animateTransition, animationDuration]);

  
  // Função para medir a largura e posição de cada tab
  const measureTab = useCallback((tabId: string, width: number, x: number) => {
    setTabWidths(prev => ({ ...prev, [tabId]: width }));
    setTabPositions(prev => ({ ...prev, [tabId]: x }));
  }, []);
  
  // Memoize styles para melhorar a performance
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
      ...(style as ViewStyle),
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      ...(tabsContainerStyle as ViewStyle),
    },
    tabsScrollView: {
      flexGrow: 0,
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      ...(tabStyle as ViewStyle),
    },
    activeTab: {
      ...(activeTabStyle as ViewStyle),
    },
    tabText: {
      color: theme.colors.muted,
      fontSize: 14,
      fontWeight: '500',
      ...(tabTextStyle as any),
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: '600',
      ...(activeTabTextStyle as any),
    },
    disabledTabText: {
      color: theme.colors.muted,
      opacity: 0.5,
    },
    indicatorContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 3,
      width: '100%',
    },
    indicator: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      ...(indicatorStyle as ViewStyle),
    },
    contentContainer: {
      width: tabs.length * windowWidth,
      flexDirection: 'row',
    },
    pageContainer: {
      width: windowWidth,
    },
    ripple: {
      position: 'absolute',
      backgroundColor: theme.colors.primary,
      opacity: 0.12,
      borderRadius: 100,
      overflow: 'hidden', // Garantir que o ripple não ultrapasse seus limites
    },
  }), [style, tabsContainerStyle, tabStyle, activeTabStyle, tabTextStyle, activeTabTextStyle, indicatorStyle, theme, tabs.length, windowWidth]);
  
  // Função para renderizar uma tab com efeito de ripple
  const renderTab = useCallback((tab: TabItem, isFixed: boolean = false) => {
    const [rippleVisible, setRippleVisible] = useState(false);
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
    const rippleSize = useSharedValue(0);
    const rippleOpacity = useSharedValue(0);
    
    // Garantir que temos acesso à largura da tab mais atualizada
    const currentTabWidth = tabWidths[tab.id];
    
    const handlePressIn = (event: any) => {
      if (tab.disabled) return;
      
      // Posição do toque relativa ao componente
      const { locationX, locationY } = event.nativeEvent;
      
      // Obtém a largura da tab para limitar o tamanho do ripple
      // Garantir que temos um valor válido para a largura da tab
      const tabWidth = currentTabWidth || 100;
      
      // Calcula o tamanho máximo do ripple para que não ultrapasse os limites da tab
      // Reduzindo para que o ripple fique totalmente contido na tab
      const maxRippleSize = Math.min(tabWidth * 0.25, 40);
      
      // Ajusta a posição do ripple para garantir que fique totalmente contido na tab
      // Limita a posição X para que o ripple não ultrapasse as bordas laterais
      const safeX = Math.max(Math.min(locationX, tabWidth - maxRippleSize/2), maxRippleSize/2);
      // Limita também a posição Y para garantir contenção vertical
      const safeY = Math.max(Math.min(locationY, 24 - maxRippleSize/2), maxRippleSize/2);
      
      setRipplePosition({ x: safeX, y: safeY });
      setRippleVisible(true);
      
      rippleSize.value = 0;
      rippleOpacity.value = 0.003;
      
      rippleSize.value = withTiming(maxRippleSize, { 
        duration: 60,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      rippleOpacity.value = withTiming(0, { 
        duration: 60,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    };
    
    const rippleStyle = useAnimatedStyle(() => {
      return {
        width: rippleSize.value,
        height: rippleSize.value,
        borderRadius: rippleSize.value / 2,
        opacity: rippleOpacity.value,
        transform: [
          { translateX: -rippleSize.value / 2 },
          { translateY: -rippleSize.value / 2 },
        ],
        left: ripplePosition.x,
        top: ripplePosition.y,
      };
    });
    
    return (
      <Pressable
        key={tab.id}
        style={[
          styles.tab,
          isFixed && { flex: 1 },
          activeTabId === tab.id && styles.activeTab,
          { overflow: 'hidden' }, // Garantir que o ripple fique contido na tab
        ]}
        onPress={() => handleTabPress(tab.id)}
        onPressIn={handlePressIn}
        disabled={tab.disabled}
        onLayout={(e) => {
          const { width, x } = e.nativeEvent.layout;
          measureTab(tab.id, width, x);
        }}
        android_ripple={{ color: 'transparent' }}
      >
        {rippleVisible ? (
          <Animated.View style={[styles.ripple, rippleStyle]} />
        ) : (<></>)}
        <WRText
          style={[
            styles.tabText,
            activeTabId === tab.id && styles.activeTabText,
            tab.disabled && styles.disabledTabText,
          ]}
        >
          {tab.title}
        </WRText>
      </Pressable>
    );
  }, [activeTabId, handleTabPress, styles, tabWidths]);
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {scrollableTabs ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollView}
          >
            {tabs.map((tab) => renderTab(tab))}
          </ScrollView>
        ) : (
          tabs.map((tab) => renderTab(tab, true))
        )}
        
        {showIndicator ? (
          <View style={styles.indicatorContainer}>
            <Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />
          </View>
        ) : (<></>)}
      </View>
      
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        {tabs.map((tab) => (
          <View key={tab.id} style={styles.pageContainer}>
            {tab.content}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}