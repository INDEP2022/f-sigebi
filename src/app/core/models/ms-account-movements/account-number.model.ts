export interface IAccountNumber {
  accountNumber: number;
  accountNumberTransfer: number | null;
  registerNumber: number | null;
  delegationNumber: number | null;
  cveAccount: string;
  accountType: string;
  cveCurrency: string;
  square: string | null;
  branch: string | null;
  cveInterestCalcRate: string | null;
  cveBank: string;
  isReference: string | null;
}
