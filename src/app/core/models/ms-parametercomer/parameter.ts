export interface IParameter {
  idParam: string;
  idValue: string;
  description: string;
  idDirection: string;
  eventTypeId: null;
}

export interface IBrand {
  id: string;
  brandDescription: string;
}

export interface ISubBrands {
  idBrand: string;
  idSubBrand: string;
  subBrandDescription: string;
}

export interface ITiieV1 {
  id: number;
  tiieDays: number;
  tiieMonth: number;
  tiieYear: number;
  tiieAverage: number;
  registryDate: string;
  user: string;
}

export interface IComerLayoutsH {
  id: number;
  descLayout: string;
  screenKey: string;
  table: string;
  criterion: string;
  indActive: boolean;
  registryNumber: number;
}

export interface IComerLayouts {
  idLayout: number;
  idConsec: number;
  position: number;
  column: string;
  type: string;
  length: number;
  constant: string | number;
  carFilling: number;
  justification: string;
  decimal: string;
  dateFormat: string;
  registryNumber: number;
}

export interface ILay {
  idLayout: number;
  idConsec: number;
}

export interface IL {
  idLayout: number;
}

export interface IPhoto {
  id: number;
  route: URL;
  status: string;
}
