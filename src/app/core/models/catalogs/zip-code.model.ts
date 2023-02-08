export interface IZipCode {
  code: string;
  entityKey: string;
  townshipKey: string;
  localityKey: string;
  settlementKey: string;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
}

export interface IZipCodeGoodQuery {
  codePostal: string;
  codeState: string;
  keyState: number;
  keyTownship: number;
  nameSettlement: string;
  keySettlement: number;
}
