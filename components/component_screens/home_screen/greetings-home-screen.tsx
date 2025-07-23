import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { getUserInfo } from "@/service/service.user";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function GreetingsHomeScreen() {
    const [userName, setUserName] = useState<string>("");
    const { authObject } = useAuth();
    const { theme } = useAppTheme();

    useEffect(() => {
        async function loadUserInfo() {
            if (authObject) {
                const userInfo: UserInfo | null = await getUserInfo(authObject);
                if (userInfo) {
                    setUserName(userInfo.firstName);
                }
            }
        }

        loadUserInfo();
    }, [authObject]);

    return (
        <View style={styles.container}>
            <WRText style={[styles.greeting, { color: theme.colors.text }]}>
                {getGreeting()}, {userName || "usuário"}!
            </WRText>
            <WRText style={[styles.welcomeText, { color: theme.colors.muted }]}>
                Bem-vindo(a) ao Finey
            </WRText>
        </View>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
        return "Boa tarde";
    } else {
        return "Boa noite";
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    welcomeText: {
        fontSize: 16,
    },
});