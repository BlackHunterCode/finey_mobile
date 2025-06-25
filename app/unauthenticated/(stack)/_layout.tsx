import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StackLayout() {

    return (
        <>
            <StatusBar style="auto"/>
            <Stack
                screenOptions={{
                    headerTitle:'',
                    headerShadowVisible: false
                }}
            />
        </>
   ) 
}