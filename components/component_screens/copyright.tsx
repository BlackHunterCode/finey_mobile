import { useAppTheme } from "@/context/theme-context";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import WRText from "../wrappers/WRText";

interface CopyrightProps {
    style?: StyleProp<ViewStyle>
}
export default function Copyright({ style } : CopyrightProps) {
    const { theme, isDark } = useAppTheme();
    
    const styles = StyleSheet.create({
        footer: {
            alignItems: 'center'
        },
        footerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        footerImage: {
            width: 15, 
            height: 15,
            marginRight: 5,
            opacity: 0.4
        },
        footerText: {
            fontSize: 12,
            textAlign: 'center',
            opacity: 0.7,
            color: theme.colors.muted
        }   
    });

    return (
        <View style={[styles.footer, style]}>
            <View style={styles.footerContent}>
                { isDark ? 
                    (
                        <Image 
                            source={require("../../assets/images/blakchunter/bhunter_dark_mode.png")} 
                            style={styles.footerImage} 
                            resizeMode="contain"/>
                    ) : 
                    (
                        <Image 
                            source={require("../../assets/images/blakchunter/bhunter_light_mode.png")} 
                            style={styles.footerImage} 
                            resizeMode="contain"/>
                    )
                }
                <WRText style={styles.footerText}>
                    2025 Black Hunter. Todos os direitos reservados.
                </WRText>
            </View>
        </View>
    )
}