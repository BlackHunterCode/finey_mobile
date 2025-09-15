import TotalTransactionPeriod from "@/types/TotalTransactionPeriod";
import { createContext, useContext, useState } from "react";

type TotalTransactionPeriodContextData = {
    totalTransactionPeriod: TotalTransactionPeriod | undefined;
    setTotalTransactionPeriod: (totalTransactionPeriod: TotalTransactionPeriod) => void;
}

const TotalTransactionPeriodContext = createContext<TotalTransactionPeriodContextData | undefined>(undefined);

export function TotalTransactionPeriodProvider({ children }: { children: React.ReactNode }) {
    const [totalTransactionPeriod, setTotalTransactionPeriod] = useState<TotalTransactionPeriod | undefined>(undefined);

    const value = {
        totalTransactionPeriod,
        setTotalTransactionPeriod
    };

    return (
        <TotalTransactionPeriodContext.Provider value={value}>
        {children}
        </TotalTransactionPeriodContext.Provider>
    );
}

export function useTotalTransactionPeriod() {
    const context = useContext(TotalTransactionPeriodContext);
    if (context === undefined) {
      throw new Error('useTotalTransactionPeriod must be used within an TotalTransactionPeriodContext');
    }
    return context;
  }