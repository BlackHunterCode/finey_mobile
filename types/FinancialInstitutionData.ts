import PluggyAccountIds from "./PluggyAccountIds";

export interface FinancialInstitutionData {
    institutionId: string;
    institutionName: string;
    institutionImageUrl: string;
    accounts: PluggyAccountIds[];
}