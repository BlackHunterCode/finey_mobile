import { JSX } from "react";
import AuthResponse from "./AuthResponse";

export default interface FinancialIntegratorWebView {
  connect(params: {
    authObject: AuthResponse | null;
    connectToken: string;
    onSuccess: (itemId: string) => void;
    onError?: (error: any) => void;
  }): JSX.Element;
}
