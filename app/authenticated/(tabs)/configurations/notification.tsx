/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Layout de navegação por tabs para a área autenticada.
 */

import UIButton from '@/components/UI/UIButton';
import UICard from '@/components/UI/UICard';
import UIDropInfo from '@/components/UI/UIDropInfo';
import UIToggle from '@/components/UI/UIToggle';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotificationConfigurationScreen() {
    const { theme, isDark } = useAppTheme();
    const [billDue, setBillDue] = useState(true);
    const [spendingLimit, setSpendingLimit] = useState(true);
    const [unusualTx, setUnusualTx] = useState(false);
    const [investment, setInvestiment] = useState(true);
    const [fall, setFall] = useState(true);


    const styles = StyleSheet.create({
      rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      textMutedCenter: {
        textAlign: 'center',
        color: theme.colors.muted,
        fontSize: 12
      },
      textCenter: {
        textAlign: 'center'
      },
      containerEdit: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: 10,
      },
      flex: {
        flexDirection: 'row'
      },
      description: { 
        color: isDark ? '#FFFFFF' : '#000000', 
        fontSize: 15,
      },
      subDescription: {
        color: isDark ? '#888888ff' : '#888888ff', 
        fontSize: 12,
      },
      space_gap: {
        marginBottom: 25
      }
    });
    
    return (
        <WRScreenContainer style={{ paddingBottom: 100}}>
            <View>
                <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Notificações</WRText>
            </View>
            <UIDropInfo style={styles.space_gap} title="Notificações Financeiras" defaultOpen>
              <UIToggle
                label="Vencimento de contas"
                description="Notificar caso tenha alguma conta vencida."
                value={billDue}
                onValueChange={setBillDue}
              />
              <UIToggle
                label="Limites de gastos"
                description="Notificar caso você passe do seu limite de gastos."
                value={spendingLimit}
                onValueChange={setSpendingLimit}
              />
              <UIToggle
                label="Transação incomum"
                description="Notificar caso tenha uma transação incomum."
                value={unusualTx}
                onValueChange={setUnusualTx}
              />
            </UIDropInfo>
            <UIDropInfo style={styles.space_gap} title="Investimentos" defaultOpen>
              <UIToggle
                label="Resultado de investimentos"
                description="Notificar resultados dos seus investimentos mensais."
                value={investment}
                onValueChange={setInvestiment}
              />
              <UIToggle
                label="Queda de porcentagem"
                description="Notificar caso algum investimento caia mais que 5%."
                value={fall}
                onValueChange={setFall}
              />
            </UIDropInfo>
            <View style={[styles.containerEdit, styles.space_gap]}>
              <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }]}>Preferência de Entrega</WRText>
              <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%'}}>
                <View>
                  <WRText style={styles.description}>Método de Recebimento</WRText>
                  <WRText style={styles.subDescription}>Email</WRText>
                </View>
                <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
              </View>
              <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%'}}>
                <View>
                  <WRText style={styles.description}>Transação Incomum</WRText>
                  <WRText style={styles.subDescription}>08:00 - 22:00</WRText>
                </View>
                <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
              </View>
            </View>
            <View style={[styles.containerEdit, styles.space_gap]}>
              <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }]}>Modo Concentração</WRText>
              <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%'}}>
                  <UIButton text="Ativar por 1h" style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
                  <WRText style={styles.subDescription}>Configurar Horários</WRText>
              </View>
            </View>
            <View style={[styles.containerEdit, styles.space_gap]}>
              <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }]}>Configurar Avançadas</WRText>
              <UICard 
                style={{ marginBottom: 6, borderRadius: 0, width: '100%' }}
                href='/'
                openStack
                >
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <WRText>Personalizar po Projeto</WRText>
                    <WRText style={styles.subDescription}>Explicação do que esse link vai fazer.</WRText>
                  </View>
                </UICard>
                <UICard 
                style={{ marginBottom: 6, borderRadius: 0, width: '100%' }}
                href='/'
                openStack
                >
                  <View style={{ flexDirection: 'column' }}>
                    <WRText>Configurar Urgências</WRText>
                    <WRText style={styles.subDescription}>Explicação do que esse link vai fazer.</WRText>
                  </View>
                </UICard>
            </View>
            <View style={[styles.flex, { justifyContent: 'space-around'}]}>
              <UIButton
                text='Salvar Alterações'
                onPress={() => {}}
              />
              <UIButton
                text='Restaurações Config Padrão'
                size='small'
                onlyFontSizeChange
                hasBackground={false}
                onPress={() => {}}
              />
            </View>
        </WRScreenContainer>
    )
} 

