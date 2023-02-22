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
  id: string | number;
  tiieDays: number;
  tiieMonth: string;
  tiieYear: string;
  tiieAverage: number;
  registryDate: string;
  user: number;
}
