import { AccountStatus } from "./AccountStatus";
import { FinancialInstitutionData } from "./FinancialInstitutionData";

export default interface UserInfo {
    accountId: string;
    fullName: string;
    firstName: string;
    lastName: string | null;
    endDateTimeOfTutorialPeriod: Date;
    accountStatus: AccountStatus;
    connectedBanks: FinancialInstitutionData[];
}