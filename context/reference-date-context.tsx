import React, { createContext, useContext, useState } from 'react';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface ReferenceDateContextType {
    referenceDate: Date;
    setReferenceDate: (date: Date) => void;
    getDateRangeByPeriod: (type: PeriodType, weekNumber?: number) => DateRange;
}

const ReferenceDateContext = createContext<ReferenceDateContextType | undefined>(undefined);

export function ReferenceDateProvider({ children }: { children: React.ReactNode }) {
    const [referenceDate, setReferenceDate] = useState<Date>(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const getDateRangeByPeriod = (type: PeriodType, weekNumber?: number): DateRange => {
        const today = new Date();
        const isCurrentMonth = referenceDate.getMonth() === today.getMonth() && 
                             referenceDate.getFullYear() === today.getFullYear();
        const isCurrentYear = referenceDate.getFullYear() === today.getFullYear();

        switch (type) {
            case 'weekly': {
                const weeksInMonth = [];
                const monthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
                const monthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
                
                let currentDate = new Date(monthStart);
                while (currentDate <= monthEnd) {
                    const weekStart = new Date(currentDate);
                    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                    
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    
                    if (weekEnd >= monthStart) {
                        weeksInMonth.push({
                            startDate: new Date(Math.max(weekStart.getTime(), monthStart.getTime())),
                            endDate: new Date(Math.min(weekEnd.getTime(), monthEnd.getTime()))
                        });
                    }
                    
                    currentDate.setDate(currentDate.getDate() + 7);
                }
                
                const selectedWeek = weekNumber !== undefined ? 
                    weeksInMonth[weekNumber] : 
                    weeksInMonth[0];
                
                if (!selectedWeek) {
                    return {
                        startDate: monthStart,
                        endDate: isCurrentMonth ? today : monthEnd
                    };
                }
                
                return {
                    startDate: selectedWeek.startDate,
                    endDate: isCurrentMonth && selectedWeek.endDate > today ? today : selectedWeek.endDate
                };
            }
            
            case 'monthly': {
                const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
                const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
                
                return {
                    startDate: start,
                    endDate: isCurrentMonth ? today : end
                };
            }
            
            case 'yearly': {
                const start = new Date(referenceDate.getFullYear(), 0, 1);
                const end = new Date(referenceDate.getFullYear(), 11, 31);
                
                return {
                    startDate: start,
                    endDate: isCurrentYear ? today : end
                };
            }
            
            default:
                return {
                    startDate: referenceDate,
                    endDate: referenceDate
                };
        }
    };

    return (
        <ReferenceDateContext.Provider
            value={{
                referenceDate,
                setReferenceDate,
                getDateRangeByPeriod
            }}
        >
            {children}
        </ReferenceDateContext.Provider>
    );
}

export function useReferenceDate() {
    const context = useContext(ReferenceDateContext);
    if (context === undefined) {
        throw new Error('useReferenceDate must be used within a ReferenceDateProvider');
    }
    return context;
}

export function getWeeksInMonth(date: Date): number {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let weeks = 0;
    let current = new Date(start);
    
    while (current <= end) {
        weeks++;
        current.setDate(current.getDate() + 7);
    }
    
    return weeks;
}