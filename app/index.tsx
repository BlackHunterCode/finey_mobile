import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";

export default function Index() {
    const { authObject } = useAuth();
    if(authObject) {
        return <Redirect href="./authenticated/(tabs)/home"/>;
    }
    return <Redirect href="./unauthenticated/(stack)/logged-out"/>;
}