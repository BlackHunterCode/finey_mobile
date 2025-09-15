import UICard from "@/components/UI/UICard";
import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { getUserInfo } from "@/service/service.user";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function AboutUserConfigurationScreen() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const { authObject } = useAuth();
    const { theme } = useAppTheme();
    
    useEffect(() => {
        async function fetchUserInfo() {
            const userInfo = await getUserInfo(authObject);
            setUserInfo(userInfo);
        }
        fetchUserInfo();
    }, [authObject]);

    const styles = StyleSheet.create({
        rowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40
        }
    });

    return (
        <UICard>
            <View style={[styles.rowContainer, {gap: 15}]}>
                <Image style={styles.avatar} source={require("../../../assets/images/me.png")}/>
                <View>
                    <WRText style={styles.title}>{userInfo?.fullName}</WRText>
                    <View>
                        <WRText>Plano de assinatura: <WRText style={{ fontWeight: 'bold', color: theme.colors.primary }}>Hunter Basic</WRText></WRText>
                    </View>
                </View>
            </View>
        </UICard>
    )
}