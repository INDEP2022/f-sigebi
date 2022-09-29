export interface ISettlement {
  code: string;
  keyEntity: string;
  keyTownship: string;
  keyLocality: string;
  name: string | null;
  type: string;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  version: number | null;
}
