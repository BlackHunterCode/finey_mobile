import { useAppTheme } from "@/context/theme-context";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface DividerProps {
    color?: string;
    thickness?: number;
    marginVertical?: number;
    style?: StyleProp<ViewStyle>
}

export default function UIDivider({
    color,
    thickness = 1,
    style,
    marginVertical = 8
} : DividerProps ) {
    const { theme } = useAppTheme();
    
    const dividerColor = color ?? theme.colors.dividerColor;
    return (
        <View
        style={[ 
            styles.divider,
            {   
                backgroundColor: dividerColor,
                height: thickness,
                marginVertical: marginVertical
            },
            style 
        ]}/>
    )
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});