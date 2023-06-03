export interface IGeneric {
  name: string;
  keyId: number;
  description: string;
  userCreation: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  version: number;
  active: string;
  editable: string;
}

export interface IStateConservation {
  keyId: number;
  description: string;
}

export interface IMeasureUnit {
  indFraction: number;
  measureTlUnit: string;
  uomCode: string;
}

export interface IPhysicalStatus {
  keyId: number;
  description: string;
}
