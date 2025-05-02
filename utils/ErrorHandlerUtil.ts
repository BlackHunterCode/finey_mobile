import { ToastType } from '@/constants/constants.toast';
import ApiResponse from '@/types/ApiResponse';

type ToastFunction = (params: {
  message: string;
  type?: ToastType;
  traceId?: string;
}) => void;

/**
 * Utilitário para tratar erros da API e exibi-los no Toast
 */
export class ErrorHandlerUtil {
  /**
   * Trata erros da API e exibe no Toast
   * @param error O erro capturado
   * @param showToast Função para exibir o Toast
   * @param defaultMessage Mensagem padrão caso não seja possível extrair do erro
   */
  static handleApiError(error: any, showToast: ToastFunction, defaultMessage: string = 'Erro ao conectar com o serviço. Tente novamente mais tarde.') {
    if (error instanceof Error) {
      try {
        // Tenta fazer o parse da mensagem de erro como JSON
        const response: ApiResponse = JSON.parse(error.message);
        
        // Verifica se o objeto tem as propriedades esperadas
        if (response && typeof response === 'object') {
          showToast({
            message: response.data || defaultMessage,
            type: ToastType.ERROR,
            traceId: response.traceId
          });
          return;
        }
      } catch (parseError) {
        // Se não conseguir fazer o parse, usa a mensagem do erro original
        console.error('Erro ao fazer parse da mensagem de erro:', parseError);
        showToast({
          message: error.message || defaultMessage,
          type: ToastType.ERROR
        });
        return;
      }
    }
    
    // Para qualquer outro tipo de erro
    showToast({
      message: defaultMessage,
      type: ToastType.ERROR
    });
  }
}