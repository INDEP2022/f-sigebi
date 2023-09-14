export interface IReceipt {
  id?: number;
  actId?: number;
  catIdFuncSeg?: number;
  catIdWitnessOne?: number;
  catIdWitnessTwo?: number;
  chargeSae?: string;
  seal?: string;
  plateNumber?: string;
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
  typeTransport?: string;
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
  receiptId?: number;
  electronicSignatureEnt?: number;
  electronicSignatureReceipt?: number;
  folioReceipt?: string;
}

export interface IRecepitGuard {
  id: number;
  nameWitnessOne?: string;
  nameWitnessTwo?: string;
  typeReceipt?: string;
  officialSeg?: string;
  chargeSeg?: string;
  officialSae?: string;
  chargeSae?: string;
  contentId?: string;
  typeTransport?: string;
  guard?: number;
  idGood?: number;
  goodId?: number;
  receiptGuardId?: number;
  version?: number;
  receiptId?: number;
  statusReceiptGuard?: string;
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
