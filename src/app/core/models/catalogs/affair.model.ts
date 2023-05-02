export interface IAffair {
  // code: number | null;
  // description: string | null;
  // relationPropertyKey: string | null;
  // referralNoteType: string | null;
  // versionUser: string | null;
  // creationUser: string | null;
  // creationDate: Date | null;
  // editionUser: string | null;
  // modificationDate: Date | null;
  // idRegister: number | null;
  id: number;
  description: string;
  referralNoteType?: string;
  versionUser?: string;
  version?: number;
  processDetonate?: string;
  clv?: string;
  status?: number;
  registerNumber?: number;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  nameAndId?: string;
  nbOrigen?: 'SAMI' | 'SIAB';
}
