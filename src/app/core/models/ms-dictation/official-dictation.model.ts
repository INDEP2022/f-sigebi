export interface IOfficialDictation {
  officialNumber: number;
  typeDict: string;
  sender: string;
  city: number;
  text1: string;
  text2: string;
  recipient: string;
  registerNumber: number;
  delegacionRecipientNumber: number;
  recipientDepartmentNumber: number;
  statusOf: string;
  recipientEsxt: string;
  desSenderPa: string;
  text3: string;
  text2To: string;
  notaryNumber: number;
  cveChargeRem: string;
}

export interface IOfficialDictation2 {
  officialNumber: number | null;
  typeDict: string | null;
  sender: string | null;
  city: number | null;
  text1: string | null;
  text2: string | null;
  recipient: string | null;
  registerNumber: number | null;
  delegacionRecipientNumber: number | null;
  recipientDepartmentNumber: number | null;
  statusOf: string | null;
  recipientEsxt: string | null;
  desSenderPa: string | null;
  text3: string | null;
  text2To: string | null;
  notaryNumber: number | null;
  cveChargeRem: string | null;
}
