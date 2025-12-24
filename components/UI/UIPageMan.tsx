import { useAppTheme } from '@/context/theme-context';
import { Props } from '@/types/JSXTypes';
import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import WRText from '../wrappers/WRText';

export interface TabItem {
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

export interface UIPageManController {
  next: () => void;
  prev: () => void;
  select: (id: string) => void;
  getActiveId: () => string;
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
   * Se deve centralizar as tabs no container
   * @default false
   */
  centerTabs?: boolean;
  
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

  /**
   * Exibe setas de navegação laterais para avançar e voltar páginas
   * @default false
   */
  showNavigationArrows?: boolean;
  /**
   * Oculta completamente o cabeçalho de tabs (títulos e indicador)
   * @default false
   */
  hideTabsHeader?: boolean;
}

/**
 * Componente de tabs com paginação que segue o padrão de design da aplicação
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
const UIPageMan = forwardRef<UIPageManController, UIPageManProps>(function UIPageMan({
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
  centerTabs = false,
  animateTransition = true,
  animationDuration = 300,
  children,
  showNavigationArrows = false,
  hideTabsHeader = false
}: UIPageManProps, ref) {
  const { theme } = useAppTheme();
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId || (tabs.length > 0 ? tabs[0].id : ''));
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabPositions, setTabPositions] = useState<{ [key: string]: number }>({});
  const [tabRefs, setTabRefs] = useState<{ [key: string]: React.RefObject<View | null> }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const tabsContainerRef = useRef<View>(null);
  const windowWidth = Dimensions.get('window').width;
  const [scrollX, setScrollX] = useState(0);
  
  // Inicializa refs para cada tab
  useEffect(() => {
    const refs: { [key: string]: React.RefObject<View | null> } = {};
    tabs.forEach(tab => {
      refs[tab.id] = React.createRef<View | null>();
    });
    setTabRefs(refs as unknown as { [key: string]: React.RefObject<View> });
  }, [tabs]);
  
  // Valores animados
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);
  
  // Atualiza o indicador (se habilitado) quando medidas estiverem disponíveis
  useEffect(() => {
    const allMeasured = tabs.every(tab => tabWidths[tab.id] !== undefined && tabPositions[tab.id] !== undefined);
    if (!allMeasured) return;
    if (tabPositions[activeTabId] !== undefined && tabWidths[activeTabId] !== undefined) {
      const currentWidth = tabWidths[activeTabId];
      let currentPosition = tabPositions[activeTabId];
      if (scrollViewRef.current && scrollableTabs) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, currentPosition - windowWidth / 2 + currentWidth / 2),
          animated: true
        });
      }
      setTimeout(() => {
        indicatorPosition.value = withSpring(tabPositions[activeTabId] - (scrollableTabs ? scrollX : 0), {
          damping: 20,
          stiffness: 90,
        });
        indicatorWidth.value = withSpring(currentWidth, {
          damping: 20,
          stiffness: 90,
        });
      }, 50);
    }
  }, [activeTabId, tabPositions, tabWidths, indicatorPosition, indicatorWidth, windowWidth, tabs, scrollableTabs, scrollX]);

  // Atualiza a transição de conteúdo e dispara onTabChange independentemente de medições
  useEffect(() => {
    const tabIndex = tabs.findIndex(tab => tab.id === activeTabId);
    if (animateTransition) {
      contentTranslateX.value = withTiming(-tabIndex * windowWidth, {
        duration: animationDuration,
      });
    } else {
      contentTranslateX.value = -tabIndex * windowWidth;
    }
    if (onTabChange) {
      onTabChange(activeTabId);
    }
  }, [activeTabId, tabs, windowWidth, animateTransition, animationDuration, onTabChange]);

  const goToTabIndex = useCallback((index: number) => {
    if (index < 0 || index >= tabs.length) return;
    const id = tabs[index].id;
    setActiveTabId(id);
  }, [tabs]);

  const nextTab = useCallback(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTabId);
    goToTabIndex(currentIndex + 1);
  }, [activeTabId, tabs, goToTabIndex]);

  const prevTab = useCallback(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTabId);
    goToTabIndex(currentIndex - 1);
  }, [activeTabId, tabs, goToTabIndex]);

  useImperativeHandle(ref, () => ({
    next: nextTab,
    prev: prevTab,
    select: (id: string) => setActiveTabId(id),
    getActiveId: () => activeTabId,
  }), [nextTab, prevTab, activeTabId]);
  
  // Estilo animado para o indicador
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
      // Garantindo que o indicador fique visível e bem posicionado
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 3,
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      zIndex: 999, // Aumentado para garantir que fique acima de todos os outros elementos
      ...(typeof indicatorStyle === 'object' ? indicatorStyle : {})
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
    // Ajusta x somando scrollX quando ScrollView está ativo
    const adjustedX = scrollableTabs ? x + scrollX : x;
    setTabPositions(prev => ({ ...prev, [tabId]: adjustedX }));
    setTabWidths(prev => ({ ...prev, [tabId]: width }));
  }, [scrollableTabs, scrollX]);
  
  // Memoize styles para melhorar a performance
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      height: '100%',
      ...(style as ViewStyle),
    },
    arrow: {
      position: 'absolute',
      top: '45%',
      zIndex: 1000,
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 6,
      opacity: 0.8,
    },
    arrowLeft: {
      left: 8,
    },
    arrowRight: {
      right: 8,
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
      flex: 1,
      overflow: 'hidden'
    },
    pageContainer: {
      width: windowWidth,
      flex: 1,
      overflow: 'hidden'
    },
  }), [style, tabsContainerStyle, tabStyle, activeTabStyle, tabTextStyle, activeTabTextStyle, indicatorStyle, theme, tabs.length, windowWidth]);
  
  // Função para renderizar uma tab usando o ripple nativo
  const renderTab = useCallback((tab: TabItem, isFixed: boolean = false) => {
    return (
      <Pressable
        key={tab.id}
        style={[styles.tab, isFixed && { flex: 1 }, activeTabId === tab.id && styles.activeTab]}
        onPress={() => handleTabPress(tab.id)}
        disabled={tab.disabled}
        ref={tabRefs[tab.id]}
        onLayout={() => {
          // Medir posição relativa ao container das tabs (View)
          if (tabRefs[tab.id]?.current && tabsContainerRef.current) {
            tabRefs[tab.id]?.current?.measureLayout(
              tabsContainerRef.current,
              (x, y, width, height) => {
                measureTab(tab.id, width, x);
              },
              () => {}
            );
          }
        }}
        android_ripple={{ color: theme.colors.primary + '20' }}
      >
        <WRText
          style={[styles.tabText, activeTabId === tab.id && styles.activeTabText, tab.disabled && styles.disabledTabText]}
        >
          {tab.title}
        </WRText>
      </Pressable>
    );
  }, [activeTabId, handleTabPress, measureTab, styles, theme.colors.primary, tabRefs, scrollViewRef]);
  
  // Função para renderizar o indicador
  const renderIndicator = () => {
    if (!showIndicator) return null;
    
    return (
      <Animated.View 
        style={[
          styles.indicator,
          { 
            position: 'absolute', 
            bottom: 0,
            left: 0,
            height: 3,
            backgroundColor: theme.colors.primary,
            borderRadius: 3,
            zIndex: 999
          },
          indicatorAnimatedStyle
        ]} 
      />
    );
  };

  const currentIndex = tabs.findIndex(t => t.id === activeTabId);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= tabs.length - 1;

  return (
    <View style={styles.container}>
      {!hideTabsHeader && (
      <View style={styles.tabsContainer} ref={tabsContainerRef}>
        {scrollableTabs ? (
          <View style={{ width: '100%', position: 'relative' }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.tabsScrollView,
                centerTabs ? { flexGrow: 1, justifyContent: 'center' } : {}
              ]}
              onScroll={e => setScrollX(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={16}
            >
              {tabs.map((tab) => renderTab(tab))}
            </ScrollView>
            
            {renderIndicator()}
          </View>
        ) : (
          <View 
            style={{ 
              flexDirection: 'row', 
              width: '100%',
              position: 'relative',
              ...(centerTabs ? { justifyContent: 'center' } : {})
            }}
          >
            {tabs.map((tab) => renderTab(tab, true))}
            
            {renderIndicator()}
          </View>
        )}
      </View>
      )}
      
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}> 
        {tabs.map((tab) => (
          <View 
            key={tab.id} 
            style={styles.pageContainer}
          >
            {tab.content}
          </View>
        ))}
      </Animated.View>

      {showNavigationArrows && (
        <>
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft, isFirst && { opacity: 0.4 }]}
            onPress={prevTab}
            disabled={isFirst}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight, isLast && { opacity: 0.4 }]}
            onPress={nextTab}
            disabled={isLast}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
});

export default UIPageMan;
