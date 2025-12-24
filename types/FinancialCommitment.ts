export default interface FinancialCommitment {
  id: string;
  name: string;
  description: string;
  type: string;
  cronExpression: string;
  value: number;
}

export interface FinancialCommitmentEncrypted {
  id: string;
  nameEncrypted: string;
  descriptionEncrypted: string;
  typeEncrypted: string;
  cronExpressionEncrypted: string;
  valueEncrypted: string;
}