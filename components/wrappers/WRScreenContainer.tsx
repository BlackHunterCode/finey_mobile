import { useAppTheme } from "@/context/theme-context";
import React, { forwardRef, useEffect, useState } from "react";
import { Dimensions, Keyboard, Platform, RefreshControl, ScrollView, ScrollViewProps, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WRScreenContainerProps extends ScrollViewProps {
  useSafeAreaView?: boolean;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

const WRScreenContainer = forwardRef<React.ComponentRef<typeof ScrollView>, WRScreenContainerProps>((
  {
    useSafeAreaView = false, 
    style, 
    contentContainerStyle, 
    children, 
    onRefresh,
    refreshing = false,
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
            paddingHorizontal: 10
        },
        contentContainer: {
            flexGrow: 1,
            paddingBottom: 20,
            minHeight: screenHeight - keyboardHeight - 100
        }
    });
    
    const ContainerComponent = useSafeAreaView ? SafeAreaView : React.Fragment;

    return (
      <ContainerComponent>
        <ScrollView
          ref={ref}
          {...props}
          style={[componentStyle.screenContainer, ...(Array.isArray(style) ? style : [style])]}
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
      </ContainerComponent>
    );
});
  
export default WRScreenContainer;