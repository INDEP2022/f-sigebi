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
