export interface ITempExpedient {
  id: number;
  courtNumber: number | null;
  observations: string;
  insertDate: Date;
  criminalCase: string;
  preliminaryInquiry: string;
  protectionKey: string;
  crimeKey: string;
  circumstantialRecord: string;
  keyPenalty: string;
  indicatedName: string;
  federalEntityKey: string;
  identifier: string;
  transferNumber: number;
  expTransferNumber: string;
  expedientType: string;
  stationNumber: number | null;
  authorityNumber: number | null;
  subject: string;
  noSubjectSij: number | null;
  typeTranssact: number | null;
  noOffice: string | null;
}
