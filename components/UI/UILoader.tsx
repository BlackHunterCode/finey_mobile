import { useAppTheme } from "@/context/theme-context";
import { ActivityIndicator, View } from "react-native";
import WRText from "../wrappers/WRText";

interface UILoaderProps {
    height?: number;
    message?: string;
}

export default function UILoader({ height = 200, message }: UILoaderProps) {
    const { theme } = useAppTheme();

    return (
        <View style={{ 
            height, 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 16
        }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            { message && <WRText >{message}</WRText> }
        </View>
    )
}