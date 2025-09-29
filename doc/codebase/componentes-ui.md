Na aplicação temos componentes UI, que são componetes visuais reutilizáveis pela aplicação inteira. Seu objetivo é manter um padrão de estilos e comportamentos e também para facilitar o desenvolvimento de telas. Temos diversos componentes UI e cada um segue uma estrutura parecida de arquitetura.

todos os componentes ficam na pasta `components/UI`
Padrão de nome do arquivo .tsx: UI{NomeDoComponente}.tsx
Padrão de nome do componente: UI{NomeDoComponente}


Geralmente os componentes UI são feitos com functions, e não por classes.
Geralmente os componentes UI tem props com parametros de configuração do próprio componente, e utilizam uma interface interna para tipagem. Um exemplo de Interface de props de um componente UI:
```tsx
/**
 * Componente de card para a interface do usuário
 */
interface CardProps extends Props {
    fullWidth?: boolean;

    /**
     * Configurações do Accordion 
     */
    activeAccordion?: boolean;
    accordionTitle?: string;
    accordionBeOpenDefault?: boolean;
    useDividerInAccordion?: boolean;
    
    /**
     * Configurações de Navegação em Stack
     */
    openStack?: boolean;
    href?: string;
    onPress?: () => void;

    /**
     * Configurações da Barra de Progresso
     */
    showProgressBar?: boolean;
    progressValue?: number; // Value between 0 and 100
}
```

E então é referenciado como tipagem na props da função do componente UI.
```tsx

/**
 * Componente de card customizável com suporte para accordion, navegação e barra de progresso
 * @param cardProps Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UICard({ 
        children, style, fullWidth=false, 
        activeAccordion=false, accordionTitle="", accordionBeOpenDefault=false, useDividerInAccordion=false,
        openStack=false, href="", onPress,
        showProgressBar=false, progressValue=0
    }: CardProps) {
      // ... restante do código.  
    }
```

A intenção do componente UI é fornecer um componente visual reutilizável com diversas configurações possíveis, para facilitar o desenvolvimento de telas, e todos os componentes visuais UI devem utilizar os componentes Wrappers, principalmente o componente WRText que funciona como um Wrapper para textos contendo ja um estilo próprio como fonte e tamanho adequado e padronizado.

