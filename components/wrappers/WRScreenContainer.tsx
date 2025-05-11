import { forwardRef } from "react";
import { Dimensions, ScrollView, ScrollViewProps, StyleSheet } from "react-native";

const WRScreenContainer = forwardRef<React.ComponentRef<typeof ScrollView>, ScrollViewProps>((props, ref) => {
    // Get screen height to ensure minimum content height
    const { height: screenHeight } = Dimensions.get('window');
    
    const componentStyle = StyleSheet.create({
        screenContainer: {
            flex: 1,
            height: screenHeight,
            paddingHorizontal: 10
        },
        contentContainer: {
            alignItems: 'center',
            paddingBottom: 20,
            minHeight: screenHeight - 100 // Ensure there's enough content to scroll
        }
    });
    
    return (
      <ScrollView
        ref={ref}
        {...props}
        style={[componentStyle.screenContainer, ...(Array.isArray(props.style) ? props.style : [props.style])]}
        contentContainerStyle={[componentStyle.contentContainer, props.contentContainerStyle]}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {props.children}
      </ScrollView>
    );
});
  
export default WRScreenContainer;