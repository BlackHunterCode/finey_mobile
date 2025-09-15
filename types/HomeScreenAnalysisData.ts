export default interface HomeScreenAnalysisData {
    analysisPeriod: string;
    financialSummary: FinancialSummary;
    currentBalanceProjection: CurrentBalanceProjection;
    expenseCategories: ExpensesCategories;
    budgetReality: BudgetReality;
    aiInsights: Insights;
    incomeBreakdown: IncomeBreakdown;
    savingsInvestments: SavingsInvestments;
}

// financial summary
export interface FinancialSummary {
    income: IncomeExpenseData;
    expenses: IncomeExpenseData;
    investments: InvestmentData;
    walletBalance: WalletBalance;
    returnRate: ReturnRate;
}

export interface IncomeExpenseData {
    value: string;
    updatedAt: string;
    status: string;
    percentage: string;
}

export interface InvestmentData {
    value: string;
    updatedAt: string;
    categories: InvestmentCategory[];
    returnRate: string;
    status: string;
}

export interface WalletBalance {
    value: string;
    status: string;
}

export interface ReturnRate {
    percentage: string;
    status: string;
}

export interface InvestmentCategory {
    name: string;
    active: string;
}

// current balance projection
export interface CurrentBalanceProjection {
    currentBalance: string;
    projectedBalance: string;
    daysLeftInMonth: number;
    dailyAverageExpense: string;
    projectedSpending: string;
}

// expenses categories 
export interface ExpensesCategories {
    categories: ExpenseCategory[];
    totalExpenses: string;
}

export interface ExpenseCategory {
    name: string;
    icon: string;
    amount: string;
    percentage: string;
    previousPercentage: string;
}

// budget reality
export interface BudgetReality {
    budgetCategories: BudgetCategory[];
}

export interface BudgetCategory {
    name: string;
    icon: string;
    budgetAmount: string;
    spentAmount: string;
    percentage: string;
}

// insights
export interface Insights {
    insights: Insight[];
}

export interface Insight {
    id: string;
    text: string;
    icon: string;
    actionText: string;
    actionType: string;
    actionParams: ActionParams;
}

export interface ActionParams {
    category: string;
    currentSpending: number;
    period: string;
}

// income breakdown
export interface IncomeBreakdown {
    incomeSources: IncomeSource[];
    totalIncome: string;
    recurringIncome: string;
    variableIncome: string;
}

export interface IncomeSource {
    name: string;
    amount: string;
    percentage: string;
    isRecurring: boolean;
    icon: string;
}

// savings investments
export interface SavingsInvestments {
    totalInvested: string;
    totalReturn: string;
    totalReturnPercentage: string;
    investments: Investment[];
}

export interface Investment {
    type: string;
    amount: string;
    investmentReturn: InvestmentReturn;
    icon: string;
}

export interface InvestmentReturn {
    value: string;
    percentage: string;
    isPositive: boolean;
}