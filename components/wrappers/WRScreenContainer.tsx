import { useAppTheme } from "@/context/theme-context";
import React, { forwardRef, useEffect, useState } from "react";
import { Dimensions, Keyboard, Platform, RefreshControl, ScrollView, ScrollViewProps, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WRScreenContainerProps extends ScrollViewProps {
  useSafeAreaView?: boolean;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  /** 
   * ATENÇÃO: Se você marcar essa opção como true o conteúdo será renderizado em uma View normal, e não em um ScrollView. 
   * Com isso a opção de Scroll Refresh não estará disponível, você terá que criar um botão separado para realizar a operação de refresh 
   * */
  allContentCenter?: boolean;
}

const WRScreenContainer = forwardRef<React.ComponentRef<typeof ScrollView>, WRScreenContainerProps>((
  {
    useSafeAreaView = false, 
    style, 
    contentContainerStyle, 
    children, 
    onRefresh,
    refreshing = false,
    allContentCenter = false,
    ...props
  }, ref) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { height: screenHeight } = Dimensions.get('window');
    const { theme } = useAppTheme();
    
    useEffect(() => {
      const keyboardWillShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      
      const keyboardWillHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        }
      );

      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }, []);
    
    const componentStyle = StyleSheet.create({
        screenContainer: {
            flex: 1,
            height: screenHeight - keyboardHeight,
            paddingHorizontal: 10,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            backgroundColor: theme.colors.background
        },
        contentContainer: {
            flexGrow: 1,
            paddingBottom: 20,
            minHeight: screenHeight - keyboardHeight - 100
        }
    });

   function ScrollViewComponent() {
      return (
        <>
         <ScrollView
          ref={ref}
          {...props}
          style={[
            componentStyle.screenContainer,  
            ...(Array.isArray(style) ? style : [style])
          ]}
          contentContainerStyle={[componentStyle.contentContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
       </>
      )
    }

    function ViewComponent() {
      return (
        <>
          <View 
          {...props}
          style={[
            componentStyle.screenContainer, 
            allContentCenter ? { alignItems: 'center', justifyContent: 'center' } : {} , 
            ...(Array.isArray(style) ? style : [style])
          ]}
          >
            {children}
          </View>
        </>
      )
    }

    if(useSafeAreaView) {
      return (
        <SafeAreaView style={{flex: 1}}>
          {allContentCenter ? ViewComponent() : ScrollViewComponent()}
        </SafeAreaView>
      )
    }
    else {
      return allContentCenter ? ViewComponent() : ScrollViewComponent();
    }
  } 
);
  
export default WRScreenContainer;