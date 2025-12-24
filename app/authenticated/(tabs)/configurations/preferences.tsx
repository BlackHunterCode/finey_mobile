/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Layout de navegação por tabs para a área autenticada.
 */

import UIButton from '@/components/UI/UIButton';
import UIDropInfo from '@/components/UI/UIDropInfo';
import UIToggle from '@/components/UI/UIToggle';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PreferencesConfigurationScreen(){
    const { theme, isDark } = useAppTheme();
    const [appTheme, setAppTheme] = useState(true);

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
        <WRScreenContainer>
            <View>
                <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }]}>Preferencia do App</WRText>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <UIDropInfo title="Aparência do Aplicativo" defaultOpen>
                    <UIToggle
                    label="Tema do Aplicativo"
                    description="Muda características visuais do aplicativo."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 15}}>
                        <View>
                            <Text style={styles.description}>Tamanho do Texto</Text>
                            <Text style={styles.subDescription}>Defina a variavel do tamanho do texto.</Text>
                        </View>
                        <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 15}}>
                        <View>
                            <Text style={styles.description}>Cor Primária</Text>
                            <Text style={styles.subDescription}>Defina a variavel da cor primária.</Text>
                        </View>
                        <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
                    </View>
                </UIDropInfo>
                <UIDropInfo title="Funcionalidades" defaultOpen>
                    <UIToggle
                    label="Modo Economia de Bateria"
                    description="Reduz animações e efeitos visuais para economizar bateria."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <UIToggle
                    label="Features Experimentais"
                    description="Modo de desclaimer ao ativar"
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 15}}>
                        <View>
                            <Text style={styles.description}>Configurar Atalho</Text>
                            <Text style={styles.subDescription}>Configure os atalhos das telas principais.</Text>
                        </View>
                        <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
                    </View>
                </UIDropInfo>
                <UIDropInfo title="Privacidades" defaultOpen>
                    <UIToggle
                    label="Dados Analíticos"
                    description="Saiba mais."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 15}}>
                        <View>
                            <Text style={styles.description}>Personalização de Anúncios</Text>
                            <Text style={styles.subDescription}>personalize a forma que os anúncios aparecem.</Text>
                        </View>
                        <UIButton text="Editar" size='small' style={{backgroundColor: '#383838ff', borderRadius: 3}} textColor='#a7a7a7ff' onPress={() => {}} />
                    </View>
                </UIDropInfo>
                <UIDropInfo title="Acessibilidade" defaultOpen>
                    <UIToggle
                    label="Leitor de Tela"
                    description="Permite que app de avisos."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <UIToggle
                    label="Alto Contraste"
                    description="Deixa as cores mais vivas."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <UIToggle
                    label="Reduzir Animações"
                    description="Reduz animações para melhorar a performance."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                </UIDropInfo>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-around'}]}>
                    <UIButton
                    text='Salvar Alterações'
                    onPress={() => {}}
                    />
                    <UIButton
                    text='Restaurações Config Padrão'
                    onPress={() => {}}
                    />
                </View>
            </View>
        </WRScreenContainer>
    )
}