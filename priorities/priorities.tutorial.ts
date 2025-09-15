import UserInfo from "@/types/UserInfo";
import { Alert } from "react-native";

export function processTutorialPriorities(userInfo: UserInfo, setModalVisible: (visible: boolean) => void) {
    const now = new Date();
    if(userInfo.endDateTimeOfTutorialPeriod &&
       userInfo.endDateTimeOfTutorialPeriod < now) {
       // período de tutorial ja passou 
       Alert.alert("Fim do tutorial");
    } else {
        // ainda esta no período do tutorial
        //Alert.alert("Iniciando tutorial!");
        setModalVisible(true);
    }
}