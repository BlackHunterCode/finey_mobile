/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Layout de navegação por tabs para a área autenticada.
 */

import UIDropInfo from '@/components/UI/UIDropInfo';
import UIToggle from '@/components/UI/UIToggle';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import UICard from '@/components/UI/UICard';
import UIButton from '@/components/UI/UIButton';
import { useAppTheme } from '@/context/theme-context';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

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
      }
    });
    
    return (
        <WRScreenContainer>
            <View>
                <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Notificações</WRText>
            </View>
            <UIDropInfo title="Notificações Financeiras" defaultOpen>
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
            <UIDropInfo title="Investimentos" defaultOpen>
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
            <View style={styles.containerEdit}>
              <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Preferência de Entrega</WRText>
              <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Método de Recebimento</Text>
                  <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Email</Text>
                </View>
                <Button title="Editar" onPress={() => {}} />
              </View>
              <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Transação Incomum</Text>
                  <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>08:00 - 22:00</Text>
                </View>
                <Button title="Editar" onPress={() => {}} />
              </View>
            </View>
            <View style={styles.containerEdit}>
              <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Modo Concentração</WRText>
              <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                <Button title="Ativar por 1h" onPress={() => {}} />
                <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Configurar Horários</Text>
                <UICard 
                style={{ marginBottom: 6, borderRadius: 0 }}
                href='/'
                openStack
                >
                  <View style={[styles.rowContainer, { gap: 14 }]}>
                    <WRText>Personalizar po Projeto</WRText>
                    <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Explicação do que esse link vai fazer.</Text>
                  </View>
                </UICard>
                <UICard 
                style={{ marginBottom: 6, borderRadius: 0 }}
                href='/'
                openStack
                >
                  <View style={[styles.rowContainer, { gap: 14 }]}>
                    <WRText>Configurar Urgências</WRText>
                    <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Explicação do que esse link vai fazer.</Text>
                  </View>
                </UICard>
              </View>
            </View>
            <View>
              <UIButton
                text='Salvar Alterações'
                onPress={() => {}}
              />
              <UIButton
                text='Restaurações Config Padrão'
                onPress={() => {}}
              />
            </View>
        </WRScreenContainer>
    )
} 

