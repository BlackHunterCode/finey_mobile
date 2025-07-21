import { AccountStatus } from "./AccountStatus";

export default interface UserInfo {
    accountId: string;
    fullName: string;
    firstName: string;
    lastName: string | null;
    endDateTimeOfTutorialPeriod: Date;
    accountStatus: AccountStatus;
    connectedBanks: string[];
}