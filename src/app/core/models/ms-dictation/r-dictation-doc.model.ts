export interface IRDictationDoc {
  numberClassifyGood: number;

  cveDocument: string;

  typeDictation: string;

  numberRecord: number;

  crime: string;

  required: string;

  typeSteeringwheel: string;

  documentDetails: string | IDocumentDetails;
}

export interface IDocumentDetails {
  key: string;
  description: string;
  typeDictum: string;
  numRegister: number;
  nbOrigin: string;
}
