import UICard from "@/components/UI/UICard";
import WRText from "@/components/wrappers/WRText";

export default function NewsHomeScreen() {
    return (
        <>
            <UICard 
            style={{marginBottom: 10}}
            activeAccordion 
            accordionTitle="Nóticias financeiras" 
            accordionBeOpenDefault>
                <WRText>Últimas notícias</WRText>
                <WRText>Últimas notícias</WRText>
                <WRText>Últimas notícias</WRText>   
                <WRText>Últimas notícias</WRText>
            </UICard>
        </>
    )
}