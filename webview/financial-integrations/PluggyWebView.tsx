import { savePluggyItemId } from '@/service/service.pluggy';
import AuthResponse from '@/types/AuthResponse';
import FinancialIntegratorWebView from '@/types/FinancialIntegratorWebView';
import { ExecutionStatus, Item as PluggyItem } from 'pluggy-js';
import { JSX, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConnectEventPayload, PluggyConnect } from 'react-native-pluggy-connect';
import { useAppTheme } from '@/context/theme-context';
interface Item extends Omit<PluggyItem, 'connector'> {
  id: string;
  status: 'UPDATING' | 'UPDATED' | 'LOGIN_ERROR' | 'OUTDATED' | 'WAITING_USER_INPUT';
  executionStatus: ExecutionStatus;
  error: {
    code: "INVALID_CREDENTIALS" | "ACCOUNT_CREDENTIALS_RESET" | "ALREADY_LOGGED_IN" | "UNEXPECTED_ERROR" | 
          "INVALID_CREDENTIALS_MFA" | "SITE_NOT_AVAILABLE" | "ACCOUNT_LOCKED" | "CONNECTION_ERROR" | 
          "USER_NOT_SUPPORTED" | "ACCOUNT_NEEDS_ACTION" | "USER_AUTHORIZATION_PENDING" | "USER_AUTHORIZATION_NOT_GRANTED" | 
          "USER_INPUT_TIMEOUT";
    message: string;
    data?: any;
  } | null;
  connector?: {
    id: number;
    name: string;
    institutionUrl: string;
    imageUrl: string;
    primaryColor: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PluggyConnector {
  id: number | null;
  imageUrl: string;
  name: string;
}

var pluggyConnector: PluggyConnector | null = null;

const PluggyConnectComponent: React.FC<{
  authObject: AuthResponse | null;
  connectToken: string;
  onSuccess: (itemId: string) => void;
  onError?: (error: any) => void;
}> = ({ authObject, connectToken, onSuccess, onError }) => {
  const { theme } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Integrando...');
  const [loadingSubtext, setLoadingSubtext] = useState<null | string> (null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Chave para forçar a recriação do componente

  // Adicionar um efeito para garantir que o estado de loading não seja alterado durante operações assíncronas
  const [isSaving, setIsSaving] = useState(false);

  // Função de callback para o sucesso da conexão
  // Usando o tipo correto para compatibilidade com PluggyConnect
  const handleSuccess = async (data: { item: PluggyItem }): Promise<void> => {
    // Verificar se temos dados do item
    if (!data?.item) {
      onError?.(new Error('No item data received from Pluggy Connect'));
      return;
    }
    
    if (data.item.id) {
      // Verificar o status do item antes de considerar como sucesso
      const status = data.item.status as string;
      
      if (status === 'WAITING_USER_INPUT') {
        // O item precisa de entrada adicional do usuário
        const errorMsg = 'Item requires additional user input to complete synchronization';
        onError?.(new Error(errorMsg));
        return;
      }
      
      if (status === 'LOGIN_ERROR' || status === 'OUTDATED') {
        // Erro de login ou item desatualizado
        const errorMessage = data.item.error?.message || 'Item was not synced successfully';
        onError?.(new Error(errorMessage));
        return;
      }
      
      if (status === 'UPDATED') {
        // Mostrar tela de carregamento durante o salvamento
        setIsLoading(true);    
        setLoadingText('Salvando os dados...');
        setLoadingSubtext('Por favor, não feche o aplicativo...');
        setIsSaving(true);
        
        try {
            await savePluggyItemId(authObject, data.item.id, pluggyConnector);
            setTimeout(() => {
                setIsSaving(false);
                onSuccess(data.item.id);
            }, 3500); 
        } catch (err: any) {
            setIsSaving(false);
            setIsLoading(false);
            // Mostrar mensagem de erro específica para usuário não autenticado
            if (err.message && err.message.includes('Usuário não autenticado')) {
                setError(`Erro ao salvar item ID: Usuário não autenticado`);
            } else {
                setError(`Erro ao salvar os dados: ${err.message || 'Tente novamente mais tarde.'}`);
            }

            return;
        }
        return;
      }
      
      if (status === 'UPDATING') {
        // O item ainda está sendo atualizado
        setLoadingText('Atualizando os dados...');
        setLoadingSubtext('Por favor, não feche o aplicativo...');
        setIsLoading(true);
        setIsSaving(true); 
        
        try {
            await savePluggyItemId(authObject, data.item.id, pluggyConnector);
            setTimeout(() => {
                setIsSaving(false); 
                onSuccess(data.item.id);
            }, 3500);
        } catch (err: any) {
            setIsSaving(false); 
            setIsLoading(false);
            // Mostrar mensagem de erro específica para usuário não autenticado
            if (err.message && err.message.includes('Usuário não autenticado')) {
                setError(`Erro ao salvar item ID: Usuário não autenticado`);
            } else {
                setError(`Erro ao salvar os dados: ${err.message || 'Tente novamente mais tarde.'}`);
            }


            // aqui para erros da API preciso implementar uma funcionalidade de suporte, pois são erros não tratáveis.
            return;
        }
        return;
      }
      
      // Para qualquer outro status que não foi tratado explicitamente
      
      // Verificar se há algum erro específico no item
      if (data.item.error) {
        // Decisão: mesmo com erro, se temos um ID válido, consideramos como sucesso
      }
    } else {
      onError?.(new Error('No item ID received from Pluggy Connect'));
    }
  };

  const handleError = async (error: { message: string; data?: { item: Item } }): Promise<void> => {
    
    // Verificar se temos dados do item no erro
    if (error.data?.item) {
      const item = error.data.item;
      const status = item.status;
      const executionStatus = item.executionStatus;
      const errorDetails = item.error;
      
      // Construir uma mensagem de erro mais detalhada
      let errorMessage = `Pluggy Connect error: ${error.message}`;
      
      if (status) {
        errorMessage += `\nStatus: ${status}`;
      }
      
      if (executionStatus) {
        errorMessage += `\nExecution Status: ${executionStatus}`;
      }
      
      if (errorDetails) {
        errorMessage += `\nError Code: ${errorDetails.code}`;
        errorMessage += `\nError Message: ${errorDetails.message}`;
      }
      
      // Verificar se é um erro de credenciais inválidas
      if (executionStatus === 'INVALID_CREDENTIALS' || 
          (errorDetails && errorDetails.code === 'INVALID_CREDENTIALS')) {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Credenciais inválidas. Por favor, tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se é um erro de conta bloqueada
      if (executionStatus === 'ACCOUNT_LOCKED' ||
          (errorDetails && errorDetails.code === 'ACCOUNT_LOCKED')) {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Conta bloqueada. Por favor, desbloqueie sua conta no site do banco e tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se é um erro de credenciais resetadas
      if (executionStatus === 'ACCOUNT_CREDENTIALS_RESET' ||
          (errorDetails && errorDetails.code === 'ACCOUNT_CREDENTIALS_RESET')) {
        // Mostrar mensagem de erro sem fechar a webview
        setError('As credenciais da sua conta foram resetadas. Por favor, atualize suas credenciais e tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se é um erro de site indisponível
      if (errorDetails && errorDetails.code === 'SITE_NOT_AVAILABLE') {
        // Mostrar mensagem de erro sem fechar a webview
        setError('O site do banco está temporariamente indisponível. Por favor, tente novamente mais tarde.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se é um erro de conexão
      if (errorDetails && errorDetails.code === 'CONNECTION_ERROR') {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se o usuário já está logado
      if (executionStatus === 'ALREADY_LOGGED_IN' ||
          (errorDetails && errorDetails.code === 'ALREADY_LOGGED_IN')) {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Você já está logado em outro dispositivo. Por favor, faça logout e tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se o status é OUTDATED
      if (status === 'OUTDATED') {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Informações desatualizadas. Por favor, atualize suas credenciais e tente novamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se o usuário não é suportado
      if (executionStatus === 'USER_NOT_SUPPORTED' ||
          (errorDetails && errorDetails.code === 'USER_NOT_SUPPORTED')) {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Este tipo de usuário não é suportado. Por favor, tente com outro tipo de conta.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se a conta precisa de ação
      if (errorDetails && errorDetails.code === 'ACCOUNT_NEEDS_ACTION') {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Sua conta precisa de ação adicional. Por favor, acesse o site do banco para resolver pendências.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Verificar se houve timeout na entrada do usuário
      if (errorDetails && errorDetails.code === 'USER_INPUT_TIMEOUT') {
        // Mostrar mensagem de erro sem fechar a webview
        setError('Tempo limite excedido. Por favor, tente novamente e complete as informações mais rapidamente.');
        setIsLoading(false);
        // Não chamar onError para evitar que a webview seja fechada
        return;
      }
      
      // Para outros tipos de erro, continuar com o comportamento padrão
      onError?.(new Error(errorMessage));
    } else {
      // Caso não tenhamos dados detalhados do item
      onError?.(new Error(error.message || 'An error occurred with Pluggy Connect'));
    }
  };

  const handleOpen = () => {
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsLoading(false);
    // Chamamos onError com null para fechar a webview sem mostrar erro
    onError?.('closed');
  };

  const handleEvent = async (event: ConnectEventPayload): Promise<void> => {
    switch (event.event) {
      case 'ITEM_RESPONSE':
        // Verificar o status do item quando recebemos uma resposta
        if (event.item) {
          const item = event.item;
          const status = item.status as string;
          const executionStatus = item.executionStatus as string;
          
          // Capturar o ID do connector quando o usuário seleciona uma instituição
          if (item.connector && item.connector.id) {
            pluggyConnector = item.connector;
          }

          // Verificar se é um erro de credenciais inválidas
          if ((status === 'LOGIN_ERROR' && executionStatus === 'INVALID_CREDENTIALS') ||
              (item.error?.code === 'INVALID_CREDENTIALS')) {
            setIsLoading(false);
            setError('Credenciais inválidas. Por favor, tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se é um erro de conta bloqueada
          if ((status === 'LOGIN_ERROR' && executionStatus === 'ACCOUNT_LOCKED') ||
              (item.error?.code === 'ACCOUNT_LOCKED')) {
            setIsLoading(false);
            setError('Conta bloqueada. Por favor, desbloqueie sua conta no site do banco e tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se é um erro de credenciais resetadas
          if ((status === 'LOGIN_ERROR' && executionStatus === 'ACCOUNT_CREDENTIALS_RESET') ||
              (item.error?.code === 'ACCOUNT_CREDENTIALS_RESET')) {
            setIsLoading(false);
            setError('As credenciais da sua conta foram resetadas. Por favor, atualize suas credenciais e tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se é um erro de site indisponível
          if (item.error?.code === 'SITE_NOT_AVAILABLE') {
            setIsLoading(false);
            setError('O site do banco está temporariamente indisponível. Por favor, tente novamente mais tarde.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se é um erro de conexão
          if (item.error?.code === 'CONNECTION_ERROR') {
            setIsLoading(false);
            setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se o usuário já está logado
          if (executionStatus === 'ALREADY_LOGGED_IN' ||
              (item.error?.code === 'ALREADY_LOGGED_IN')) {
            setIsLoading(false);
            setError('Você já está logado em outro dispositivo. Por favor, faça logout e tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se o status é OUTDATED
          if (status === 'OUTDATED') {
            setIsLoading(false);
            setError('Informações desatualizadas. Por favor, atualize suas credenciais e tente novamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se o usuário não é suportado
          if (executionStatus === 'USER_NOT_SUPPORTED' ||
              (item.error?.code === 'USER_NOT_SUPPORTED')) {
            setIsLoading(false);
            setError('Este tipo de usuário não é suportado. Por favor, tente com outro tipo de conta.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se a conta precisa de ação
          if (item.error?.code === 'ACCOUNT_NEEDS_ACTION') {
            setIsLoading(false);
            setError('Sua conta precisa de ação adicional. Por favor, acesse o site do banco para resolver pendências.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Verificar se houve timeout na entrada do usuário
          if (item.error?.code === 'USER_INPUT_TIMEOUT') {
            setIsLoading(false);
            setError('Tempo limite excedido. Por favor, tente novamente e complete as informações mais rapidamente.');
            // Não chamar onError para evitar que a webview seja fechada
            return;
          }
          
          // Para outros tipos de erro
          if (status === 'LOGIN_ERROR') {
            setIsLoading(false);
            const errorMessage = item.error?.message || `Item status: ${status}`;
            setError(errorMessage);
            onError?.(new Error(errorMessage));
            return;
          }
          
          if (status === 'UPDATED') {
            // Mantemos o estado de carregamento para permitir a visualização da tela de loading
            // setIsLoading(false); // Comentamos esta linha para manter o loading
            setLoadingText('Salvando os dados...');
            setLoadingSubtext('Por favor, não feche o aplicativo...');
          }
        }
        setIsLoading(false);
        break;
      
      case 'LOGIN_SUCCESS':
      case 'LOGIN_MFA_SUCCESS':
        // Login bem-sucedido
        // Manter o loading, pois o item ainda está sendo criado/atualizado
        break;
        
      case 'LOGIN_STEP_COMPLETED':
        setIsLoading(false);
        break;
      
      case 'SUBMITTED_CONSENT':
      case 'SUBMITTED_LOGIN':
      case 'SUBMITTED_MFA':
        // Keep loading for these events
        break;
      
      case 'SELECTED_INSTITUTION':
        setIsLoading(false);
        break;
        
      default:
        // For any other events or custom events
        // For events like USER_CANCELLED or WIDGET_CLOSED that are not in ConnectEventPayload
        setIsLoading(false);
        break;
    }
  };

  // Add a timeout to handle cases where the widget fails to load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        const errorMsg = 'Pluggy Connect widget took too long to load. Please check your internet connection and try again.';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(new Error(errorMsg));
      }
    }, 120000); // 120 seconds timeout (2 minutos) para dar mais tempo para a sincronização

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, onError]);
  
  // Efeito para limpar erros quando o componente é remontado
  useEffect(() => {
    // Limpar erros quando o componente é remontado
    return () => {
      // Cleanup ao desmontar
    };
  }, [key]);
  
  useEffect(() => {
    if (isSaving) {
      setIsLoading(true);
    }
  }, [isSaving]);
  
  const handleClosePress = () => {
    handleClose();
  };

  const resetLoadingScreen = () => {
    setLoadingText('Tentando novamente...');
    setLoadingSubtext(null);
    setIsLoading(true);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              resetLoadingScreen();
              setError(null);
              setIsLoading(true);
              
              // Forçar a recriação do componente PluggyConnect
              // Isso é feito criando um novo estado para forçar a re-renderização
              setKey(prevKey => prevKey + 1);
            }}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <PluggyConnect
            key={key} // Usar a chave para forçar a recriação do componente
            connectToken={connectToken}
            onSuccess={handleSuccess}
            onError={handleError}
            onOpen={handleOpen}
            onClose={handleClose}
            onEvent={handleEvent}
            language="pt"
            // Enable sandbox in development
            includeSandbox={__DEV__}
            // Optional: Uncomment and configure these as needed
            // theme="light"
            //connectorTypes={['PERSONAL_BANK']}
            // countries={['BR']}
          />
        </View>
      )}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>{loadingText}</Text>
          {loadingSubtext && (<Text style={styles.loadingText}>{loadingSubtext}</Text>)}
        </View>
      )}
    </View>
  );
};

export class PluggyIntegratorWebView implements FinancialIntegratorWebView {
  public connect({ authObject, connectToken, onSuccess, onError }: {
    authObject: AuthResponse | null;
    connectToken: string;
    onSuccess: (itemId: string, connectorId?: number) => void;
    onError?: (error: any) => void;
  }): JSX.Element {
    // Criamos um wrapper para onSuccess que não fecha a webview
    const handleSuccessWrapper = (itemId: string, connectorId?: number) => {
      // Chamamos o onSuccess original com o itemId e o connectorId
      onSuccess(itemId, connectorId);
    };
    
    // Criamos um wrapper para onError que fecha a webview silenciosamente quando o usuário clica no botão de fechar
    const handleErrorWrapper = (error: any) => {
      // Se o usuário clicou no botão de fechar, o erro será undefined ou null
      // Nesse caso, fechamos a webview silenciosamente sem mostrar erro
      if (error === undefined || error === null) {
        // Chamamos onError com null para fechar a webview sem mostrar erro
        onError?.(null);
        return;
      }
      
      // Para outros erros, chamamos onError normalmente
      onError?.(error);
    };
    
    return (
      <PluggyConnectComponent 
        authObject={authObject}
        connectToken={connectToken} 
        onSuccess={handleSuccessWrapper} 
        onError={handleErrorWrapper} 
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    marginTop: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
