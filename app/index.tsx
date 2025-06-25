import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";

export default function Index() {
    const { authToken } = useAuth();
    if(authToken) {
        return <Redirect href="./authenticated/(tabs)/home"/>;
    }
    return <Redirect href="./unauthenticated/(stack)/logged-out"/>;
}