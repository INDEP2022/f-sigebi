export interface ITagXClasif {
  col6: number;
  lnuTransfereeNumber: number;
}

export interface IUnitXClassif {
  classifyGoodNumber: string;
  unit: string;
  registryNumber: string;
  nbOrigin: null;
  catSssubtypeGood: ICatSssubtypeGood[];
  medUnitsEntity: IMedUnitsEntity[];
}

export interface ICatSssubtypeGood {
  classifyGoodNumber: string;
  sssubtypeNumber: string;
  description: string;
  typeNumber: string;
  subtypeNumber: string;
  ssubtypeNumber: string;
  registryNumber: string;
  classificationAlternatesNumber: string;
  nbOrigin: null;
}

export interface IMedUnitsEntity {
  unit: string;
  decimals: string;
  registryNumber: string;
  description: string;
  unitNumber: string;
  nbOrigin: null;
}
export interface IEtiqXClassif {
  classifyGoodNumber: string;
  labelNumber: string;
  registryNumber: string;
  catSssubtypeGood: ICatSssubtypeGood[];
  catTagGood: ICatTagGood[];
}

export interface ICatTagGood {
  labelNumber: string;
  description: string;
  nbOrigin: null;
}
