//Interface Provisional sin Validar
export interface IPackage {
  numberPackage?: number;
  description: string;
  typePackage: number;
  amount: number;
  dateElaboration: string;
  dateCapture: string;
  dateCaptureHc: string;
  statuspack: string;
  numberClassifyGood: number;
  numberLabel: number;
  unit: string;
  numberStore: number;
  numberRecord: number;
  status: string;
  numbertrainemiaut: number;
  dateValid: string;
  dateauthorize: string;
  dateClosed: string;
  dateApplied: string;
  cvePackage: string;
  dateCancelled: string;
  InvoiceUniversal: number;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  numberDelegation: number;
  useElaboration: string;
  useValid: string;
  useauthorize: string;
  useClosed: string;
  useApplied: string;
  useCancelled: string;
  numberGoodFather: number;
  nbOrigin: string;
}

export interface IPackageInfo {
  packageNumber: number;
  delegationNumber: number;
  proceedingNumber: number;
  goodFatherNumber: number;
  descGood: string;
  amountGood: number;
  unitGood: number;
  statusGood: number;
}

export interface IFoliovInvoice {
  vExecute: string;
  vYear: number;
}

export interface IDecPackage extends IPrincipalPackageDec {
  amount: number;
  amountConv: number;
  numberRecord: number;
  nbOrigin: string;
}

export interface IPrincipalPackageDec {
  numberPackage: string;
  numberGood: number;
}
