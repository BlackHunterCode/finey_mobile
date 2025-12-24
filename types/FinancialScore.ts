export default interface FinancialScore {
    period: String;
    score: number;
    details: string;
    percentage: string;
    daysOfControl: number;
    insights: FinancialInsight[];
}

export interface FinancialInsight {
    title: string;
    subtitle: string;
    icon: string;
    actionableText: string;
    actionableLink: string;
} 

export interface FinancialScoreEncrypted {
    period: string;
    score: string;
    details: string;
    percentage: string;
    daysOfControl: string;
    insights: FinancialInsightEncrypted[];
}

export interface FinancialInsightEncrypted {
    title: string;
    subtitle: string;
    icon: string;
    actionableText: string;
    actionableLink: string;
} 