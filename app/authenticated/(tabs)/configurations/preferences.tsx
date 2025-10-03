/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Layout de navegação por tabs para a área autenticada.
 */

import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import UIDropInfo from '@/components/UI/UIDropInfo';
import UIToggle from '@/components/UI/UIToggle';
import UIButton from '@/components/UI/UIButton';
import { useAppTheme } from '@/context/theme-context';
import { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

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
      }
    });

    return (
        <WRScreenContainer>
            <View>
                <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Preferencia do App</WRText>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <UIDropInfo title="Aparência do Aplicativo" defaultOpen>
                    <UIToggle
                    label="Tema do Aplicativo"
                    description="Muda características visuais do aplicativo."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Tamanho de Texto</Text>
                            <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Defina a variavel do tamanho do texto.</Text>
                        </View>
                        <Button title="Editar" onPress={() => {}} />
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Cor Primária</Text>
                            <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Defina a variavel da cor primaria</Text>
                        </View>
                        <Button title="Editar" onPress={() => {}} />
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
                    <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Configurar Atalho</Text>
                            <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Configure os atalhos das telas principais.</Text>
                        </View>
                        <Button title="Editar" onPress={() => {}} />
                    </View>
                </UIDropInfo>
                <UIDropInfo title="Privacidades" defaultOpen>
                    <UIToggle
                    label="Dados Analíticos"
                    description="Saiba mais."
                    value={appTheme}
                    onValueChange={setAppTheme}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 14 }}>Personalização de Anúncios</Text>
                            <Text style={{ color: isDark ? '#888888ff' : '#888888ff', fontSize: 8 }}>Personalize a forma que os anúncios aparecem.</Text>
                        </View>
                        <Button title="Editar" onPress={() => {}} />
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
                </View>
        </WRScreenContainer>
    )
}