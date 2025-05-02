import FinancialIntegratorWebView from "@/types/FinancialIntegratorWebView";
import { PluggyIntegratorWebView } from "./PluggyWebView";

export default function getFinancialIntegratorWebView(platform: string): FinancialIntegratorWebView {
    let financialIntegratorWebView: FinancialIntegratorWebView | null = null;
    switch(platform) {
        case 'PLUGGY':
            financialIntegratorWebView = new PluggyIntegratorWebView();
            break;
        default:
            throw new Error('Financial integrator web view not found');
    }
 
    return financialIntegratorWebView;
}