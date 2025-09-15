import UICard from "@/components/UI/UICard";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";

export default function Teste() {
    return (
        <WRScreenContainer>
            <WRText>Teste carai</WRText>
            <UICard
                href=""
                openStack
            >
                <WRText>Card ye</WRText>
            </UICard>
        </WRScreenContainer>
    )
};