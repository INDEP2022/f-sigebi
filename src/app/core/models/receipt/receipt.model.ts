export interface IReceipt {
  id: number;
  actId: number;
  catIdFuncSeg: number;
  catIdWitnessOne: number;
  catIdWitnessTwo: number;
  chargeSae: string;
  chargeSeg: string;
  closingDate: string;
  companySeg: string;
  contentId: number;
  contractNumber: string;
  expIdFuncSeg: number;
  expIdWitnessIne: number;
  expIdWitnessTwo: number;
  nameWitnessOne: string;
  nameWitnessTwo: string;
  noIdFuncSeg: number;
  noIdWitnessOne: number;
  noIdWitnessTwo: number;
  officialSae: string;
  officialSeg: string;
  programmingId: number;
  receiptDate: string;
  statusReceiptGuard: string;
  typeRceipt: string;
  version: number;
  vigencia: string;
}

export interface IRecepitGuard {
  guard: number;
  idGood: number;
  receiptGuardId: number;
  version: number;
}
