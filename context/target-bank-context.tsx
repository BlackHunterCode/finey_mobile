/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto de contas bancárias alvos das analises.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import { FinancialInstitutionData } from "@/types/FinancialInstitutionData";
import { createContext, useContext, useState } from "react";

type TargetBankContextData = {
  selectedBanks: FinancialInstitutionData[],
  selectBank: (bank: FinancialInstitutionData) => void,
  deselectBank: (bankId: string) => void,
  selectAllBanks: () => void,
  deselectAllBanks: () => void,
  setSelectedBanks: (banks: FinancialInstitutionData[]) => void
}

const TargetBankContext = createContext<TargetBankContextData | undefined>(undefined);

export function TargetBankProvider({ children }: { children: React.ReactNode }) {
    const [selectedBanks, setSelectedBanksState] = useState<FinancialInstitutionData[]>([]);
    const [loading, setLoading] = useState(true);

    function selectBank(bank: FinancialInstitutionData) {
        setSelectedBanksState(prev => {
            const isAlreadySelected = prev.some(b => b.institutionId === bank.institutionId);
            if (!isAlreadySelected) {
                return [...prev, bank];
            }
            return prev;
        });
    }

    function deselectBank(bankId: string) {
        setSelectedBanksState(prev => prev.filter(bank => bank.institutionId !== bankId));

    }

    function selectAllBanks() {
        if (selectedBanks) {
            setSelectedBanksState(selectedBanks);
        }
    }

    function deselectAllBanks() {
        setSelectedBanksState([]);
    }

    function setSelectedBanks(banks: FinancialInstitutionData[]) {
        setSelectedBanksState(banks);
    }

    const value = {
        selectedBanks,
        selectBank,
        deselectBank,
        selectAllBanks,
        deselectAllBanks,
        setSelectedBanks
    }

    return (
        <TargetBankContext.Provider value={value}>
            {children}
        </TargetBankContext.Provider>
    )
}

export function useTargetBanks() {
    const context = useContext(TargetBankContext);
    if(context === undefined) {
        throw new Error('useTargetBanks must be used within a TargetBankProvider');
    }
    return context;
}