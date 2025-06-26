import { JSX } from "react";

export default interface FinancialIntegratorWebView {
  connect(params: {
    connectToken: string;
    onSuccess: (itemId: string) => void;
    onError?: (error: any) => void;
  }): JSX.Element;
}
