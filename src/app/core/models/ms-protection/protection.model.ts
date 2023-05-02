export interface IProtection {
  id?: number;
  observations?: string;
  complainers?: string;
  recordNumber?: number;
  protectionType: string;
  delegationNumber?: number;
  proceedingsNumber?: number;
  protectionDate: Date;
  suspensionProvisional?: string;
  suspensionfinal?: string;
  cveProtection: string;
  minpubNumber?: number;
  reportPreviousDate?: Date;
  suspensionOfFlat?: string;
  subdelegationNumber?: number;
  courtNumber?: number;
  actReclaimed?: string;
  reportJustifiedDate?: Date;
}
