export interface IPackageGoodEnc {
  numberPackage: string;
  delegation: { description: string; id: string };
  description: string;
  typePackage: string;
  amount: string;
  dateElaboration: string;
  dateCapture: string;
  dateCaptureHc: string;
  statuspack: string;
  numberClassifyGood: string;
  numberLabel: string;
  unit: string;
  numberStore: string;
  numberRecord: string;
  status: string;
  numbertrainemiaut: string;
  dateValid: string;
  dateauthorize: string;
  dateClosed: string;
  dateApplied?: any;
  cvePackage: string;
  dateCancelled?: any;
  InvoiceUniversal: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  numberDelegation: string;
  useElaboration: string;
  useValid: string;
  useauthorize: string;
  useClosed: string;
  useApplied?: any;
  useCancelled?: any;
  numberGoodFather: string;
  nbOrigin?: any;
  cat_almacenes: Catalmacenes;
  cat_sssubtipo_bien: Catsssubtipobien;
  cat_etiqueta_bien: Catetiquetabien;
  unidadesmed: Unidadesmed;
}

interface Unidadesmed {
  unit: string;
  decimals: string;
  recordNumber: string;
  description: string;
  unitNumber: string;
  nbOrigin?: any;
}

interface Catetiquetabien {
  labelNumber: string;
  description: string;
  nbOrigin?: any;
}

interface Catsssubtipobien {
  classifyGoodNumber: string;
  sssubtypeNumber: string;
  description: string;
  Type: string;
  subtypeNumber: string;
  ssubtypeNumber: string;
  recordNumber: string;
  classificationalternatesNumber: string;
  nbOrigin?: any;
}

interface Catalmacenes {
  storeNumber: string;
  description: string;
  location: string;
  responsible: string;
  recordNumber: string;
  codeState: string;
  codeCity: string;
  codeMunicipality: string;
  codeLocation: string;
  indAsset: string;
  storeType: string;
  delegationBeef: string;
}
