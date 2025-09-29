import { useAppTheme } from '@/context/theme-context';
import { Props } from '@/types/JSXTypes';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
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
      const currentPosition = tabPositions[activeTabId];
      const currentWidth = tabWidths[activeTabId];
      
      // Centraliza a tab ativa no scroll view primeiro
      if (scrollViewRef.current && scrollableTabs) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, currentPosition - windowWidth / 2 + currentWidth / 2),
          animated: true
        });
        
        // Pequeno atraso para garantir que o scroll foi concluído antes de animar o indicador
        setTimeout(() => {
          // Atualiza a posição e largura do indicador com animação
          indicatorPosition.value = withSpring(currentPosition, {
            damping: 20,
            stiffness: 90,
          });
          indicatorWidth.value = withSpring(currentWidth, {
            damping: 20,
            stiffness: 90,
          });
        }, 50);
      } else {
        // Atualiza imediatamente se não houver scroll
        indicatorPosition.value = withSpring(currentPosition, {
          damping: 20,
          stiffness: 90,
        });
        indicatorWidth.value = withSpring(currentWidth, {
          damping: 20,
          stiffness: 90,
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
  }, [activeTabId, tabPositions, tabWidths, indicatorPosition, indicatorWidth, contentTranslateX, windowWidth, tabs, scrollableTabs, animationDuration, onTabChange]);
  
  // Estilo animado para o indicador
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
      // Garantindo que o indicador fique visível e bem posicionado
      position: 'absolute',
      bottom: 0,
      height: 3,
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      zIndex: 1,
      ...(indicatorStyle as object || {})
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
    // Armazena a largura da tab
    setTabWidths(prev => ({ ...prev, [tabId]: width }));
    
    // Armazena a posição da tab
    setTabPositions(prev => ({ ...prev, [tabId]: x }));
    
    // Se for a tab ativa, atualiza imediatamente o indicador
    if (tabId === activeTabId) {
      indicatorPosition.value = x;
      indicatorWidth.value = width;
    }
  }, [activeTabId, indicatorPosition, indicatorWidth]);
  
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
      overflow: 'visible',
      zIndex: 1,
    },
    indicator: {
      position: 'absolute',
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      bottom: 0,
      left: 0,
      ...(indicatorStyle as ViewStyle),
    },
    contentContainer: {
      width: tabs.length * windowWidth,
      flexDirection: 'row',
    },
    pageContainer: {
      width: windowWidth,
    },
  }), [style, tabsContainerStyle, tabStyle, activeTabStyle, tabTextStyle, activeTabTextStyle, indicatorStyle, theme, tabs.length, windowWidth]);
  
  // Função para renderizar uma tab usando o ripple nativo
  const renderTab = useCallback((tab: TabItem, isFixed: boolean = false) => {
    return (
      <Pressable
        key={tab.id}
        style={[
          styles.tab,
          isFixed && { flex: 1 },
          activeTabId === tab.id && styles.activeTab,
        ]}
        onPress={() => handleTabPress(tab.id)}
        disabled={tab.disabled}
        onLayout={(e) => {
          const { width, x } = e.nativeEvent.layout;
          measureTab(tab.id, width, x);
        }}
        android_ripple={{ color: theme.colors.primary + '20' }} // Cor primária com 20% de opacidade
      >
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
  }, [activeTabId, handleTabPress, measureTab, styles, theme.colors.primary]);
  
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
            
            {showIndicator && (
              <Animated.View style={indicatorAnimatedStyle} />
            )}
          </ScrollView>
        ) : (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            {tabs.map((tab) => renderTab(tab, true))}
            
            {showIndicator && (
              <Animated.View style={indicatorAnimatedStyle} />
            )}
          </View>
        )}
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