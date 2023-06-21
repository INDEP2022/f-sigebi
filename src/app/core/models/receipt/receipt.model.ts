export interface IReceipt {
  id?: number;
  actId?: number;
  catIdFuncSeg?: number;
  catIdWitnessOne?: number;
  catIdWitnessTwo?: number;
  chargeSae?: string;
  chargeSeg?: string;
  closingDate?: string;
  companySeg?: string;
  statusReceipt?: string;
  contentId?: string;
  contractNumber?: string;
  expIdFuncSeg?: number;
  expIdWitnessIne?: number;
  expIdWitnessTwo?: number;
  nameWitnessOne?: string;
  nameWitnessTwo?: string;
  noIdFuncSeg?: number;
  noIdWitnessOne?: number;
  noIdWitnessTwo?: number;
  officialSae?: string;
  officialSeg?: string;
  programmingId?: number;
  receiptDate?: string;
  statusReceiptGuard?: string;
  typeRceipt?: string;
  version?: number;
  vigencia?: string;
  nameReceipt?: string;
  chargeReceipt?: string;
  nameDelivery?: string;
  chargeDelivery?: string;
  electronicSignatureEnt?: boolean;
  electronicSignatureReceipt?: boolean;
  folioReceipt?: string;
}

export interface IRecepitGuard {
  guard: number;
  idGood: number;
  receiptGuardId: number;
  version: number;
  statusReceiptGuard: string;
}

export interface IReceipyGuardDocument {
  keyDoc?: string;
  autografos?: boolean;
  reporteUrl?: string;
  electronicos?: boolean;
  dDocTitle?: string;
  dSecurityGroup?: String;
  xidTransferente?: number;
  xidBien?: string;
  xNivelRegistroNSBDB?: string;
  xTipoDocumento?: number;
  xNoProgramacion?: number;
  xNombreProceso?: string;
  xDelegacionRegional?: number;
  xFolioProgramacion?: string;
}

export interface IReceiptwitness {
  nameWitness?: string;
  chargeWitness?: string;
  electronicSignature?: String;
  electronicSignatureName?: String;
}
